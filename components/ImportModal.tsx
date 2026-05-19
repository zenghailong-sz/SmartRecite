import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileJson, AlertCircle } from 'lucide-react';
import { FlashcardData, CardType } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (name: string, data: FlashcardData[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [importName, setImportName] = useState('');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = () => {
    setImportError(null);
    if (!importName.trim()) {
        setImportError("请输入单元名称");
        return;
    }
    try {
        const rawData = JSON.parse(importJson);
        if (!Array.isArray(rawData)) throw new Error("数据格式必须为数组");
        
        const newId = `custom_${Date.now()}`;
        
        // Data Normalization / Sanitization happens here before passing up
        const normalizedData: FlashcardData[] = rawData.map((item: any, idx: number) => ({
            id: item.id || `imported_${newId}_${idx}`,
            front: item.front || "Unknown",
            back: item.back || "未知",
            pos: item.pos || "",
            type: item.type === 'PHRASE' ? CardType.PHRASE : (item.type === 'SENTENCE' ? CardType.SENTENCE : CardType.WORD),
            level: 0,
            nextReview: 0, 
            lastReviewed: 0
        }));

        onImportSuccess(importName, normalizedData);
        
        // Reset local state
        setImportJson('');
        setImportName('');
        onClose();
    } catch (e: any) {
        setImportError(`JSON 格式错误: ${e.message}`);
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] p-6 sm:p-8 md:p-12 max-w-xl w-full shadow-2xl border border-white" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                 <div className="p-3 sm:p-4 bg-indigo-600 text-white rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-100"><FileJson className="w-6 h-6 sm:w-8 sm:h-8"/></div>
                 <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">导入新单元</h3>
                    <p className="text-[10px] sm:text-xs text-indigo-500 font-bold tracking-widest uppercase mt-1">Import External Unit</p>
                 </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">单元标题 (e.g. Grade 8B Unit 1)</label>
                    <input
                       type="text"
                       value={importName}
                       onChange={(e) => setImportName(e.target.value)}
                       placeholder="输入单元名称..."
                       className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm sm:text-base"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">JSON 内容</label>
                    <textarea
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        placeholder='[{"front": "word", "back": "意思", "pos": "n.", "type": "WORD"}]'
                        className="w-full h-40 sm:h-48 bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 font-mono text-xs border-2 border-gray-100 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    />
                 </div>

                 <div className="p-3 sm:p-4 bg-indigo-50 rounded-2xl text-[11px] sm:text-xs text-indigo-700 space-y-2">
                    <p className="font-bold">JSON 格式说明：</p>
                    <p>必须是一个包含多个对象的数组，每个对象代表一张卡片。</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><code className="bg-white px-1 rounded text-indigo-900">front</code>: 正面内容（如英文）</li>
                        <li><code className="bg-white px-1 rounded text-indigo-900">back</code>: 背面内容（如中文）</li>
                        <li><code className="bg-white px-1 rounded text-indigo-900">pos</code>: 词性（可选，如 "n.", "v."）</li>
                        <li><code className="bg-white px-1 rounded text-indigo-900">type</code>: 卡片类型。可选值：<code className="bg-white px-1 rounded font-bold">"WORD"</code> (单词), <code className="bg-white px-1 rounded font-bold">"PHRASE"</code> (词组), <code className="bg-white px-1 rounded font-bold">"SENTENCE"</code> (句型)</li>
                    </ul>
                 </div>
              </div>

              {importError && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-5 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-3">
                      <AlertCircle size={16}/> {importError}
                  </motion.div>
              )}

              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
                <button onClick={onClose} className="flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-gray-50 text-gray-400 font-black hover:bg-gray-100 transition-all text-sm sm:text-base">取消</button>
                <button onClick={handleImport} className="flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 text-sm sm:text-base">确认导入</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default ImportModal;