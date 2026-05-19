import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6" onClick={onClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[4rem] p-16 max-w-lg w-full text-center shadow-2xl border border-white" onClick={e => e.stopPropagation()}>
             <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-red-100"><RotateCw size={48} className="animate-spin-slow" /></div>
             <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">确定重置进度吗？</h3>
             <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12">本单元的所有学习记录和记忆等级将被清空，该操作不可撤销。</p>
             <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 py-6 rounded-3xl bg-gray-50 text-gray-400 font-black hover:bg-gray-100 transition-all text-lg">取消</button>
                <button onClick={onConfirm} className="flex-1 py-6 rounded-3xl bg-red-500 text-white font-black hover:bg-red-600 shadow-xl shadow-red-100 transition-all text-lg">确定重置</button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetConfirmModal;