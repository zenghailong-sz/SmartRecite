// 词族（Word Family）相关性判断：用于"全局清单"视图把同根词分组显示。
// 启发式规则：去后缀后前缀相同 / 互相包含 / 长公共前缀 / 不规则词手动归类。

const getCommonPrefixLength = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a.toLowerCase()[i] === b.toLowerCase()[i]) i++;
  return i;
};

const stripSuffixes = (word: string) => {
  const suffixes = ['ly', 'ion', 'ness', 'ment', 'er', 'or', 'ic', 'ical', 'ist', 'ity', 'ing', 'ed', 'ance', 'ence', 'al'];
  let stripped = word.toLowerCase();
  for (const s of suffixes) if (stripped.endsWith(s) && stripped.length >= s.length + 3) return stripped.substring(0, stripped.length - s.length);
  return stripped;
};

// 不规则词组：词形变化跨越主干无法用后缀剥离命中（如 die/dead/dying/death）
const IRREGULAR_GROUPS: string[][] = [
  ['die', 'dead', 'dying', 'death'],
  ['history', 'historic', 'historian', 'prehistory'],
];

export const isRelated = (a: string, b: string) => {
  const la = a.toLowerCase(), lb = b.toLowerCase();
  if (la === lb || la.includes(lb) || lb.includes(la)) return true;
  for (const group of IRREGULAR_GROUPS) if (group.some(w => la.includes(w)) && group.some(w => lb.includes(w))) return true;
  const sa = stripSuffixes(la), sb = stripSuffixes(lb);
  if (sa.length >= 3 && sb.length >= 3 && (sa.startsWith(sb) || sb.startsWith(sa))) return true;
  return getCommonPrefixLength(la, lb) >= 4;
};
