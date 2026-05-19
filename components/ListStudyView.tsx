import React from 'react';
import { Link2, Volume2 } from 'lucide-react';
import { FlashcardData } from '../types';
import { speakText } from '../utils/media';
import { getPOSColor } from '../utils/posColor';

interface ListStudyViewProps {
  cardGroups: FlashcardData[][];
  allCards: FlashcardData[];
}

const ListStudyView: React.FC<ListStudyViewProps> = ({ cardGroups, allCards }) => {
  return (
    <div className="space-y-6 mt-4">
      {cardGroups.map((group, gIdx) => {
        const isFamily = group.length > 1;
        const rootWord = group[0].front;
        return (
          <div
            key={gIdx}
            className={`bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 ${
              isFamily ? 'ring-1 ring-indigo-500/20' : ''
            }`}
          >
            {isFamily && (
              <div
                className="px-10 py-4 bg-indigo-50/30 border-b border-indigo-50 flex items-center justify-between group/header cursor-pointer"
                onClick={() => speakText(rootWord)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
                    <Link2 size={14} />
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                    {rootWord} Family
                  </span>
                </div>
                <Volume2 size={14} className="text-indigo-200 opacity-0 group-hover/header:opacity-100 transition-opacity" />
              </div>
            )}
            <table className="w-full text-left border-collapse table-fixed">
              <tbody className="divide-y divide-gray-50">
                {group.map((card, cIdx) => (
                  <tr
                    key={card.id}
                    onClick={() => speakText(card.front)}
                    className="group cursor-pointer transition-all hover:bg-indigo-50/30"
                  >
                    <td
                      className={`px-10 py-7 font-mono text-gray-300 text-sm border-l-[6px] transition-all group-hover:border-indigo-500 ${
                        isFamily ? 'border-indigo-500/30' : 'border-transparent'
                      }`}
                    >
                      {allCards.findIndex((c) => c.id === card.id) + 1}
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight ${
                            isFamily && cIdx > 0 ? 'pl-4' : ''
                          }`}
                        >
                          {isFamily && cIdx > 0 && <span className="text-indigo-200 mr-2">↳</span>} {card.front}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-7 w-32 text-center">
                      {card.pos && (
                        <span
                          className={`inline-block px-3 py-1 rounded-lg border text-[10px] font-black italic shadow-sm transition-all ${getPOSColor(
                            card.pos,
                          )}`}
                        >
                          {card.pos}
                        </span>
                      )}
                    </td>
                    <td className="px-10 py-7 text-gray-600 text-lg font-bold leading-relaxed tracking-tight">
                      {card.back}
                    </td>
                    <td className="px-10 py-7 pr-14 text-right w-48">
                      <div className="flex gap-1.5 justify-end">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i <= card.level
                                ? card.level === 5
                                  ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                                  : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ListStudyView;
