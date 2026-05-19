import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface GraduationViewProps {
  unitName: string | undefined;
  onNextUnit: () => void;
}

const GraduationView: React.FC<GraduationViewProps> = ({ unitName, onNextUnit }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[2rem] sm:rounded-[3.5rem] md:rounded-[5rem] p-8 sm:p-14 md:p-24 text-center shadow-2xl border border-indigo-100 relative overflow-hidden">
        <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-9 md:mb-12 shadow-2xl shadow-yellow-200 border-4 sm:border-8 border-white">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24" strokeWidth={2.5}/>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-5 md:mb-6 tracking-tight">恭喜"毕业"!</h1>
        <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 md:mb-16">
            你已经成功掌握了 <span className="text-indigo-600">"{unitName}"</span> 的全部内容。<br/>
            本单元所有词汇已进入 <span className="text-green-500">Lv.5 永久记忆库</span>。
        </p>
        <div className="flex gap-4 sm:gap-6 justify-center">
            <button onClick={onNextUnit} className="px-6 sm:px-9 md:px-12 py-4 sm:py-5 md:py-7 rounded-2xl sm:rounded-3xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all text-base sm:text-lg md:text-xl flex items-center gap-3 sm:gap-4 active:scale-95">挑战下一个单元 <Sparkles /></button>
        </div>
    </motion.div>
  );
};

export default GraduationView;
