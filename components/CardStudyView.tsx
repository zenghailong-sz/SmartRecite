import React from 'react';
import { ArrowLeft, ArrowRight, Flame, Sparkles } from 'lucide-react';
import Flashcard from './Flashcard';
import { FlashcardData } from '../types';

interface CardStudyViewProps {
  card: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  studyMode: 'read' | 'spell';
  flipDirection: 'en-zh' | 'zh-en';
  onAnswer: (isCorrect: boolean) => void;
  onComplete: () => void;
  onPrev: () => void;
  onNext: () => void;
  cramMode: boolean;
  currentActivePosition: number;
  activeCount: number;
}

const CardStudyView: React.FC<CardStudyViewProps> = ({
  card,
  isFlipped,
  onFlip,
  studyMode,
  flipDirection,
  onAnswer,
  onComplete,
  onPrev,
  onNext,
  cramMode,
  currentActivePosition,
  activeCount,
}) => {
  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className={`text-[10px] font-black tracking-[0.2em] bg-white px-10 py-2.5 rounded-full border shadow-sm uppercase flex items-center gap-3 ${cramMode ? 'text-orange-500 border-orange-100' : 'text-gray-400 border-gray-100'}`}>
          {cramMode ? <Flame size={14} className="text-orange-500 animate-pulse" /> : <Sparkles size={14} className="text-indigo-600 animate-pulse" />}
          {studyMode === 'read' ? (
            <span>CARD {currentActivePosition} / {activeCount}</span>
          ) : (
            <span>{cramMode ? 'REMAINING' : 'PENDING'}: {activeCount}</span>
          )}
        </div>
      </div>
      <Flashcard
        data={card}
        isFlipped={isFlipped}
        onFlip={onFlip}
        mode={studyMode}
        direction={flipDirection}
        onAnswer={onAnswer}
        onComplete={onComplete}
      />
      {studyMode === 'read' && (
        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="flex items-center gap-20">
            <button
              onClick={onPrev}
              className="p-8 bg-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-x-1.5 transition-all text-gray-200 hover:text-indigo-600 border border-gray-100 group"
            >
              <ArrowLeft size={44} className="group-active:scale-90 transition-transform" />
            </button>
            <button
              onClick={onNext}
              className="p-8 bg-white rounded-full shadow-xl hover:shadow-2xl hover:translate-x-1.5 transition-all text-gray-200 hover:text-indigo-600 border border-gray-100 group"
            >
              <ArrowRight size={44} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardStudyView;
