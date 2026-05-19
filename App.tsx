import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { INTERVALS_MINUTES } from './constants';
import { PRELOADED_UNITS } from './vocabData';
import { FlashcardData, Unit, CardType } from './types';
import StudyGuideModal from './components/StudyGuideModal';
import Header from './components/Header';
import ImportModal from './components/ImportModal';
import ResetConfirmModal from './components/ResetConfirmModal';
import PinLockModal from './components/PinLockModal';
import DashboardModal from './components/DashboardModal';
import GraduationView from './components/GraduationView';
import AuthErrorBanner from './components/AuthErrorBanner';
import StudyControlConsole from './components/StudyControlConsole';
import CardStudyView from './components/CardStudyView';
import ListStudyView from './components/ListStudyView';
import RoundFinishedView from './components/RoundFinishedView';
import { LoginPrompt, NoActiveCards, NoUnitSelected } from './components/EmptyStudyStates';
import { UnitListModal, DeleteConfirmModal } from './components/UnitListModal';
import { isRelated } from './utils/wordFamily';
import { playGameSound, speakText } from './utils/media';
import { usePinAuth } from './hooks/usePinAuth';
import { useFirebase } from './FirebaseContext';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  writeBatch, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const REGISTRY_KEY = 'flashcards_app_registry_v1';
const UNIT_PREFIX = 'flashcards_unit_';
const MIGRATION_KEY = 'flashcards_migration_complete';

type FilterType = 'all' | 'word' | 'phrase' | 'sentence';
type ViewMode = 'card' | 'list';
type FlipDirection = 'en-zh' | 'zh-en';

const isCardInFilter = (card: FlashcardData, filter: FilterType) => {
    if (filter === 'all') return true;
    if (filter === 'word') return card.type === CardType.WORD;
    if (filter === 'phrase') return card.type === CardType.PHRASE;
    if (filter === 'sentence') return card.type === CardType.SENTENCE;
    return true;
};

export default function App() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // UI States
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  
  // App Config States
  const [autoPlay, setAutoPlay] = useState(true); 
  const [studyMode, setStudyMode] = useState<'read' | 'spell'>('read');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [cardFilter, setCardFilter] = useState<FilterType>('all');
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('en-zh');
  
  // Cram Mode State
  const [cramMode, setCramMode] = useState(false);

  // Gamification State
  const [streak, setStreak] = useState(0);
  const [showGraduation, setShowGraduation] = useState(false);

  // Ref to track audio playback to prevent double-plays on state updates
  const lastPlayedCardId = useRef<string | null>(null);

  // Auth Hook
  const { 
    isLocked, 
    requireAuth, 
    authModalOpen, 
    closeAuthModal, 
    onAuthSuccess, 
    verifyPin, 
  } = usePinAuth();

  const { user, isAuthReady } = useFirebase();

  // Migration Logic
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const runMigration = async () => {
      const isMigrated = localStorage.getItem(MIGRATION_KEY);
      if (isMigrated) return;

      console.log('Starting migration to Firestore...');
      const registryRaw = localStorage.getItem(REGISTRY_KEY);
      const registry: Unit[] = registryRaw ? JSON.parse(registryRaw) : [];

      if (registry.length === 0) {
        localStorage.setItem(MIGRATION_KEY, 'true');
        return;
      }

      const batch = writeBatch(db);
      
      for (const unit of registry) {
        const cardsRaw = localStorage.getItem(UNIT_PREFIX + unit.id);
        let masteredCount = 0;
        let learningCount = 0;
        let unitCards: FlashcardData[] = [];

        if (cardsRaw) {
          unitCards = JSON.parse(cardsRaw);
          masteredCount = unitCards.filter(c => c.level === 5).length;
          learningCount = unitCards.filter(c => c.level < 5).length;
        }

        const unitRef = doc(db, 'users', user.uid, 'units', unit.id);
        batch.set(unitRef, { 
          ...unit, 
          ownerId: user.uid,
          masteredCount,
          learningCount
        });

        if (unitCards.length > 0) {
          for (const card of unitCards) {
            const cardRef = doc(db, 'users', user.uid, 'units', unit.id, 'cards', card.id);
            batch.set(cardRef, card);
          }
        }
      }

      try {
        await batch.commit();
        localStorage.setItem(MIGRATION_KEY, 'true');
        console.log('Migration complete.');
      } catch (error) {
        console.error('Migration failed:', error);
      }
    };

    runMigration();
  }, [user, isAuthReady]);

  // 账号切换 / 退出登录时清空内存会话态（streak、当前卡片位置、Cram 等），
  // 避免 A 的临时状态渗透到 B 的视图。Firestore 数据本身按 uid 隔离，这里只清非持久化的 React state。
  useEffect(() => {
    if (!user) {
      setActiveUnitId(null);
      setCurrentCardIndex(-1);
      setIsFlipped(false);
      setIsRoundFinished(false);
      setStreak(0);
      setShowGraduation(false);
      setCramMode(false);
    }
  }, [user]);

  // Sync Units
  useEffect(() => {
    if (!isAuthReady || !user) {
      setUnits([]);
      setIsDataLoading(false);
      return;
    }

    const unitsRef = collection(db, 'users', user.uid, 'units');
    const q = query(unitsRef, orderBy('name'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUnits = snapshot.docs.map(doc => doc.data() as Unit);
      
      // If no units exist in Firestore for a new user, seed them from PRELOADED_UNITS
      if (fetchedUnits.length === 0) {
        const seedUnits = async () => {
          const batch = writeBatch(db);
          PRELOADED_UNITS.forEach(preload => {
            const unitRef = doc(db, 'users', user.uid, 'units', preload.id);
            batch.set(unitRef, {
              id: preload.id,
              name: preload.name,
              count: preload.data.length,
              masteredCount: preload.data.filter(c => c.level === 5).length,
              learningCount: preload.data.filter(c => c.level < 5).length,
              createdAt: Date.now(),
              ownerId: user.uid
            });
            preload.data.forEach(card => {
              const cardRef = doc(db, 'users', user.uid, 'units', preload.id, 'cards', card.id);
              batch.set(cardRef, card);
            });
          });
          await batch.commit();
        };
        seedUnits();
      } else {
        setUnits(fetchedUnits);
        if (!activeUnitId && fetchedUnits.length > 0) {
          setActiveUnitId(fetchedUnits[0].id);
        }
      }
      setIsDataLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'units');
    });

    return () => unsubscribe();
  }, [user, isAuthReady, activeUnitId]);

  // Sync Cards
  useEffect(() => {
    if (!isAuthReady || !user || !activeUnitId) {
      setCards([]);
      return;
    }

    const cardsRef = collection(db, 'users', user.uid, 'units', activeUnitId, 'cards');
    const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
      const fetchedCards = snapshot.docs.map(doc => doc.data() as FlashcardData);
      setCards(fetchedCards);
      
      // Initialize Navigation if not already set or if cards changed significantly
      if (currentCardIndex === -1 && fetchedCards.length > 0) {
        resetNavigation(fetchedCards, cardFilter, cramMode, studyMode);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `units/${activeUnitId}/cards`);
    });

    return () => unsubscribe();
  }, [user, isAuthReady, activeUnitId]);

  const checkIsActive = useCallback((
    card: FlashcardData, 
    filter: FilterType, 
    isCram: boolean, 
    mode: 'read' | 'spell'
  ) => {
    if (filter === 'word' && card.type !== CardType.WORD) return false;
    if (filter === 'phrase' && card.type !== CardType.PHRASE) return false;
    if (filter === 'sentence' && card.type !== CardType.SENTENCE) return false;
    if (isCram) return card.level < 5;
    if (mode === 'spell') return card.level < 5 && (card.nextReview || 0) <= Date.now();
    return true;
  }, []);

  const isCardActive = useCallback((card: FlashcardData) => {
    return checkIsActive(card, cardFilter, cramMode, studyMode);
  }, [cardFilter, cramMode, studyMode, checkIsActive]);

  const resetNavigation = useCallback((
    targetCards: FlashcardData[], 
    filter: FilterType, 
    isCram: boolean, 
    mode: 'read' | 'spell'
  ) => {
    const firstActiveIndex = targetCards.findIndex(c => checkIsActive(c, filter, isCram, mode));
    setCurrentCardIndex(firstActiveIndex);
    setIsRoundFinished(false);
    setIsFlipped(false);
  }, [checkIsActive]);

  const loadUnit = (unitId: string) => {
    setActiveUnitId(unitId);
    setShowUnitMenu(false);
    setStreak(0);
    setShowGraduation(false);
    setCramMode(false);
    setCurrentCardIndex(-1); // Reset to trigger navigation reset in sync effect
  };

  // PERFORMANCE OPTIMIZATION: 
  // Explicit handlers for Mode/Filter/Cram changes instead of useEffect
  // prevents "Double Render" cycles (State Update -> Render -> Effect -> State Update -> Render).

  const handleStudyModeChange = (newMode: 'read' | 'spell') => {
      setStudyMode(newMode);
      // Immediately reset navigation based on the NEW mode
      if (cards.length > 0) {
          resetNavigation(cards, cardFilter, cramMode, newMode);
      }
  };

  const handleFilterChange = (newFilter: FilterType) => {
      setCardFilter(newFilter);
      if (cards.length > 0) {
          resetNavigation(cards, newFilter, cramMode, studyMode);
      }
  };

  const handleProtectedCramToggle = () => {
    playGameSound('click');
    requireAuth(() => {
        const newCramMode = !cramMode;
        setCramMode(newCramMode);
        if (cards.length > 0) {
            resetNavigation(cards, cardFilter, newCramMode, studyMode);
        }
    });
  };

  const nextCard = useCallback(() => {
    setCurrentCardIndex(prev => {
        let nextIndex = -1;
        for (let i = prev + 1; i < cards.length; i++) {
            if (isCardActive(cards[i])) {
                nextIndex = i;
                break;
            }
        }
        
        if (nextIndex === -1) {
            playGameSound('victory');
            setIsRoundFinished(true);
            return prev; 
        }
        
        return nextIndex;
    });
    setIsFlipped(false);
  }, [cards, isCardActive]);

  const prevCard = useCallback(() => {
    if (isRoundFinished) return;
    playGameSound('click');
    setCurrentCardIndex(prev => {
        let prevIndex = -1;
        for (let i = prev - 1; i >= 0; i--) {
            if (isCardActive(cards[i])) {
                prevIndex = i;
                break;
            }
        }
        if (prevIndex === -1) return prev;
        return prevIndex;
    });
    setIsFlipped(false);
  }, [cards, isCardActive, isRoundFinished]);

  const restartRound = () => {
      playGameSound('click');
      resetNavigation(cards, cardFilter, cramMode, studyMode);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'card' || showUnitMenu || showResetConfirm || showInfoModal || showGraduation || showImportModal || unitToDelete || authModalOpen || showDashboard) return;
      
      if (isRoundFinished) {
          const hasActiveCards = cards.some(c => isCardActive(c));
          // Only allow restart if there are actually cards to study, or if we need to switch filters
          if (e.key === 'Enter' && hasActiveCards) restartRound();
          return;
      }

      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      if (e.code === 'Space') {
        // Handle Spell Mode specifically
        if (studyMode === 'spell') {
             // If focused, allow typing space. If not focused (e.g. error state), prevent scrolling but DON'T flip.
             if (!isInputFocused) e.preventDefault(); 
             return; 
        }
        
        // Standard Read Mode behavior
        e.preventDefault();
        playGameSound('flip');
        setIsFlipped(v => !v);

      } else if (e.code === 'ArrowRight') {
        if (studyMode === 'spell') return; // Completely disable navigation in spell mode
        if (isInputFocused) return; // Disable navigation if typing in search/other inputs (though not present currently)
        nextCard();

      } else if (e.code === 'ArrowLeft') {
        if (studyMode === 'spell') return; // Completely disable navigation in spell mode
        if (isInputFocused) return;
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, showUnitMenu, showResetConfirm, showInfoModal, showGraduation, showImportModal, unitToDelete, studyMode, nextCard, prevCard, isRoundFinished, cards, isCardActive, authModalOpen, showDashboard]);

  const updateCardLevel = async (cardId: string, isCorrect: boolean) => {
      if (!user || !activeUnitId) return;

      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      const newLevel = isCorrect 
          ? Math.min(card.level + 1, 5) 
          : Math.max(card.level - 1, 0);
      
      const intervalIdx = Math.min(newLevel, INTERVALS_MINUTES.length - 1);
      const nextReview = Date.now() + (isCorrect ? INTERVALS_MINUTES[intervalIdx] : 0) * 60000;
      
      const cardRef = doc(db, 'users', user.uid, 'units', activeUnitId, 'cards', cardId);
      const unitRef = doc(db, 'users', user.uid, 'units', activeUnitId);

      try {
        const batch = writeBatch(db);
        batch.update(cardRef, { 
          level: newLevel, 
          nextReview, 
          lastReviewed: Date.now() 
        });

        // Recalculate unit stats if card level changed significantly (e.g. into or out of mastered)
        if ((card.level === 5 && newLevel < 5) || (card.level < 5 && newLevel === 5)) {
          const currentUnit = units.find(u => u.id === activeUnitId);
          if (currentUnit) {
            const newMasteredCount = (currentUnit.masteredCount || 0) + (newLevel === 5 ? 1 : -1);
            const newLearningCount = (currentUnit.learningCount || 0) + (newLevel === 5 ? -1 : 1);
            batch.update(unitRef, {
              masteredCount: newMasteredCount,
              learningCount: newLearningCount
            });
          }
        }

        await batch.commit();
        if (isCorrect) setStreak(prev => prev + 1);
        else setStreak(0);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `units/${activeUnitId}/cards/${cardId}`);
      }
  };

  useEffect(() => {
      // Check if ALL cards in the unit are Level 5
      if (studyMode === 'spell' && cards.length > 0 && cards.every(c => c.level === 5) && !showGraduation) {
          setShowGraduation(true);
          playGameSound('victory');
          if ((window as any).confetti) {
             const duration = 3000;
             const end = Date.now() + duration;
             (function frame() {
                (window as any).confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                (window as any).confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                if (Date.now() < end) requestAnimationFrame(frame);
             }());
          }
      }
  }, [cards, studyMode]); 

  // PERFORMANCE OPTIMIZATION: Auto-play with Debounce and Duplicate Prevention
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (viewMode === 'card' && autoPlay && currentCardIndex !== -1 && cards[currentCardIndex] && !showGraduation && !isRoundFinished) {
        
        const currentCard = cards[currentCardIndex];

        // PREVENT DOUBLE PLAY:
        // Only play if the card ID has changed since the last play.
        // This prevents the audio from re-triggering when `cards` state updates (e.g. level change)
        // but the user is still technically on the same card index before moving to the next.
        if (currentCard.id !== lastPlayedCardId.current) {
            
            // Wait 100ms. If user navigates away within 100ms, the cleanup function clears the timeout.
            timeoutId = setTimeout(() => {
                speakText(currentCard.front);
                lastPlayedCardId.current = currentCard.id;
            }, 100);
        }
    }
    
    return () => clearTimeout(timeoutId);
  }, [currentCardIndex, autoPlay, activeUnitId, viewMode, showGraduation, isRoundFinished, cards]);

  const stats = useMemo(() => {
    const effectiveFilter = viewMode === 'list' ? 'all' : cardFilter;
    const filtered = cards.filter(c => isCardInFilter(c, effectiveFilter));
    return {
        total: filtered.length,
        mastered: filtered.filter(c => c.level === 5).length,
        learning: filtered.filter(c => c.level < 5).length,
        due: filtered.filter(c => c.level < 5 && c.nextReview <= Date.now()).length
    };
  }, [cards, cardFilter, viewMode]);

  const handleImportUnitSuccess = async (name: string, normalizedData: FlashcardData[]) => {
      if (!user) return;
      const newId = `custom_${Date.now()}`;
      
      try {
        const batch = writeBatch(db);
        const unitRef = doc(db, 'users', user.uid, 'units', newId);
        batch.set(unitRef, { 
          id: newId, 
          name: name, 
          count: normalizedData.length, 
          masteredCount: normalizedData.filter(c => c.level === 5).length,
          learningCount: normalizedData.filter(c => c.level < 5).length,
          createdAt: Date.now(),
          ownerId: user.uid
        });

        normalizedData.forEach(card => {
          const cardRef = doc(db, 'users', user.uid, 'units', newId, 'cards', card.id);
          batch.set(cardRef, card);
        });

        await batch.commit();
        loadUnit(newId);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `units/${newId}`);
      }
  };

  const executeDelete = async () => {
    if (!unitToDelete || !user) return;
    
    try {
      const unitRef = doc(db, 'users', user.uid, 'units', unitToDelete);
      
      // Delete all cards first
      const cardsRef = collection(db, 'users', user.uid, 'units', unitToDelete, 'cards');
      const cardsSnap = await getDocs(cardsRef);
      const batch = writeBatch(db);
      cardsSnap.forEach(cardDoc => batch.delete(cardDoc.ref));
      batch.delete(unitRef);
      await batch.commit();

      if (activeUnitId === unitToDelete) {
        const remainingUnits = units.filter(u => u.id !== unitToDelete);
        if (remainingUnits.length > 0) loadUnit(remainingUnits[0].id);
        else {
            setActiveUnitId(null);
            setCards([]);
            setCurrentCardIndex(-1);
            setShowUnitMenu(false);
        }
      }
      setUnitToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `units/${unitToDelete}`);
    }
  };

  const handleReset = async () => {
     if (!user || !activeUnitId) return;

     try {
       const batch = writeBatch(db);
       cards.forEach(card => {
         const cardRef = doc(db, 'users', user.uid, 'units', activeUnitId, 'cards', card.id);
         batch.update(cardRef, {
           level: 0,
           nextReview: 0,
           lastReviewed: 0
         });
       });

       const unitRef = doc(db, 'users', user.uid, 'units', activeUnitId);
       batch.update(unitRef, {
         masteredCount: 0,
         learningCount: cards.length
       });

       await batch.commit();
       setShowResetConfirm(false);
       setShowGraduation(false);
       setStreak(0);
       playGameSound('flip');
       
       const effectiveFilter = viewMode === 'list' ? 'all' : cardFilter;
       setCramMode(false);
       // Navigation will be reset by the sync effect when cards update
     } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `units/${activeUnitId}/cards`);
     }
  };

  const handleTimeTravel = async (hours: number) => {
    if (!user) return;
    const ms = hours * 60 * 60 * 1000;
    
    try {
      const batch = writeBatch(db);
      for (const u of units) {
        const cardsRef = collection(db, 'users', user.uid, 'units', u.id, 'cards');
        const cardsSnap = await getDocs(cardsRef);
        cardsSnap.forEach(cardDoc => {
          const data = cardDoc.data() as FlashcardData;
          batch.update(cardDoc.ref, {
            nextReview: data.nextReview - ms
          });
        });
      }
      await batch.commit();
      playGameSound('flip');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'all_units/cards');
    }
  };

  const handleProtectedTimeTravel = (hours: number) => {
      requireAuth(() => handleTimeTravel(hours));
  };

  const handleProtectedDelete = (id: string) => {
    requireAuth(() => setUnitToDelete(id));
  };

  const handleProtectedImportOpen = () => {
    requireAuth(() => {
       setShowUnitMenu(false);
       setShowImportModal(true);
    });
  };

  const handleProtectedReset = () => {
    playGameSound('click');
    requireAuth(() => setShowResetConfirm(true));
  };

  const cardGroups = useMemo(() => {
    const filtered = cards; 
    const groups: FlashcardData[][] = [];
    if (filtered.length === 0) return groups;

    let currentGroup: FlashcardData[] = [filtered[0]];
    for (let i = 1; i < filtered.length; i++) {
        const prev = filtered[i - 1];
        const curr = filtered[i];
        if (curr.type === CardType.WORD && prev.type === CardType.WORD && isRelated(prev.front, curr.front)) currentGroup.push(curr);
        else {
            groups.push(currentGroup);
            currentGroup = [curr];
        }
    }
    groups.push(currentGroup);
    return groups;
  }, [cards]);

  const activeCount = useMemo(() => {
     return cards.filter(c => checkIsActive(c, cardFilter, cramMode, studyMode)).length;
  }, [cards, cardFilter, cramMode, studyMode]);

  const currentActivePosition = useMemo(() => {
    if (currentCardIndex === -1) return 0;
    let count = 0;
    for (let i = 0; i <= currentCardIndex; i++) {
        if (checkIsActive(cards[i], cardFilter, cramMode, studyMode)) {
            count++;
        }
    }
    return count;
  }, [cards, currentCardIndex, cardFilter, cramMode, studyMode]);

  const totalMatchingCards = useMemo(() => {
    return cards.filter(c => isCardInFilter(c, cardFilter)).length;
  }, [cards, cardFilter]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Header 
        unitName={units.find(u => u.id === activeUnitId)?.name}
        stats={stats}
        streak={streak}
        onOpenUnitMenu={() => { playGameSound('click'); setShowUnitMenu(true); }}
        onOpenGuide={() => { playGameSound('click'); setShowInfoModal(true); }}
        onOpenDashboard={() => { playGameSound('click'); setShowDashboard(true); }}
        onReset={handleProtectedReset}
        isLocked={isLocked}
        onToggleLock={() => {}}
      />

      <AuthErrorBanner />

      <main className="max-w-6xl mx-auto px-10 py-12">
        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-48">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-black tracking-widest uppercase text-xs">正在连接云端数据库...</p>
          </div>
        ) : !user ? (
          <LoginPrompt />
        ) : !showGraduation && (
          <StudyControlConsole
            cramMode={cramMode}
            viewMode={viewMode}
            cardFilter={cardFilter}
            studyMode={studyMode}
            flipDirection={flipDirection}
            autoPlay={autoPlay}
            isLocked={isLocked}
            onCramToggle={handleProtectedCramToggle}
            onViewModeChange={setViewMode}
            onFilterChange={handleFilterChange}
            onStudyModeChange={handleStudyModeChange}
            onFlipDirectionChange={setFlipDirection}
            onToggleAutoPlay={() => setAutoPlay(!autoPlay)}
          />
        )}

        {showGraduation ? (
            <GraduationView 
                unitName={units.find(u => u.id === activeUnitId)?.name} 
                onNextUnit={() => { playGameSound('click'); setShowUnitMenu(true); }} 
            />
        ) : (
            <>
                {viewMode === 'list' ? (
                    <ListStudyView cardGroups={cardGroups} allCards={cards} />
                ) : (
                    <div className="flex flex-col items-center mt-4">
                        {isRoundFinished ? (
                            <RoundFinishedView
                                totalMatchingCards={totalMatchingCards}
                                activeCount={activeCount}
                                cardFilter={cardFilter}
                                cramMode={cramMode}
                                studyMode={studyMode}
                                onResetFilter={() => { playGameSound('click'); setCardFilter('all'); }}
                                onExitCram={() => { playGameSound('click'); setCramMode(false); }}
                                onRestart={restartRound}
                            />
                        ) : currentCardIndex !== -1 && cards[currentCardIndex] ? (
                            <CardStudyView
                                card={cards[currentCardIndex]}
                                isFlipped={isFlipped}
                                onFlip={() => setIsFlipped(!isFlipped)}
                                studyMode={studyMode}
                                flipDirection={flipDirection}
                                onAnswer={(isCorrect) => updateCardLevel(cards[currentCardIndex].id, isCorrect)}
                                onComplete={nextCard}
                                onPrev={prevCard}
                                onNext={nextCard}
                                cramMode={cramMode}
                                currentActivePosition={currentActivePosition}
                                activeCount={activeCount}
                            />
                        ) : activeUnitId ? (
                            <NoActiveCards
                                cramMode={cramMode}
                                onEnableCram={handleProtectedCramToggle}
                                onResetFilter={() => setCardFilter('all')}
                            />
                        ) : (
                            <NoUnitSelected />
                        )}
                    </div>
                )}
            </>
        )}
      </main>

      <PinLockModal 
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        onSuccess={onAuthSuccess}
        verifyPin={verifyPin}
      />
      <StudyGuideModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
      <DashboardModal 
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        units={units}
        onSelectUnit={loadUnit}
        onTimeTravel={handleProtectedTimeTravel} 
        isLocked={isLocked} 
      />
      <UnitListModal 
        isOpen={showUnitMenu}
        onClose={() => setShowUnitMenu(false)}
        units={units}
        activeUnitId={activeUnitId}
        onSelectUnit={loadUnit}
        onDeleteUnit={handleProtectedDelete} 
        onOpenImport={handleProtectedImportOpen} 
        isLocked={isLocked}
      />
      <DeleteConfirmModal 
        unitName={units.find(u => u.id === unitToDelete)?.name}
        onConfirm={executeDelete}
        onCancel={() => setUnitToDelete(null)}
      />
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onImportSuccess={handleImportUnitSuccess}
      />
      <ResetConfirmModal 
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}