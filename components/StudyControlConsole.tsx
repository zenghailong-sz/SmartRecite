import React from 'react';
import {
  Activity,
  Eye,
  Flame,
  Keyboard,
  Layers,
  LayoutGrid,
  List,
  Lock,
  PenTool,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { SegmentedControl } from './SegmentedControl';

type FilterType = 'all' | 'word' | 'phrase' | 'sentence';
type ViewMode = 'card' | 'list';
type FlipDirection = 'en-zh' | 'zh-en';
type StudyMode = 'read' | 'spell';

interface StudyControlConsoleProps {
  cramMode: boolean;
  viewMode: ViewMode;
  cardFilter: FilterType;
  studyMode: StudyMode;
  flipDirection: FlipDirection;
  autoPlay: boolean;
  isLocked: boolean;
  onCramToggle: () => void;
  onViewModeChange: (v: ViewMode) => void;
  onFilterChange: (v: FilterType) => void;
  onStudyModeChange: (v: StudyMode) => void;
  onFlipDirectionChange: (v: FlipDirection) => void;
  onToggleAutoPlay: () => void;
}

const StudyControlConsole: React.FC<StudyControlConsoleProps> = ({
  cramMode,
  viewMode,
  cardFilter,
  studyMode,
  flipDirection,
  autoPlay,
  isLocked,
  onCramToggle,
  onViewModeChange,
  onFilterChange,
  onStudyModeChange,
  onFlipDirectionChange,
  onToggleAutoPlay,
}) => {
  return (
    <div className={`transition-all duration-500 ${viewMode === 'card' ? 'opacity-100' : 'opacity-100 mb-8'}`}>
      <div className={`p-10 rounded-[3rem] shadow-sm border transition-all duration-300 relative overflow-hidden ${cramMode ? 'bg-orange-50 border-orange-200 shadow-orange-100' : 'bg-white border-gray-100'}`}>
        {cramMode && (
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Flame size={200} className="text-orange-500" />
          </div>
        )}

        <div className={`flex items-center justify-between ${viewMode === 'card' ? 'mb-10 border-b pb-8' : ''} ${cramMode ? 'border-orange-200' : 'border-gray-50'}`}>
          <h2 className={`text-xl font-black flex items-center gap-4 ${cramMode ? 'text-orange-700' : 'text-gray-900'}`}>
            <div className={`w-2.5 h-10 rounded-full shadow-lg ${cramMode ? 'bg-orange-500 shadow-orange-200' : 'bg-indigo-600 shadow-indigo-100'}`}></div>
            {cramMode ? '突击冲刺模式' : '学习控制台'}
          </h2>
          <div className="flex items-center gap-4">
            {viewMode === 'card' && (
              <button
                onClick={onCramToggle}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
                  cramMode
                    ? 'bg-orange-500 border-orange-500 text-white shadow-orange-200 hover:bg-orange-600 scale-105'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {cramMode ? <Zap size={16} fill="currentColor" /> : (isLocked ? <Lock size={16} /> : <Flame size={16} />)}
                {cramMode ? '考前突击 ON' : '考前突击 OFF'}
              </button>
            )}

            <div className="w-64">
              <SegmentedControl<ViewMode>
                value={viewMode}
                onChange={onViewModeChange}
                options={[
                  { value: 'card', label: '沉浸卡片', icon: <LayoutGrid size={16} /> },
                  { value: 'list', label: '全局清单', icon: <List size={16} /> },
                ]}
              />
            </div>
          </div>
        </div>

        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1 ${cramMode ? 'text-orange-400' : 'text-gray-400'}`}>
                <Layers size={12} /> 内容筛选
              </label>
              <SegmentedControl<FilterType>
                value={cardFilter}
                onChange={onFilterChange}
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'word', label: '单词' },
                  { value: 'phrase', label: '短语' },
                  { value: 'sentence', label: '句型' },
                ]}
              />
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1 ${cramMode ? 'text-orange-400' : 'text-gray-400'}`}>
                <Activity size={12} /> 学习模式
              </label>
              <SegmentedControl<StudyMode>
                value={studyMode}
                onChange={onStudyModeChange}
                options={[
                  {
                    value: 'read',
                    label: (
                      <div className="flex flex-col items-center leading-none gap-0.5 mt-0.5">
                        <span className="text-[11px]">单词速览</span>
                        <span className="text-[8px] opacity-60 scale-90 font-medium">无限练习</span>
                      </div>
                    ),
                    icon: <Eye size={16} className="mb-0.5" />,
                  },
                  {
                    value: 'spell',
                    label: (
                      <div className="flex flex-col items-center leading-none gap-0.5 mt-0.5">
                        <span className="text-[11px]">拼写考核</span>
                        <span className="text-[8px] opacity-60 scale-90 font-medium">计入进度</span>
                      </div>
                    ),
                    icon: <PenTool size={16} className="mb-0.5" />,
                  },
                ]}
              />
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1 ${cramMode ? 'text-orange-400' : 'text-gray-400'}`}>
                <Keyboard size={12} /> 显示方向
              </label>
              {studyMode === 'read' ? (
                <SegmentedControl<FlipDirection>
                  value={flipDirection}
                  onChange={onFlipDirectionChange}
                  options={[
                    { value: 'en-zh', label: '英 → 中' },
                    { value: 'zh-en', label: '中 → 英' },
                  ]}
                />
              ) : (
                <div className={`h-10 flex items-center justify-center rounded-2xl text-[11px] font-black italic border border-dashed ${cramMode ? 'bg-orange-100/50 border-orange-200 text-orange-400' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                  拼写锁定中文显示
                </div>
              )}
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1 ${cramMode ? 'text-orange-400' : 'text-gray-400'}`}>
                <Volume2 size={12} /> 语音设置
              </label>
              <button
                onClick={onToggleAutoPlay}
                className={`w-full h-10 flex items-center justify-center gap-3 rounded-2xl border-2 transition-all font-black text-xs ${
                  autoPlay
                    ? cramMode
                      ? 'bg-orange-200/50 border-orange-300 text-orange-700'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner'
                    : cramMode
                      ? 'bg-white/50 border-orange-100 text-orange-300'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}
              >
                {autoPlay ? <Volume2 size={18} /> : <VolumeX size={18} />} {autoPlay ? '发音开启' : '发音静音'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyControlConsole;
