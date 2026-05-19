import React from 'react';
import { AlertCircle, Flame, Lock, Play } from 'lucide-react';

export const LoginPrompt: React.FC = () => (
  <div className="text-center py-16 sm:py-32 md:py-48 bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full border border-dashed border-gray-200 shadow-inner px-4">
    <div className="bg-indigo-50 text-indigo-600 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-indigo-100">
      <Lock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
    </div>
    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">请登录以同步您的数据</h3>
    <p className="text-gray-400 font-medium max-sm:px-4 max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
      登录后，您的学习进度将自动保存到云端，支持多设备同步。
    </p>
    <p className="text-xs sm:text-sm text-indigo-500 font-black">请点击右上角的"登录同步"按钮</p>
  </div>
);

interface NoActiveCardsProps {
  cramMode: boolean;
  onEnableCram: () => void;
  onResetFilter: () => void;
}

export const NoActiveCards: React.FC<NoActiveCardsProps> = ({ cramMode, onEnableCram, onResetFilter }) => (
  <div className="text-center py-16 sm:py-32 md:py-48 bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full border border-dashed border-gray-200 shadow-inner px-4">
    <div className="bg-gray-50 text-gray-400 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-gray-100">
      <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
    </div>
    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">暂无符合条件的卡片</h3>
    <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base px-4">
      {cramMode ? '太棒了！所有未毕业的卡片都已复习完毕。' : '当前没有到期的复习任务。要强行复习吗？'}
    </p>
    {!cramMode ? (
      <button
        onClick={onEnableCram}
        className="px-5 sm:px-8 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-100 flex items-center gap-2 mx-auto text-sm sm:text-base"
      >
        <Flame size={18} /> 开启考前突击
      </button>
    ) : (
      <button
        onClick={onResetFilter}
        className="px-5 sm:px-8 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 text-sm sm:text-base"
      >
        重置筛选器
      </button>
    )}
  </div>
);

export const NoUnitSelected: React.FC = () => (
  <div className="text-center py-16 sm:py-32 md:py-48 bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full border border-dashed border-gray-200 shadow-inner px-4">
    <div className="bg-indigo-50 text-indigo-600 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-indigo-100 rotate-3 transition-transform">
      <Play className="ml-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
    </div>
    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">准备好开启背诵模式了？</h3>
    <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed text-sm sm:text-base px-4">请在左上角选择一个单元。</p>
  </div>
);
