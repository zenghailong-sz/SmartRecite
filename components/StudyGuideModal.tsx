import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Zap, Command, Link2 } from 'lucide-react';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudyGuideModal: React.FC<StudyGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6" 
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 20 }} 
            className="bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 sm:p-8 md:p-10 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="bg-indigo-600 p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-white shadow-xl shadow-indigo-100">
                  <Info className="w-6 h-6 sm:w-8 sm:h-8"/>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">智能学习指南</h3>
                  <p className="text-[10px] sm:text-xs text-indigo-500 font-bold tracking-widest uppercase mt-1">SMART STUDY GUIDE</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 sm:p-4 bg-white rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
              >
                <X size={24}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-8 sm:space-y-10 md:space-y-12">
              <section>
                <h4 className="text-lg sm:text-xl font-black text-indigo-600 mb-4 sm:mb-6 flex items-center gap-3"><Zap size={20}/> 艾宾浩斯加速版 (日内双循环)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { l: 'Lv.0', d: '新词 / 刚记错', c: 'bg-red-50 text-red-600' },
                    { l: 'Lv.1', d: '10 分钟后', c: 'bg-orange-50 text-orange-600' },
                    { l: 'Lv.2', d: '6 小时 (日内)', c: 'bg-yellow-50 text-yellow-600' },
                    { l: 'Lv.3', d: '15 小时 (次日)', c: 'bg-blue-50 text-blue-600' },
                    { l: 'Lv.4', d: '2 天后', c: 'bg-purple-50 text-purple-600' },
                    { l: 'Lv.5', d: '5 天 (毕业)', c: 'bg-green-50 text-green-600' }
                  ].map(item => (
                    <div key={item.l} className={`${item.c} p-4 rounded-3xl border border-black/5 flex flex-col items-center text-center gap-1`}>
                      <span className="font-black text-2xl tracking-tighter">{item.l}</span>
                      <span className="text-[10px] font-bold opacity-70 leading-tight">{item.d}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-lg sm:text-xl font-black text-indigo-600 mb-4 sm:mb-6 flex items-center gap-3"><Command size={20}/> 键盘快捷键</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="font-bold text-gray-600">翻转卡片 / 确认拼写</span>
                    <kbd className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 font-black text-indigo-600">Space</kbd>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="font-bold text-gray-600">上一个 / 下一个</span>
                    <div className="flex gap-2">
                      <kbd className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 font-black text-indigo-600">←</kbd>
                      <kbd className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 font-black text-indigo-600">→</kbd>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-lg sm:text-xl font-black text-indigo-600 mb-4 sm:mb-6 flex items-center gap-3"><Link2 size={20}/> 单词家族功能</h4>
                <p className="text-gray-500 font-medium leading-relaxed bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                  系统会自动分析单词的词根与派生关系。在“全局清单”模式下，相关的词汇会被聚合为 <span className="text-indigo-600 font-black">Word Family</span>。
                  这能帮你建立结构化记忆，显著提升词汇量。
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudyGuideModal;