import { useState, useCallback } from 'react';

const ADMIN_PIN = '1897';

interface UsePinAuthReturn {
  isLocked: boolean;
  verifyPin: (inputPin: string) => boolean;
  requireAuth: (callback: () => void) => void;
  authModalOpen: boolean;
  closeAuthModal: () => void;
  onAuthSuccess: () => void;
}

export const usePinAuth = (): UsePinAuthReturn => {
  // Always conceptually locked so UI shows lock icons.
  // Auth is granted transiently for specific actions via requireAuth.
  const isLocked = true; 
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const verifyPin = useCallback((inputPin: string) => {
    return inputPin === ADMIN_PIN;
  }, []);

  const requireAuth = useCallback((callback: () => void) => {
    setPendingAction(() => callback);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingAction(null);
  }, []);

  const onAuthSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    // Do not unlock globally; strict one-time auth
    setPendingAction(null);
    setAuthModalOpen(false);
  }, [pendingAction]);

  return {
    isLocked,
    verifyPin,
    requireAuth,
    authModalOpen,
    closeAuthModal,
    onAuthSuccess
  };
};