import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle } from 'lucide-react';
import { playGameSound } from '../utils/media';

interface PinLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verifyPin: (pin: string) => boolean;
}

const PinLockModal: React.FC<PinLockModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  verifyPin 
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  const handleNumClick = (num: string) => {
    playGameSound('click');
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      // Auto submit on 4th digit
      if (newPin.length === 4) {
        setTimeout(() => handleSubmit(newPin), 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = (currentPin: string) => {
    if (verifyPin(currentPin)) {
      playGameSound('correct');
      onSuccess();
    } else {
      playGameSound('wrong');
      setError(true);
      setPin('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0, x: error ? [-10, 10, -10, 10, 0] : 0 }} 
            exit={{ scale: 0.9, y: 20 }} 
            className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-white" 
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-10 pb-6 px-10 text-center">
               <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-colors ${error ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-indigo-50 text-indigo-600 shadow-indigo-100'}`}>
                 {error ? <AlertCircle size={32}/> : <Lock size={32} />}
               </div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                 管理员验证
               </h3>
               <p className="text-gray-400 text-sm font-medium">
                 {error ? '密码错误，请重试' : '请输入密码以继续操作'}
               </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? (error ? 'bg-red-500 scale-110' : 'bg-indigo-600 scale-110') : 'bg-gray-100'}`} />
              ))}
            </div>

            {/* Keypad */}
            <div className="bg-gray-50 p-6 grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={num} 
                  onClick={() => handleNumClick(num.toString())}
                  className="h-16 rounded-2xl bg-white shadow-sm border border-gray-100 text-2xl font-black text-gray-700 active:scale-95 transition-all hover:bg-gray-50 focus:outline-none"
                >
                  {num}
                </button>
              ))}
              <div className="h-16 flex items-center justify-center text-gray-300 pointer-events-none"></div>
              <button 
                  onClick={() => handleNumClick("0")}
                  className="h-16 rounded-2xl bg-white shadow-sm border border-gray-100 text-2xl font-black text-gray-700 active:scale-95 transition-all hover:bg-gray-50 focus:outline-none"
                >
                  0
              </button>
              <button 
                  onClick={handleDelete}
                  className="h-16 rounded-2xl flex items-center justify-center text-gray-400 active:scale-95 transition-all hover:text-red-500 focus:outline-none"
                >
                  <X size={28} />
              </button>
            </div>
            
            <button onClick={onClose} className="w-full py-6 text-center text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm uppercase tracking-widest bg-gray-50 border-t border-gray-100">
              取消操作
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinLockModal;