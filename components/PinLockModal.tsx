import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { playGameSound } from '../utils/media';
import type { PinModalMode } from '../hooks/usePinAuth';

interface PinLockModalProps {
  isOpen: boolean;
  mode: PinModalMode;
  onClose: () => void;
  // verify 流程：校验 + 成功回调
  verifyPin: (pin: string) => boolean;
  onSuccess: () => void;
  // setup / change 流程：落盘新 PIN
  savePin: (newPin: string) => Promise<void>;
}

// 流程内的子步骤：
//   verify  → ['enter']
//   setup   → ['new', 'confirm']
//   change  → ['old', 'new', 'confirm']
type Step = 'enter' | 'old' | 'new' | 'confirm';

const STEP_SEQUENCE: Record<PinModalMode, Step[]> = {
  verify: ['enter'],
  setup: ['new', 'confirm'],
  change: ['old', 'new', 'confirm'],
};

const STEP_COPY: Record<Step, { title: string; hint: string }> = {
  enter: { title: '管理员验证', hint: '请输入 PIN 以继续操作' },
  old: { title: '修改 PIN', hint: '请输入当前 PIN' },
  new: { title: '设置新 PIN', hint: '请输入 4 位数字 PIN' },
  confirm: { title: '确认新 PIN', hint: '再次输入新 PIN' },
};

const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  mode,
  onClose,
  verifyPin,
  onSuccess,
  savePin,
}) => {
  const steps = useMemo(() => STEP_SEQUENCE[mode], [mode]);
  const [stepIndex, setStepIndex] = useState(0);
  const [pin, setPin] = useState('');
  const [newPinBuffer, setNewPinBuffer] = useState(''); // 缓存 new 步骤的输入，用于 confirm 比对
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 打开 / 模式切换时同步重置：必须在 render 阶段执行，不能放 useEffect。
  // 原因：effect 在渲染后才跑，change 流程结束时 stepIndex=2，紧接着切到 verify
  // （steps 只剩 1 项）时，第一次渲染会用 steps[2]=undefined 取 copy，触发 crash。
  const resetKey = `${isOpen ? 'o' : 'c'}-${mode}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setStepIndex(0);
    setPin('');
    setNewPinBuffer('');
    setErrorMsg(null);
    setSaving(false);
  }

  // 双保险：即便未来再出现 stepIndex 越界，也优雅 fallback 到首步，避免白屏
  const currentStep = steps[stepIndex] ?? steps[0];
  const copy = STEP_COPY[currentStep];

  const handleStepError = (msg: string) => {
    playGameSound('wrong');
    setErrorMsg(msg);
    setPin('');
  };

  const handleStepSuccess = () => {
    playGameSound('correct');
    setErrorMsg(null);
  };

  const handleSubmit = async (currentPin: string) => {
    if (currentStep === 'enter') {
      if (verifyPin(currentPin)) {
        handleStepSuccess();
        onSuccess();
      } else {
        handleStepError('PIN 错误，请重试');
      }
      return;
    }

    if (currentStep === 'old') {
      if (verifyPin(currentPin)) {
        handleStepSuccess();
        setPin('');
        setStepIndex(stepIndex + 1);
      } else {
        handleStepError('原 PIN 错误，请重试');
      }
      return;
    }

    if (currentStep === 'new') {
      handleStepSuccess();
      setNewPinBuffer(currentPin);
      setPin('');
      setStepIndex(stepIndex + 1);
      return;
    }

    if (currentStep === 'confirm') {
      if (currentPin !== newPinBuffer) {
        handleStepError('两次输入不一致，请重新设置');
        // 回到 new 步骤
        setStepIndex(steps.indexOf('new'));
        setNewPinBuffer('');
        return;
      }
      try {
        setSaving(true);
        await savePin(currentPin);
        handleStepSuccess();
        // savePin 内部会关闭弹窗
      } catch (err) {
        setSaving(false);
        handleStepError(err instanceof Error ? err.message : '保存失败');
      }
      return;
    }
  };

  const handleNumClick = (num: string) => {
    if (saving) return;
    playGameSound('click');
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg(null);

      if (newPin.length === 4) {
        setTimeout(() => handleSubmit(newPin), 100);
      }
    }
  };

  const handleDelete = () => {
    if (saving) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const headerIcon = errorMsg
    ? <AlertCircle size={32} />
    : currentStep === 'enter' || currentStep === 'old'
      ? <Lock size={32} />
      : currentStep === 'new'
        ? <KeyRound size={32} />
        : <ShieldCheck size={32} />;

  const headerColor = errorMsg
    ? 'bg-red-50 text-red-500 shadow-red-100'
    : currentStep === 'confirm'
      ? 'bg-green-50 text-green-600 shadow-green-100'
      : 'bg-indigo-50 text-indigo-600 shadow-indigo-100';

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
            animate={{ scale: 1, y: 0, x: errorMsg ? [-10, 10, -10, 10, 0] : 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-10 text-center">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg transition-colors ${headerColor}`}>
                {headerIcon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
                {copy.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                {errorMsg ?? copy.hint}
              </p>
              {steps.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === stepIndex ? 'w-6 bg-indigo-600' : i < stepIndex ? 'w-3 bg-indigo-300' : 'w-3 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i < pin.length
                      ? errorMsg
                        ? 'bg-red-500 scale-110'
                        : currentStep === 'confirm'
                          ? 'bg-green-600 scale-110'
                          : 'bg-indigo-600 scale-110'
                      : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="bg-gray-50 p-4 sm:p-5 md:p-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumClick(num.toString())}
                  disabled={saving}
                  className="h-12 sm:h-14 md:h-16 rounded-2xl bg-white shadow-sm border border-gray-100 text-xl sm:text-2xl font-black text-gray-700 active:scale-95 transition-all hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <div className="h-12 sm:h-14 md:h-16 flex items-center justify-center text-gray-300 pointer-events-none"></div>
              <button
                onClick={() => handleNumClick("0")}
                disabled={saving}
                className="h-12 sm:h-14 md:h-16 rounded-2xl bg-white shadow-sm border border-gray-100 text-xl sm:text-2xl font-black text-gray-700 active:scale-95 transition-all hover:bg-gray-50 focus:outline-none disabled:opacity-50"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="h-12 sm:h-14 md:h-16 rounded-2xl flex items-center justify-center text-gray-400 active:scale-95 transition-all hover:text-red-500 focus:outline-none disabled:opacity-50"
              >
                <X size={24} className="sm:w-7 sm:h-7" />
              </button>
            </div>

            <button
              onClick={onClose}
              disabled={saving}
              className="w-full py-4 sm:py-5 md:py-6 text-center text-gray-400 font-bold hover:text-gray-600 transition-colors text-xs sm:text-sm uppercase tracking-widest bg-gray-50 border-t border-gray-100 disabled:opacity-50"
            >
              {saving ? '保存中…' : '取消操作'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinLockModal;
