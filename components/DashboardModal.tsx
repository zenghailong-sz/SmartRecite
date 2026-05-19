import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Trophy, Target, ChevronRight, Zap, CheckCircle2, TrendingUp, Layers, Clock, FastForward, Lock } from 'lucide-react';
import { Unit, FlashcardData } from '../types';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  onSelectUnit: (unitId: string) => void;
  onTimeTravel: (hours: number) => void;
  isLocked: boolean;
}

interface UnitStats {
  id: string;
  name: string;
  total: number;
  mastered: number;
  learning: number; // Active (Level 0-4)
  lastActivity: number;
}

const UNIT_PREFIX = 'flashcards_unit_';

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, units, onSelectUnit, onTimeTravel, isLocked }) => {
  const [stats, setStats] = useState<UnitStats[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalWords: 0,
    totalMastered: 0,
    totalLearning: 0,
    masteryRate: 0
  });

  useEffect(() => {
    if (isOpen) {
      const calculatedStats = units.map(unit => {
        const total = unit.count || 0;
        const mastered = unit.masteredCount || 0;
        const learning = unit.learningCount || 0;
        
        return {
          id: unit.id,
          name: unit.name,
          total,
          mastered,
          learning,
          lastActivity: 0 // We don't have this easily without querying all cards, but it's okay for now
        };
      });

      setStats(calculatedStats);

      // Global aggregation
      const gTotal = calculatedStats.reduce((acc, s) => acc + s.total, 0);
      const gMastered = calculatedStats.reduce((acc, s) => acc + s.mastered, 0);
      const gLearning = calculatedStats.reduce((acc, s) => acc + s.learning, 0);
      
      setGlobalStats({
        totalWords: gTotal,
        totalMastered: gMastered,
        totalLearning: gLearning,
        masteryRate: gTotal > 0 ? Math.round((gMastered / gTotal) * 100) : 0
      });
    }
  }, [isOpen, units]);

  const StatCard = ({ label, value, icon, color, subText }: any) => (
    <div className={`p-6 rounded-3xl border border-white/50 shadow-lg ${color} relative overflow-hidden group`}>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2 opacity-80">
                {icon}
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-4xl font-black tracking-tight">{value}</div>
            {subText && <div className="text-xs font-bold mt-2 opacity-60">{subText}</div>}
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 scale-150 group-hover:scale-125 transition-transform duration-500">
            {icon}
        </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[200] bg-gray-100/90 backdrop-blur-xl flex flex-col"
        >
           {/* Header Area */}
           <div className="px-10 py-8 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm z-20">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-100">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">学习全景仪表盘</h2>
                  <p className="text-xs text-indigo-500 font-bold tracking-widest uppercase mt-1">Global Progress Dashboard</p>
                </div>
              </div>
              <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-white rounded-2xl text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-200 transition-all shadow-sm">
                <X size={24}/>
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-10">
              <div className="max-w-6xl mx-auto space-y-12">
                  
                  {/* Top Stats Grid (3 Columns now) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard 
                        label="正在学习中" 
                        value={globalStats.totalLearning} 
                        subText="ACTIVE MEMORY LOOPS"
                        icon={<Zap size={40} />} 
                        color="bg-blue-50 text-blue-600 shadow-blue-100/50" 
                      />
                      <StatCard 
                        label="已彻底掌握" 
                        value={globalStats.totalMastered} 
                        subText={`${globalStats.masteryRate}% COMPLETION RATE`}
                        icon={<Trophy size={40} />} 
                        color="bg-green-50 text-green-600 shadow-green-100/50" 
                      />
                      <StatCard 
                        label="总词汇量" 
                        value={globalStats.totalWords} 
                        subText="TOTAL DATABASE"
                        icon={<Target size={40} />} 
                        color="bg-indigo-50 text-indigo-600 shadow-indigo-100/50" 
                      />
                  </div>

                  {/* Units List */}
                  <div>
                    <h3 className="text-xl font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                        <TrendingUp size={14}/> Unit Breakdown
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {stats.map(unit => {
                            const progressPercent = unit.total > 0 ? Math.round((unit.mastered / unit.total) * 100) : 0;
                            const isCompleted = progressPercent === 100;
                            const isStarted = unit.learning > 0 || unit.mastered > 0;

                            return (
                                <button 
                                    key={unit.id}
                                    onClick={() => { onSelectUnit(unit.id); onClose(); }}
                                    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all flex items-center gap-8 group text-left relative overflow-hidden"
                                >
                                    {/* Completion Gradient Background */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                                    </div>

                                    {/* Unit Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{unit.name}</h4>
                                            {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                            <span>{unit.total} WORDS</span>
                                            {unit.lastActivity > 0 && (
                                                <span className="flex items-center gap-1 text-gray-300">
                                                    • LAST ACTIVE: {new Date(unit.lastActivity).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Stats */}
                                    <div className="flex items-center gap-8 mr-8">
                                         <div className="text-center">
                                            <div className="text-[10px] font-black text-gray-300 uppercase mb-1">MASTERED</div>
                                            <div className="text-xl font-black text-green-500">{unit.mastered}</div>
                                         </div>
                                         <div className="text-center">
                                            <div className="text-[10px] font-black text-gray-300 uppercase mb-1">LEARNING</div>
                                            <div className="text-xl font-black text-indigo-500">{unit.learning}</div>
                                         </div>
                                    </div>

                                    {/* Simple Status Badge */}
                                    <div className="flex items-center gap-6">
                                        {isCompleted ? (
                                            <div className="px-5 py-2 bg-green-50 text-green-600 rounded-xl font-black text-[10px] tracking-widest uppercase border border-green-100">
                                                Done
                                            </div>
                                        ) : isStarted ? (
                                            <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-sm border border-indigo-100 flex items-center gap-2">
                                                <Layers size={14} className="opacity-50"/>
                                                {unit.learning} LEFT
                                            </div>
                                        ) : (
                                            <div className="px-5 py-2 bg-gray-50 text-gray-300 rounded-xl font-black text-[10px] tracking-widest uppercase">
                                                Not Started
                                            </div>
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                  </div>

                  {/* DEVELOPER TOOLS SECTION */}
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                        {isLocked ? <Lock size={14} className="text-gray-300"/> : <Clock size={14}/>} Time Machine (Developer Tools)
                    </h3>
                    <div className={`bg-gray-50 p-6 rounded-[2rem] border border-gray-100 transition-all ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                       <p className="text-xs text-gray-500 font-medium mb-4">
                         Simulate time passing to test Spaced Repetition logic. <br/>
                         This moves the "Next Review" deadlines of all cards into the past.
                       </p>
                       <div className="flex gap-4 flex-wrap">
                          {[
                            { label: '+6 Hours', val: 6 },
                            { label: '+1 Day', val: 24 },
                            { label: '+2 Days', val: 48 },
                            { label: '+5 Days', val: 120 }
                          ].map(opt => (
                            <button
                                key={opt.label}
                                onClick={() => { 
                                    if (isLocked) {
                                        // This will trigger the auth modal via the protected handler
                                        onTimeTravel(opt.val); 
                                    } else {
                                        onTimeTravel(opt.val); 
                                        onClose(); // Only close if not locked (otherwise auth modal opens)
                                    }
                                }}
                                className={`px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-black flex items-center gap-2 transition-all active:scale-95 ${isLocked ? 'text-gray-400 cursor-pointer' : 'text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100'}`}
                            >
                                {isLocked ? <Lock size={14} /> : <FastForward size={14} />} {opt.label}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

              </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardModal;