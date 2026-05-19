import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, Trash2, Plus, Lock } from 'lucide-react';
import { Unit } from '../types';

interface UnitListModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  activeUnitId: string | null;
  onSelectUnit: (id: string) => void;
  onDeleteUnit: (id: string) => void; // Trigger confirmation
  onOpenImport: () => void;
  isLocked: boolean;
}

export const UnitListModal: React.FC<UnitListModalProps> = ({ 
  isOpen, 
  onClose, 
  units, 
  activeUnitId, 
  onSelectUnit, 
  onDeleteUnit,
  onOpenImport,
  isLocked
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6" 
          onClick={onClose}
        >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="bg-white rounded-[4rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white" 
              onClick={e => e.stopPropagation()}
            >
                <div className="p-10 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">选择学习单元</h3>
                        <p className="text-xs text-indigo-500 font-bold tracking-widest uppercase mt-1">Select Study Unit</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"><X size={24}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 gap-4">
                    {units.map(unit => (
                        <div key={unit.id} className="group/unit-container relative">
                          <button onClick={() => onSelectUnit(unit.id)} className={`w-full flex items-center justify-between p-8 rounded-3xl border-2 transition-all group/unit ${activeUnitId === unit.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30'}`}>
                              <div className="flex items-center gap-6">
                                  <div className={`p-4 rounded-2xl transition-colors ${activeUnitId === unit.id ? 'bg-white/20' : 'bg-gray-50 text-indigo-600 group-hover/unit:bg-white'}`}><BookOpen size={28}/></div>
                                  <div className="text-left">
                                      <div className={`text-xl font-black ${activeUnitId === unit.id ? 'text-white' : 'text-gray-900'}`}>{unit.name}</div>
                                      <div className={`text-[10px] font-black tracking-widest uppercase mt-1 ${activeUnitId === unit.id ? 'text-indigo-100' : 'text-gray-400'}`}>{unit.count} ITEMS AVAILABLE</div>
                                  </div>
                              </div>
                              {/* Sparkles Icon: Shows when active, Hides on hover to make room for Delete button */}
                              {activeUnitId === unit.id && (
                                <div className="transition-opacity duration-200 group-hover/unit-container:opacity-0">
                                  <Sparkles size={24} className="text-white animate-pulse" />
                                </div>
                              )}
                          </button>
                          
                          {/* Delete Button - Always actionable now, just triggers auth if locked */}
                          <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteUnit(unit.id);
                              }}
                              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all z-20 opacity-0 group-hover/unit-container:opacity-100 scale-90 group-hover/unit-container:scale-100 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 active:scale-95"
                              title="删除单元 (需要授权)"
                          >
                              {isLocked ? <Lock size={16} /> : <Trash2 size={20} />}
                          </button>
                        </div>
                    ))}
                    
                    {/* --- Import Entry --- */}
                    <button onClick={onOpenImport} className="flex items-center gap-6 p-8 rounded-3xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-gray-400 hover:text-indigo-600 group/import relative active:scale-95">
                        <div className="p-4 rounded-2xl bg-gray-50 text-gray-300 group-hover/import:bg-white group-hover/import:text-indigo-600 transition-colors"><Plus size={28}/></div>
                        <div className="text-left">
                            <div className="text-xl font-black">导入自定义单元</div>
                            <div className="text-[10px] font-black tracking-widest uppercase mt-1">Import Custom JSON</div>
                        </div>
                        {isLocked && <Lock size={20} className="absolute right-8 text-gray-300" />}
                    </button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DeleteConfirmModalProps {
  unitName: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ unitName, onConfirm, onCancel }) => (
    <AnimatePresence>
      {unitName && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6" onClick={onCancel}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[4rem] p-16 max-w-lg w-full text-center shadow-2xl border border-white" onClick={e => e.stopPropagation()}>
             <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-red-100"><Trash2 size={48} /></div>
             <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">确定删除单元？</h3>
             <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12">"{unitName}" 将被永久删除，所有学习进度无法恢复。</p>
             <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 py-6 rounded-3xl bg-gray-50 text-gray-400 font-black hover:bg-gray-100 transition-all text-lg">取消</button>
                <button onClick={onConfirm} className="flex-1 py-6 rounded-3xl bg-red-500 text-white font-black hover:bg-red-600 shadow-xl shadow-red-100 transition-all text-lg">确定删除</button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
);