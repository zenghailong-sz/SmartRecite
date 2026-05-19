import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../FirebaseContext';

// 三种模式：verify=校验、setup=首次设置（无旧 PIN，输两次新 PIN）、change=改 PIN（旧→新→确认新）
export type PinModalMode = 'verify' | 'setup' | 'change';

interface UsePinAuthReturn {
  isLocked: boolean;
  hasPin: boolean;
  pinLoading: boolean;
  // 模态控制
  authModalOpen: boolean;
  modalMode: PinModalMode;
  closeAuthModal: () => void;
  // verify 模式
  verifyPin: (inputPin: string) => boolean;
  onAuthSuccess: () => void;
  // 入口
  requireAuth: (callback: () => void) => void;
  openChangePin: () => void;
  // setup / change 模式落盘
  savePin: (newPin: string) => Promise<void>;
}

const PIN_PATTERN = /^\d{4}$/;

export const usePinAuth = (): UsePinAuthReturn => {
  const { user, isAuthReady } = useFirebase();

  // 始终视为已锁，仅用于 UI 锁图标提示；真正授权按动作即时进行
  const isLocked = true;

  const [pin, setPin] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PinModalMode>('verify');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // 登录后从 Firestore 拉 PIN；登出后清空
  useEffect(() => {
    if (!isAuthReady) return;
    if (!user) {
      setPin(null);
      setPinLoading(false);
      return;
    }

    let cancelled = false;
    setPinLoading(true);
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef)
      .then(snap => {
        if (cancelled) return;
        const data = snap.data();
        const remotePin = typeof data?.pin === 'string' && PIN_PATTERN.test(data.pin) ? data.pin : null;
        setPin(remotePin);
      })
      .catch(err => {
        // 读取失败不阻塞 UI，但要把错误抛上来便于排查 rules 拒绝
        console.error('Failed to load user PIN:', err);
        if (!cancelled) setPin(null);
      })
      .finally(() => {
        if (!cancelled) setPinLoading(false);
      });

    return () => { cancelled = true; };
  }, [user, isAuthReady]);

  const verifyPin = useCallback((inputPin: string) => {
    return pin !== null && inputPin === pin;
  }, [pin]);

  // 危险操作入口：未设置 PIN 走 setup，已设置走 verify
  const requireAuth = useCallback((callback: () => void) => {
    setPendingAction(() => callback);
    setModalMode(pin === null ? 'setup' : 'verify');
    setAuthModalOpen(true);
  }, [pin]);

  // 用户主动改 PIN
  const openChangePin = useCallback(() => {
    setPendingAction(null);
    // 若尚未设置过 PIN，从 setup 流程走（输两次新 PIN）；否则走 change（旧→新→确认）
    setModalMode(pin === null ? 'setup' : 'change');
    setAuthModalOpen(true);
  }, [pin]);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingAction(null);
  }, []);

  // verify 成功后执行待办回调
  const onAuthSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    setPendingAction(null);
    setAuthModalOpen(false);
  }, [pendingAction]);

  // setup / change 完成后落盘
  const savePin = useCallback(async (newPin: string) => {
    if (!user) throw new Error('未登录，无法保存 PIN');
    if (!PIN_PATTERN.test(newPin)) throw new Error('PIN 必须是 4 位数字');

    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { pin: newPin, lastSync: Date.now() });
      setPin(newPin);
      // setup 模式（强制首设）落盘后立即放行待办动作；change 模式无 pendingAction，纯关闭
      if (pendingAction) {
        pendingAction();
      }
      setPendingAction(null);
      setAuthModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  }, [user, pendingAction]);

  return {
    isLocked,
    hasPin: pin !== null,
    pinLoading,
    authModalOpen,
    modalMode,
    closeAuthModal,
    verifyPin,
    onAuthSuccess,
    requireAuth,
    openChangePin,
    savePin,
  };
};
