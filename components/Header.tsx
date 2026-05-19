import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, HelpCircle, Flame, RotateCw, BarChart3, LogIn, LogOut, User as UserIcon, KeyRound } from 'lucide-react';
import { LearningStats } from '../types';
import { useFirebase } from '../FirebaseContext';

interface HeaderProps {
  unitName: string | undefined;
  stats: LearningStats;
  streak: number;
  onOpenUnitMenu: () => void;
  onOpenGuide: () => void;
  onOpenDashboard: () => void;
  onReset: () => void;
  onChangePin: () => void;
  isLocked: boolean; // Kept if needed for other visual cues, though unlock button is gone
  onToggleLock: () => void; // Kept in prop definition to avoid breaking parent, but unused in UI
}

const Header: React.FC<HeaderProps> = ({
  unitName,
  stats,
  streak,
  onOpenUnitMenu,
  onOpenGuide,
  onOpenDashboard,
  onReset,
  onChangePin
}) => {
  const { user, signIn, logout, loading } = useFirebase();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部 / Esc 关闭头像菜单
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 px-10 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
            <button onClick={onOpenUnitMenu} className="flex items-center gap-4 bg-gray-50/50 hover:bg-white px-6 py-3 rounded-2xl border border-gray-200 transition-all group hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform"><BookOpen size={24} /></div>
                <div className="text-left">
                    <h1 className="text-xl font-black text-gray-900 leading-tight">{unitName || "请选择单元"}</h1>
                    <p className="text-[10px] text-indigo-500 font-black tracking-widest uppercase mt-0.5">{stats.total} ITEMS LOADED</p>
                </div>
                <ChevronDown size={18} className="text-gray-300 ml-4 group-hover:text-indigo-400 transition-colors" />
            </button>
            
            <div className="flex gap-2">
                <button onClick={onOpenDashboard} className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all" title="学习仪表盘">
                    <BarChart3 size={24} />
                </button>
                <button onClick={onOpenGuide} className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all" title="智能学习指南">
                    <HelpCircle size={24} />
                </button>
            </div>
        </div>

        <div className="flex items-center gap-12">
            <AnimatePresence>
                {streak >= 3 && (
                    <motion.div initial={{ scale: 0, x: 20, opacity: 0 }} animate={{ scale: 1, x: 0, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="flex items-center gap-2 px-6 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 font-black shadow-sm">
                        <Flame size={20} className="animate-bounce" />
                        <span className="text-lg">{streak} COMBO!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-12">
                {[ 
                    {l: '学习中', v: stats.learning, c: 'text-indigo-500'}, 
                    {l: '已掌握', v: stats.mastered, c: 'text-green-500'}, 
                    {l: '总词汇', v: stats.total, c: 'text-gray-400'} 
                ].map(s => (
                    <div key={s.l} className="text-center group">
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 group-hover:text-gray-400 transition-colors">{s.l}</div>
                        <div className={`text-3xl font-black tabular-nums ${s.c}`}>{s.v}</div>
                    </div>
                ))}
            </div>
            <div className="h-12 w-px bg-gray-100"></div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={onReset} 
                className="p-3.5 rounded-2xl transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95"
                title="重置本单元进度 (需要授权)"
              >
                  <RotateCw size={24} />
              </button>

              <div className="h-8 w-px bg-gray-100"></div>

              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
              ) : user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-3 group focus:outline-none"
                    title="账号菜单"
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-gray-900 truncate max-w-[100px]">{user.displayName || '用户'}</span>
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-indigo-500 uppercase tracking-widest transition-colors">账号菜单</span>
                    </div>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm group-hover:border-indigo-300 transition-colors" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors">
                        <UserIcon size={20} />
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">已登录</div>
                          <div className="text-sm font-black text-gray-900 truncate">{user.email || user.displayName || '当前账号'}</div>
                        </div>
                        <button
                          onClick={() => { setMenuOpen(false); onChangePin(); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <KeyRound size={18} />
                          修改 PIN
                        </button>
                        <button
                          onClick={() => { setMenuOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut size={18} />
                          退出登录
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={signIn}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <LogIn size={16} />
                  登录同步
                </button>
              )}
            </div>
        </div>
      </nav>
  );
};

export default Header;