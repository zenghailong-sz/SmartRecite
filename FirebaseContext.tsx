import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface AuthErrorInfo {
  code: string;
  message: string;
  rawMessage?: string;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  authError: AuthErrorInfo | null;
  clearAuthError: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// 把 Firebase 错误码映射成给最终用户看的中文提示。
// 未命中时回退到 code 本身，原始 message 仍可通过 rawMessage 追溯（hover/title）。
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/unauthorized-domain': '当前域名未授权登录。请在 Firebase Console → Authentication → Settings → Authorized domains 中添加本域名。',
  'auth/popup-blocked': '弹窗被浏览器拦截。请在地址栏右侧允许弹窗后重试。',
  'auth/popup-closed-by-user': '登录被关闭。',
  'auth/cancelled-popup-request': '登录请求已取消（可能同时打开了多个登录弹窗）。',
  'auth/operation-not-allowed': 'Google 登录方式未在 Firebase 项目中启用，请联系管理员。',
  'auth/network-request-failed': '网络请求失败，请检查网络连接后重试。',
  'auth/internal-error': 'Firebase 内部错误，请稍后重试。',
  'auth/api-key-not-valid': 'Firebase API key 无效或被 referer 白名单限制，请联系管理员。',
};

function mapAuthError(error: unknown, action: string): AuthErrorInfo {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    return {
      code,
      message: AUTH_ERROR_MESSAGES[code] ?? `${action}失败 (${code})`,
      rawMessage: (error as { message?: string }).message,
    };
  }
  return {
    code: 'unknown',
    message: `${action}失败：未知错误`,
    rawMessage: error instanceof Error ? error.message : String(error),
  };
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              lastSync: Date.now(),
              createdAt: serverTimestamp(),
            });
          }
        } catch (error) {
          // 不阻塞登录流程，但通过 authError 让用户感知到（rules 拒绝等问题）
          console.error('Error ensuring user profile:', error);
          setAuthError(mapAuthError(error, '用户档案初始化'));
        }
      }
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(mapAuthError(error, '登录'));
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError(mapAuthError(error, '退出登录'));
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, signIn, logout, isAuthReady, authError, clearAuthError }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
