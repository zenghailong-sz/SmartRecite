// 词性（POS）色彩 → 用于"全局清单"表格的徽章配色。
// 注意：跟 Flashcard.tsx 中的 getPOSStyle 是两套不同的配色（卡片用饱和色 -100/-700，清单用浅色 -50/-600），不要合并。

export const getPOSColor = (pos: string) => {
  if (!pos) return 'bg-gray-50 text-gray-400 border-gray-100';
  const p = pos.toLowerCase();
  if (p.includes('adj')) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (p.includes('adv')) return 'bg-rose-50 text-rose-600 border-rose-100';
  if (p.includes('v.')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (p.includes('n.')) return 'bg-sky-50 text-sky-600 border-sky-100';
  return 'bg-slate-50 text-slate-500 border-slate-100';
};
