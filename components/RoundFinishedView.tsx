import React from 'react';
import { CheckCircle, Clock, Flame, Layers, Repeat } from 'lucide-react';

type FilterType = 'all' | 'word' | 'phrase' | 'sentence';
type StudyMode = 'read' | 'spell';

interface RoundFinishedViewProps {
  totalMatchingCards: number;
  activeCount: number;
  cardFilter: FilterType;
  cramMode: boolean;
  studyMode: StudyMode;
  onResetFilter: () => void;
  onExitCram: () => void;
  onRestart: () => void;
}

const filterLabel = (filter: FilterType) => {
  if (filter === 'word') return '单词';
  if (filter === 'phrase') return '短语';
  if (filter === 'sentence') return '句型';
  return '内容';
};

const RoundFinishedView: React.FC<RoundFinishedViewProps> = ({
  totalMatchingCards,
  activeCount,
  cardFilter,
  cramMode,
  studyMode,
  onResetFilter,
  onExitCram,
  onRestart,
}) => {
  const label = filterLabel(cardFilter);

  return (
    <div className="relative w-full max-w-[600px] min-h-[360px] sm:min-h-[400px] bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-8 sm:p-12 md:p-14 mx-auto text-center">
      {totalMatchingCards === 0 ? (
        <>
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-gray-100">
            <Layers size={48} className="text-gray-300" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">本单元无{label}</h3>
          <p className="text-gray-400 font-medium max-w-sm mb-6 sm:mb-10 leading-relaxed text-sm sm:text-base">
            该单元似乎没有录入任何{label}数据。
          </p>
          <button
            onClick={onResetFilter}
            className="px-10 py-5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-3xl font-black flex items-center gap-3 transition-all border border-indigo-100"
          >
            显示全部
          </button>
        </>
      ) : activeCount === 0 && !cramMode && studyMode === 'spell' ? (
        <>
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-100">
            <Clock size={48} className="text-blue-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">暂无待复习词汇</h3>
          <p className="text-gray-400 font-medium max-w-sm mb-6 sm:mb-10 leading-relaxed text-sm sm:text-base">
            您已完成当前所有复习任务。请等待记忆曲线周期更新。
            <br />
            <br />
            <span className="text-sm font-bold text-gray-300">急需复习? 试试上方的 "考前突击" 模式。</span>
          </p>
          <div className="text-xs font-black text-indigo-300 bg-indigo-50 px-6 py-3 rounded-xl uppercase tracking-widest border border-indigo-100">
            All Caught Up
          </div>
        </>
      ) : cramMode && activeCount === 0 ? (
        <>
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-orange-100">
            <Flame size={48} className="text-orange-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">突击任务完成!</h3>
          <p className="text-gray-400 font-medium max-w-sm mb-6 sm:mb-10 leading-relaxed text-sm sm:text-base">
            太棒了！您已在突击模式下复习了所有未毕业词汇。 您的进度已提前保存。
          </p>
          <button
            onClick={onExitCram}
            className="px-10 py-5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-3xl font-black flex items-center gap-3 transition-all"
          >
            退出突击模式
          </button>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-100">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">
            本轮{studyMode === 'read' ? '浏览' : '复习'}完成!
          </h3>
          <p className="text-gray-400 font-medium max-w-sm mb-6 sm:mb-10 leading-relaxed text-sm sm:text-base">
            休息一下，或者重新开始本轮巩固。
          </p>
          <button
            onClick={onRestart}
            className={`px-10 py-5 text-white rounded-3xl font-black flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 ${
              cramMode
                ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            <Repeat size={20} />
            {cramMode ? '开启下一轮复习' : studyMode === 'spell' ? '重试错题' : '重新开始'}
          </button>
        </>
      )}
    </div>
  );
};

export default RoundFinishedView;
