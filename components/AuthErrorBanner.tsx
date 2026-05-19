import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useFirebase } from '../FirebaseContext';

const AuthErrorBanner: React.FC = () => {
  const { authError, clearAuthError } = useFirebase();

  return (
    <AnimatePresence>
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border-b border-red-200 px-10 py-3 sticky top-[81px] z-40"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-900">{authError.message}</p>
              <p
                className="text-[10px] font-mono text-red-400 mt-0.5 truncate"
                title={authError.rawMessage}
              >
                {authError.code}
              </p>
            </div>
            <button
              onClick={clearAuthError}
              className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-100 transition-colors"
              aria-label="关闭错误提示"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthErrorBanner;
