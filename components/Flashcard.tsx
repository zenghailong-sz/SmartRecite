import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FlashcardData, CardType } from '../types';
import { Volume2, Sparkles, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { playGameSound, speakText } from '../utils/media';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  mode?: 'read' | 'spell';
  direction?: 'en-zh' | 'zh-en';
  onAnswer?: (isCorrect: boolean) => void;
  onComplete?: () => void;
  isVisible?: boolean; 
}

const getPOSStyle = (pos: string) => {
    const p = pos.toLowerCase();
    if (p.includes('adj')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (p.includes('adv')) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (p.includes('v.')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (p.includes('n.')) return 'bg-sky-100 text-sky-700 border-sky-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
};

const getDynamicFontSize = (text: string, isChinese: boolean) => {
    // 移动端整体降一档：以 base / sm 断点同时声明。
    if (isChinese) {
        return text.length > 10
            ? 'text-2xl sm:text-3xl md:text-4xl'
            : 'text-3xl sm:text-4xl md:text-5xl';
    } else {
        // "intelligently" 13 字符 -> 5xl, "hesitate" 8 字符 -> 6xl，移动端各下降两档以避免溢出。
        if (text.length > 16) return 'text-2xl sm:text-3xl md:text-4xl';
        if (text.length > 10) return 'text-3xl sm:text-4xl md:text-5xl';
        return 'text-4xl sm:text-5xl md:text-6xl';
    }
};

const normalizeForComparison = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\.{3}|…/g, " ") // Treat ellipses as spaces
      .replace(/[’‘]/g, "'")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/our/g, "or")
      .replace(/ise/g, "ize")
      .replace(/tre/g, "ter")
      .replace(/lling/g, "ling")
      .replace(/programme/g, "program");
};

const renderMemoryBars = (level: number) => (
    <div className="flex gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-1.5 h-4 rounded-full transition-all duration-300 ${i <= level ? (level === 5 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]') : 'bg-gray-200'}`} />
      ))}
    </div>
);

// --- Sub-Component: SpellCard ---
const SpellCard = memo(({ data, onAnswer, onComplete, direction, isVisible }: FlashcardProps) => {
    const [inputValue, setInputValue] = useState('');
    const [spellStatus, setSpellStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [attempts, setAttempts] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const controls = useAnimation();

    useEffect(() => {
        if (!data) return;
        setInputValue('');
        setSpellStatus('idle');
        setAttempts(0);
    }, [data?.id]);

    useEffect(() => {
        if (isVisible && data) {
             const timer = setTimeout(() => {
                inputRef.current?.focus();
             }, 50);
             return () => clearTimeout(timer);
        }
    }, [isVisible, data?.id, attempts, spellStatus]);

    useEffect(() => {
        if (!isVisible || spellStatus === 'idle') return;
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onComplete?.();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [spellStatus, onComplete, isVisible]);

    const handleSpeak = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (data?.front) {
            speakText(data.front);
        }
        inputRef.current?.focus();
    };

    const checkSpelling = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        if (spellStatus !== 'idle') {
            playGameSound('click');
            onComplete?.();
            return;
        }
        const userNormalized = normalizeForComparison(inputValue);
        const targetNormalized = normalizeForComparison(data.front);

        if (userNormalized === targetNormalized) {
            setSpellStatus('success');
            playGameSound('correct');
            if ((window as any).confetti) {
                (window as any).confetti({
                    particleCount: 60, spread: 70, origin: { y: 0.7 },
                    colors: ['#22c55e', '#4ade80', '#16a34a'],
                    disableForReducedMotion: true, zIndex: 1500,
                    gravity: 1.2, scalar: 0.7, ticks: 100
                });
            }
            onAnswer?.(true);
            setTimeout(() => onComplete?.(), 120);
        } else {
            if (attempts === 0) {
                setAttempts(1);
                playGameSound('wrong'); 
                controls.start({ x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } });
                return;
            }
            setSpellStatus('error');
            playGameSound('wrong');
            controls.start({ x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } });
            onAnswer?.(false); 
        }
    };

    if (!data) return null;

    return (
        <div className="relative w-full h-full bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-10 overflow-hidden">
            <div className="w-full flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${data.type === CardType.WORD ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {data.type === CardType.WORD ? 'SPELL' : 'PHRASE'}
                </span>
                {renderMemoryBars(data.level)}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center w-full relative">
                {/* Chinese Hint */}
                <h3 className={`font-black text-gray-900 text-center mb-3 sm:mb-6 tracking-tight leading-tight ${getDynamicFontSize(data.back, true)}`}>
                    {data.back}
                </h3>

                <div className="flex gap-3 mb-3 sm:mb-6">
                    {data.pos && (
                        <div className={`px-3 py-1.5 rounded-lg border-2 text-sm font-black transform -rotate-2 ${getPOSStyle(data.pos)}`}>
                            {data.pos}
                        </div>
                    )}
                    <button 
                        type="button"
                        onClick={handleSpeak}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 rounded-lg transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                    >
                        <Volume2 size={14} /> <span>Play</span>
                    </button>
                </div>

                <form onSubmit={checkSpelling} className="w-full relative group mb-2">
                     <motion.input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => { 
                            if (spellStatus !== 'idle') setSpellStatus('idle'); 
                            setInputValue(e.target.value); 
                        }}
                        disabled={spellStatus === 'error'}
                        placeholder={attempts > 0 ? "Try again..." : ""}
                        animate={controls}
                        className={`w-full text-center text-xl sm:text-2xl md:text-3xl p-3 sm:p-4 md:p-5 border-4 rounded-[1.5rem] sm:rounded-[2rem] outline-none font-black tracking-tight shadow-sm placeholder:text-red-300/50 transition-colors duration-75 ${
                            spellStatus === 'success' ? 'border-green-500 text-green-700 bg-green-50/50 shadow-green-100' :
                            spellStatus === 'error' ? 'border-red-500 text-red-700 bg-red-50/50 shadow-red-100' :
                            attempts > 0 ? 'border-orange-300 text-orange-600 bg-orange-50/30 focus:border-orange-400' :
                            'border-gray-50 focus:border-indigo-500 text-gray-900 bg-gray-50/50 focus:bg-white hover:border-gray-200'
                        }`}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                     />
                     <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        {spellStatus === 'success' && <CheckCircle2 className="text-green-500" size={28} />}
                        {spellStatus === 'error' && <XCircle className="text-red-500" size={28} />}
                        {spellStatus === 'idle' && attempts > 0 && <AlertCircle className="text-orange-400" size={28} />}
                     </div>
                </form>

                {/* Status / Correction Area (Absolute to prevent layout shift) */}
                <div className="absolute bottom-0 w-full flex flex-col items-center justify-end h-24 pointer-events-none">
                    {spellStatus === 'error' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center pointer-events-auto">
                            <p className="text-red-500 font-black mb-1 uppercase tracking-[0.2em] text-[9px]">CORRECT SPELLING</p>
                            <div className="flex items-center gap-3 bg-indigo-50/90 backdrop-blur border border-indigo-100/50 px-6 py-2 rounded-2xl shadow-sm">
                                <span className={`font-black text-indigo-600 tracking-tight text-2xl`}>{data.front}</span>
                                <button onClick={(e) => { e.preventDefault(); handleSpeak(); }} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1"><Volume2 size={18}/></button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-1.5 h-6">
              <div className="text-[10px] text-gray-300 font-black tracking-widest uppercase flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-50 rounded border border-gray-100 shadow-sm text-[9px]">ENTER</kbd> 
                  <span className="opacity-60">{spellStatus !== 'idle' ? 'TO NEXT' : 'TO CHECK'}</span>
              </div>
            </div>
        </div>
    );
});

// --- Sub-Component: ReadCard ---
const ReadCard = memo(({ data, isFlipped, onFlip, direction }: FlashcardProps) => {
    const handleFlip = () => {
        playGameSound('flip');
        onFlip();
    };

    const handleSpeak = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (data?.front) {
            speakText(data.front);
        }
    };

    if (!data) return null;

    const isEnToZh = direction === 'en-zh';
    
    // Dynamic Font Logic
    const currentText = isEnToZh ? data.front : data.back;
    const isChineseText = !isEnToZh;
    const fontSizeClass = getDynamicFontSize(currentText, isChineseText);

    return (
        <motion.div 
            className="relative w-full h-full transform-style-3d shadow-2xl rounded-[3.5rem]" 
            initial={false} 
            animate={{ rotateY: isFlipped ? 180 : 0 }} 
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
            {/* FRONT */}
            <div className="absolute w-full h-full backface-hidden bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] border border-gray-100 flex flex-col items-center justify-center p-5 sm:p-10 md:p-14 group-hover:border-indigo-100 transition-colors">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 flex items-center gap-2 sm:gap-4">
                    <span className={`text-[10px] font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl uppercase tracking-widest ${data.type === CardType.WORD ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                        {isEnToZh ? (data.type === CardType.WORD ? 'WORD' : 'PHRASE') : 'MEANING'}
                    </span>
                    {renderMemoryBars(data.level)}
                </div>

                {isEnToZh && (
                    <button className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 text-gray-300 hover:text-indigo-600 p-2 sm:p-3 md:p-4 rounded-2xl hover:bg-indigo-50 transition-all group/speak" onClick={handleSpeak}>
                        <Volume2 className="group-hover/speak:scale-110 transition-transform w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                    </button>
                )}

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {isEnToZh && data.pos && (
                        <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl border-2 text-sm sm:text-base md:text-lg font-black mb-3 sm:mb-6 shadow-sm transform -rotate-1 ${getPOSStyle(data.pos)}`}>
                            {data.pos}
                        </div>
                    )}

                    {/* 主文本，按字符长度 + 断点动态缩放 */}
                    <h2 className={`font-black text-gray-900 text-center leading-tight tracking-tight px-2 sm:px-6 md:px-8 break-words max-w-full ${fontSizeClass}`}>
                        {currentText}
                    </h2>
                </div>

                <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 flex flex-col items-center gap-2 sm:gap-3">
                    <div className="h-1 w-10 sm:w-12 bg-gray-100 rounded-full"></div>
                    <p className="text-gray-300 text-[9px] sm:text-[10px] font-black tracking-[0.3em] uppercase opacity-40 animate-pulse">Click to Reveal</p>
                </div>
            </div>

            {/* BACK */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] flex flex-col items-center justify-center p-5 sm:p-10 md:p-14 rotate-y-180 shadow-inner">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 text-indigo-300/60 text-[10px] font-black tracking-[0.2em] uppercase">
                    {isEnToZh ? 'CHINESE TRANSLATION' : (data.type === CardType.WORD ? 'ENGLISH WORD' : 'PHRASE')}
                </div>

                {!isEnToZh && (
                    <button className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 text-indigo-300 hover:text-white p-2 sm:p-3 md:p-4 rounded-2xl hover:bg-white/10 transition-all group/speak" onClick={handleSpeak}>
                        <Volume2 className="group-hover/speak:scale-110 transition-transform w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                    </button>
                )}

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {!isEnToZh && data.pos && (
                        <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl border-2 text-sm sm:text-base md:text-lg font-black mb-3 sm:mb-6 shadow-lg transform -rotate-1 ${getPOSStyle(data.pos)}`}>
                            {data.pos}
                        </div>
                    )}

                    <h3 className={`font-black text-white text-center leading-tight tracking-tight px-2 sm:px-6 md:px-8 break-words max-w-full ${getDynamicFontSize(isEnToZh ? data.back : data.front, isEnToZh)}`}>
                        {isEnToZh ? data.back : data.front}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
});

// --- Main Switcher Component ---
const Flashcard: React.FC<FlashcardProps> = (props) => {
    if (!props.data) return null;
    const isSpellMode = props.mode === 'spell';

    return (
        // 宽度上限保留原 600px 桌面美学，移动端塞满父容器；
        // 用 aspect-[10/7] 保持原 600x420 的比例，避免高度写死导致移动端溢出。
        <div className="relative w-full max-w-[600px] aspect-[10/7] mx-auto perspective-1000 group">
             {/* Read Card Layer */}
             <div className={isSpellMode ? 'hidden' : 'block h-full'}>
                <ReadCard {...props} />
             </div>

             {/* Spell Card Layer */}
             <div className={isSpellMode ? 'block h-full' : 'hidden'}>
                <SpellCard {...props} isVisible={isSpellMode} />
             </div>
        </div>
    );
};

export default Flashcard;