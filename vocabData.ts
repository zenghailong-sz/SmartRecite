import { CardType, FlashcardData } from './types';

// Helper to create IDs
const generateId = (prefix: string, index: number) => `${prefix}-${index}`;

/* =========================================
   UNIT 1 DATA
   ========================================= */
const unit1Vocab = [
  { front: 'intelligent', pos: 'adj.', back: '聪明的; 智能的' },
  { front: 'intelligence', pos: 'n.', back: '智力, 才智; 智能' },
  { front: 'intelligently', pos: 'adv.', back: '聪明地, 明智地' },
  { front: 'talent', pos: 'n.', back: '天才; 天资; 天赋' },
  { front: 'talented', pos: 'adj.', back: '有天资的, 有才能的' },
  { front: 'art', pos: 'n.', back: '美术, 艺术; 艺术品' },
  { front: 'artist', pos: 'n.', back: '艺术家, 美术家' },
  { front: 'artistic', pos: 'adj.', back: '艺术的, 艺术家的' },
  { front: 'history', pos: 'n.', back: '历史; 历史学; 史书' },
  { front: 'historic', pos: 'adj.', back: '历史上重要的' },
  { front: 'historical', pos: 'adj.', back: '(有关)历史的; 历史学的' },
  { front: 'historian', pos: 'n.', back: '历史学家, 史学工作者' },
  { front: 'prehistory', pos: 'n.', back: '史前; 史前史' },
  { front: 'complete', pos: 'adj.', back: '完全的, 彻底的' },
  { front: 'complete', pos: 'v.', back: '完成' },
  { front: 'completely', pos: 'adv.', back: '完全地, 彻底地' },
  { front: 'suffer', pos: 'v.', back: '受苦, 受折磨' },
  { front: 'suffering', pos: 'n.', back: '(内心或肉体的)痛苦' },
  { front: 'origin', pos: 'n.', back: '起源, 起因' },
  { front: 'original', pos: 'adj.', back: '起初的, 原先的' },
  { front: 'originally', pos: 'adv.', back: '起初, 原来' },
  { front: 'organize', pos: 'v.', back: '组织, 筹备' },
  { front: 'organizer', pos: 'n.', back: '组织者' },
  { front: 'organization', pos: 'n.', back: '组织, 机构' },
  { front: 'die', pos: 'v.', back: '死亡; 消失' },
  { front: 'dead', pos: 'adj.', back: '死的, 去世的' },
  { front: 'dying', pos: 'adj.', back: '临终的, 垂死的' },
  { front: 'death', pos: 'n.', back: '死, 死亡' },
  { front: 'edit', pos: 'v.', back: '编辑, 校订' },
  { front: 'editor', pos: 'n.', back: '编辑; 记者' },
  { front: 'edition', pos: 'n.', back: '版本, 版次' },
  { front: 'whole', pos: 'adj.', back: '全部的, 整个的' },
  { front: 'wholly', pos: 'adv.', back: '完全地, 全部地' },
  { front: 'general', pos: 'adj.', back: '总体的, 普遍的' },
  { front: 'generally', pos: 'adv.', back: '大概; 通常, 普遍地' }
];

const unit1Phrases = [
  { front: 'be talented in', back: '在某方面有天赋' },
  { front: 'be born in', back: '出生于...' },
  { front: 'in the countryside', back: '在乡村' },
  { front: 'from an early age', back: '从很小时候起' },
  { front: 'show great intelligence', back: '展现极高的智慧' },
  { front: 'artistic talent', back: '艺术天赋' },
  { front: 'die out', back: '灭绝' },
  { front: 'a type of', back: '一种' },
  { front: 'be related to', back: '与...相关' },
  { front: 'general education', back: '通识教育' },
  { front: 'go back a long way', back: '历史悠久' },
  { front: 'prefer to do sth.', back: '更喜欢做某事' },
  { front: 'be similar to', back: '与...相似' },
  { front: 'in alphabetical order', back: '按字母顺序' },
  { front: 'play an important role', back: '起重要的作用' },
  { front: 'spend one’s whole life doing sth.', back: '一生都致力于做某事' },
  { front: 'receive honours', back: '获得荣誉' },
  { front: 'in many different fields', back: '在许多不同的领域' },
  { front: 'in different sizes', back: '不同尺寸' },
  { front: 'learn about', back: '了解; 得知; 获悉' },
  { front: 'by studying their fossils', back: '通过研究它们的化石' },
  { front: 'accept this theory', back: '接受这种理论' },
  { front: 'in history', back: '在历史上' },
  { front: 'provide information', back: '提供信息' }
];

/* =========================================
   UNIT 2 DATA
   ========================================= */
const unit2Vocab = [
  { front: 'hesitate', pos: 'v.', back: '犹豫' },
  { front: 'hesitation', pos: 'n.', back: '犹豫, 不情愿' },
  { front: 'agree', pos: 'v.', back: '同意, 赞成' },
  { front: 'agreement', pos: 'n.', back: '协议, 契约; 同意' },
  { front: 'disagree', pos: 'v.', back: '有分歧, 意见不合' },
  { front: 'disagreement', pos: 'n.', back: '分歧, 争论' },
  { front: 'fly', pos: 'v.', back: '飞, 飞行 (flew-flown)' },
  { front: 'flight', pos: 'n.', back: '航班, 班机; 飞行' },
  { front: 'current', pos: 'adj.', back: '现行的, 当前的' },
  { front: 'currently', pos: 'adv.', back: '现时, 当前' },
  { front: 'sharp', pos: 'adj.', back: '锋利的, 尖的' },
  { front: 'sharply', pos: 'adv.', back: '尖锐地; 急剧地' },
  { front: 'exact', pos: 'adj.', back: '确切的, 精确的' },
  { front: 'exactly', pos: 'adv.', back: '精确地, 确切地' },
  { front: 'both', pos: 'pron.', back: '两者' },
  { front: 'either', pos: 'pron.', back: '(两者之中)任意一个' },
  { front: 'neither', pos: 'pron.', back: '(两者中)无一个' },
  { front: 'amazing', pos: 'adj.', back: '惊人的, 了不起的' },
  { front: 'amazed', pos: 'adj.', back: '惊奇的, 惊讶的' },
  { front: 'amaze', pos: 'v.', back: '使惊奇' },
  { front: 'amazement', pos: 'n.', back: '惊奇' },
  { front: 'wise', pos: 'adj.', back: '明智的' },
  { front: 'wisely', pos: 'adv.', back: '明智地; 聪明地' },
  { front: 'wisdom', pos: 'n.', back: '智慧, 才智' },
  { front: 'slow', pos: 'adj.', back: '缓慢的; 慢速的' },
  { front: 'slowly', pos: 'adv.', back: '缓慢地, 慢慢地' },
  { front: 'India', pos: 'n.', back: '印度' },
  { front: 'Indian', pos: 'adj.', back: '印度的; 印第安人的; 印度语的' },
  { front: 'Indians', pos: 'n. pl.', back: '印度人' },
  { front: 'challenge', pos: 'v.', back: '向某人挑战' },
  { front: 'challenger', pos: 'n.', back: '挑战者' },
  { front: 'challenging', pos: 'adj.', back: '挑战性的' },
  { front: 'reply', pos: 'v.', back: '回答; 答复' },
  { front: 'reply', pos: 'n.', back: '回答' }
];

const unit2Phrases = [
  { front: 'flight schedule', back: '航班时刻表' },
  { front: 'price tag', back: '价格标签' },
  { front: 'for a moment', back: '片刻; 一会儿' },
  { front: 'without hesitation', back: '毫不犹豫' },
  { front: 'go up', back: '上升' },
  { front: 'go down', back: '下降' },
  { front: 'write down', back: '写下; 记下' },
  { front: 'instead of', back: '代替; 作为...的替换' },
  { front: 'challenge sb. to sth.', back: '向某人挑战某事' },
  { front: 'promise to do...', back: '承诺做...' },
  { front: 'order sb. to do sth.', back: '命令某人去做...' },
  { front: 'ask sb. for advice', back: '向某人征求建议' },
  { front: 'make money', back: '赚钱' },
  { front: 'make a profit', back: '盈利' },
  { front: 'follow one’s advice', back: '听从某人的建议' },
  { front: 'be known as', back: '被称为...' },
  { front: 'make a budget', back: '做预算' },
  { front: 'design buildings', back: '设计建筑物' },
  { front: 'develop new medicine', back: '研发新药' },
  { front: 'grow crops', back: '种庄稼' },
  { front: 'plan a journey', back: '计划一次旅行' },
  { front: 'stand for', back: '代表' },
  { front: 'all year round', back: '全年' },
  { front: 'with curiosity', back: '怀着好奇心' }
];

/* =========================================
   UNIT 3 DATA
   ========================================= */
const unit3Vocab = [
  { front: 'pay', pos: 'v.', back: '支付, 付; 偿还' },
  { front: 'payment', pos: 'n.', back: '付款, 支付' },
  { front: 'warn', pos: 'v.', back: '提醒; 警告' },
  { front: 'warning', pos: 'n.', back: '警示, 告诫' },
  { front: 'treat', pos: 'v.', back: '对待, 看待; 治疗' },
  { front: 'treatment', pos: 'n.', back: '治疗, 医治; 处理' },
  { front: 'smooth', pos: 'adj.', back: '光滑的, 平坦的' },
  { front: 'smoothly', pos: 'adv.', back: '平稳地; 顺利地' },
  { front: 'novel', pos: 'n.', back: '(长篇)小说' },
  { front: 'novelist', pos: 'n.', back: '小说家' },
  { front: 'social', pos: 'adj.', back: '社会的' },
  { front: 'society', pos: 'n.', back: '社会' },
  { front: 'interview', pos: 'v.', back: '面试, 面谈; 采访' },
  { front: 'interviewee', pos: 'n.', back: '接受采访者' },
  { front: 'interviewer', pos: 'n.', back: '采访者' },
  { front: 'effect', pos: 'n.', back: '作用, 影响' },
  { front: 'affect', pos: 'v.', back: '影响' },
  { front: 'basis', pos: 'n.', back: '基础, 要素' },
  { front: 'base', pos: 'n.', back: '根基, 底部; 基础; 基地' },
  { front: 'basic', pos: 'adj.', back: '基本的, 基础的' },
  { front: 'electricity', pos: 'n.', back: '电, 电流, 电力' },
  { front: 'electric', pos: 'adj.', back: '电的; 用电的; 电动的' },
  { front: 'electronic', pos: 'adj.', back: '电子的, 电子学的' },
  { front: 'weight', pos: 'n.', back: '重量, 体重' },
  { front: 'weigh', pos: 'v.', back: '称, 称...的重量' },
  { front: 'length', pos: 'n.', back: '长度 (adj. long)' },
  { front: 'height', pos: 'n.', back: '高度 (adj. high)' },
  { front: 'width', pos: 'n.', back: '宽度 (adj. wide)' }
];

const unit3Phrases = [
  { front: 'take...for example', back: '以...为例' },
  { front: 'connect to', back: '连接' },
  { front: 'bring big changes to', back: '给...带来重大变化' },
  { front: 'mobile payment', back: '移动支付' },
  { front: 'rubbish bin', back: '垃圾箱' },
  { front: 'social media', back: '社交媒体' },
  { front: 'in person', back: '亲自; 亲身' },
  { front: 'the general public', back: '公众; 大众' },
  { front: 'safe and comfortable', back: '安全与舒适' },
  { front: 'make...convenient', back: '让...便利' },
  { front: 'air conditioning', back: '空气调节系统' },
  { front: 'further change our lives', back: '进一步改变我们的生活' },
  { front: 'share...with...', back: '分享' },
  { front: 'traffic accidents', back: '交通事故' },
  { front: 'according to', back: '根据' },
  { front: 'the number of...', back: '...的数量' },
  { front: 'run out of', back: '用光' },
  { front: 'lead to', back: '导致' },
  { front: 'measure their speed', back: '测量他们的速度' },
  { front: 'send messages', back: '发信息' },
  { front: 'spend a lot of time on ...', back: '花大量时间在...上' },
  { front: 'allow sb. to do sth.', back: '允许某人做某事' },
  { front: 'a set of', back: '一套; 一组' },
  { front: 'thanks to', back: '幸亏; 由于' },
  { front: 'continue to do sth.', back: '继续做某事' }
];

/* =========================================
   UNIT 4 DATA
   ========================================= */
const unit4Vocab = [
  { front: 'center', pos: 'n.', back: '中间, 中心点' },
  { front: 'central', pos: 'adj.', back: '中心的; 主要的' },
  { front: 'nation', pos: 'n.', back: '国家, 民族' },
  { front: 'national', pos: 'adj.', back: '国家的; 国民的; 民族的' },
  { front: 'international', pos: 'adj.', back: '国际的, 国际上的' },
  { front: 'technique', pos: 'n.', back: '技巧, 工艺' },
  { front: 'technical', pos: 'adj.', back: '工艺的, 技术的; 专业的' },
  { front: 'technically', pos: 'adv.', back: '技术上; 专门地' },
  { front: 'depend', pos: 'v.', back: '取决于; 依赖, 依靠' },
  { front: 'dependence', pos: 'n.', back: '依赖, 依靠' },
  { front: 'person', pos: 'n.', back: '人' },
  { front: 'personal', pos: 'adj.', back: '个人的; 人际的; 私人的' },
  { front: 'personally', pos: 'adv.', back: '亲自地' },
  { front: 'personality', pos: 'n.', back: '个性; 品格' },
  { front: 'predict', pos: 'v.', back: '预言, 预计, 预卜' },
  { front: 'prediction', pos: 'n.', back: '预报之事; 预测' },
  { front: 'state', pos: 'v.', back: '陈述, 说明' },
  { front: 'state', pos: 'n.', back: '政府; 州' },
  { front: 'statement', pos: 'n.', back: '声明, 报告; 说明' },
  { front: 'benefit', pos: 'n.', back: '好处, 益处' },
  { front: 'benefit', pos: 'v.', back: '使受益' },
  { front: 'beneficial', pos: 'adj.', back: '有益的, 有利的' },
  { front: 'distant', pos: 'adj.', back: '遥远的, 久远的' },
  { front: 'distance', pos: 'n.', back: '远处; 距离' },
  { front: 'hot', pos: 'adj.', back: '热的, 高温的' },
  { front: 'heat', pos: 'n.', back: '热能, 热量' },
  { front: 'heat', pos: 'v.', back: '加热' },
  { front: 'press', pos: 'v.', back: '压, 挤' },
  { front: 'pressure', pos: 'n.', back: '压力; 心理压力' },
  { front: 'invent', pos: 'v.', back: '发明, 创造; 编造' },
  { front: 'inventor', pos: 'n.', back: '发明者, 发明家' },
  { front: 'invention', pos: 'n.', back: '发明物; 发明, 创造' }
];

const unit4Phrases = [
  { front: 'steam locomotive', back: '蒸汽机车' },
  { front: 'crewed spacecraft', back: '载人航天器' },
  { front: 'on foot', back: '步行' },
  { front: 'a number of', back: '几个; 若干' },
  { front: 'take place', back: '发生; 进行' },
  { front: 'for instance', back: '例如; 比如' },
  { front: 'large amounts of', back: '大量' },
  { front: 'international trade', back: '国际贸易' },
  { front: 'depend on', back: '依靠; 依赖' },
  { front: 'without doubt', back: '毫无疑问' },
  { front: 'of all time', back: '自古以来; 有史以来' },
  { front: 'make fun of', back: '取笑' },
  { front: 'avoid traffic jams', back: '避免交通阻塞' },
  { front: 'in search of', back: '寻找' },
  { front: 'across the globe', back: '遍及全球' },
  { front: 'attach...to...', back: '把...固定在...' },
  { front: 'use solar power', back: '使用太阳能' },
  { front: 'a more exciting experience', back: '一次更兴奋的体验' },
  { front: 'enjoy the view', back: '欣赏风景' },
  { front: 'fall asleep', back: '入睡' },
  { front: 'a dream come true', back: '梦想成真' },
  { front: 'make sure', back: '确保' },
  { front: 'be ready to do...', back: '准备做...' },
  { front: 'wake up', back: '醒来' }
];

/* =========================================
   UNIT 5 DATA
   ========================================= */
const unit5Vocab = [
  { front: 'tour', pos: 'n.', back: '旅行; 旅游' },
  { front: 'tourist', pos: 'n.', back: '旅客' },
  { front: 'tourism', pos: 'n.', back: '旅游业' },
  { front: 'dependent', pos: 'adj.', back: '依赖的' },
  { front: 'independent', pos: 'adj.', back: '自主的; 独立的' },
  { front: 'feel', pos: 'v.', back: '感觉' },
  { front: 'feeling', pos: 'n.', back: '感觉; 态度; 情感' },
  { front: 'shock', pos: 'n.', back: '震惊' },
  { front: 'shocked', pos: 'adj.', back: '震惊的' },
  { front: 'shocking', pos: 'adj.', back: '令人震惊的' },
  { front: 'foreign', pos: 'adj.', back: '外国的' },
  { front: 'foreigner', pos: 'n.', back: '外国人' },
  { front: 'confuse', pos: 'v.', back: '使迷惑' },
  { front: 'confused', pos: 'adj.', back: '糊涂的; 迷惑的' },
  { front: 'confusing', pos: 'adj.', back: '令人困惑的' },
  { front: 'anxious', pos: 'adj.', back: '焦虑的' },
  { front: 'anxiety', pos: 'n.', back: '焦虑; 忧虑' },
  { front: 'familiar', pos: 'adj.', back: '熟悉的' },
  { front: 'unfamiliar', pos: 'adj.', back: '陌生的; 不熟悉的' },
  { front: 'expect', pos: 'v.', back: '期待; 盼望' },
  { front: 'expectation', pos: 'n.', back: '期待; 盼望' },
  { front: 'adapt', pos: 'v.', back: '使...适应' },
  { front: 'adaption', pos: 'n.', back: '适应' },
  { front: 'culture', pos: 'n.', back: '文化' },
  { front: 'cultural', pos: 'adj.', back: '文化的; 文艺的' },
  // Past tenses from exercises
  { front: 'deal (past: dealt)', pos: 'v.', back: '处理 (过去式)' },
  { front: 'fall (past: fell)', pos: 'v.', back: '落下 (过去式)' },
  { front: 'feel (past: felt)', pos: 'v.', back: '感觉 (过去式)' },
  { front: 'throw (past: threw)', pos: 'v.', back: '扔 (过去式)' },
  { front: 'carry (past: carried)', pos: 'v.', back: '携带 (过去式)' },
  { front: 'plan (past: planned)', pos: 'v.', back: '计划 (过去式)' },
  { front: 'study (past: studied)', pos: 'v.', back: '学习 (过去式)' }
];

const unit5Phrases = [
  { front: 'Beijing opera', back: '京剧' },
  { front: 'host family', back: '寄宿家庭' },
  { front: 'snake its way through', back: '蜿蜒穿过' },
  { front: 'culture shock', back: '文化冲击' },
  { front: 'deal with', back: '解决; 处理' },
  { front: 'feel at home', back: '感到舒适自在' },
  { front: 'introduce...to...', back: '把...介绍给...' },
  { front: 'turn...into...', back: '把...变成...' },
  { front: 'enjoy every meal', back: '享受每一餐' },
  { front: 'go on tours', back: '去游览' },
  { front: 'places of interest', back: '景点' },
  { front: 'a bit of / a little', back: '一点' },
  { front: 'be different from', back: '与...不同' },
  { front: 'keep trying', back: '继续尝试' },
  { front: 'keep in touch with sb.', back: '与某人保持联系' },
  { front: 'in black ink', back: '用黑色墨水' },
  { front: 'so far', back: '到目前为止' },
  { front: 'become more independent', back: '变得更加独立' },
  { front: 'improve communication skills', back: '提高沟通技巧' },
  { front: 'learn about different ways of life', back: '了解不同的生活方式' },
  { front: 'practise another language', back: '练习另一种语言' },
  { front: 'truly appreciate your kindness', back: '感谢你的好意' },
  { front: 'look forward to', back: '期待...' },
  { front: 'get homesick and lonely', back: '想家和孤独' }
];

/* =========================================
   UNIT 6 DATA
   ========================================= */
const vocabularyRaw6 = [
  { front: 'author', pos: 'n.', back: '作者; 作家' },
  { front: 'authorship', pos: 'n.', back: '作者身份' },
  { front: 'locate', pos: 'v.', back: '确定位置; 建立; 位于' },
  { front: 'location', pos: 'n.', back: '位置' },
  { front: 'secret', pos: 'adj./n.', back: '秘密的; 秘密; 神秘' },
  { front: 'secretary', pos: 'n.', back: '秘书' },
  { front: 'secretly', pos: 'adv.', back: '秘密地' },
  { front: 'succeed', pos: 'v.', back: '成功; 达成' },
  { front: 'success', pos: 'n.', back: '成功' },
  { front: 'successful', pos: 'adj.', back: '成功的' },
  { front: 'successfully', pos: 'adv.', back: '成功地' },
  { front: 'enter', pos: 'v.', back: '进来; 进入' },
  { front: 'entrance', pos: 'n.', back: '入口' },
  { front: 'fight', pos: 'v.', back: '打仗; 战斗' },
  { front: 'fighter', pos: 'n.', back: '战士; 斗争者; 斗士' },
  { front: 'trick', pos: 'n.', back: '诡计' },
  { front: 'tricky', pos: 'adj.', back: '诡计多端的' },
  { front: 'fail', pos: 'v.', back: '失败; 未能(做到)' },
  { front: 'failed', pos: 'adj.', back: '失败的' },
  { front: 'failure', pos: 'n.', back: '失败' },
  { front: 'full', pos: 'adj.', back: '满的; 饱的' },
  { front: 'fill', pos: 'v.', back: '充满; 装满' },
  { front: 'Greek', pos: 'n./adj.', back: '希腊语; 希腊人; 希腊的' },
  { front: 'Greece', pos: 'n.', back: '希腊' },
  { front: 'fog', pos: 'n.', back: '雾' },
  { front: 'foggy', pos: 'adj.', back: '有雾的' },
  { front: 'hide', pos: 'v.', back: '藏; 隐蔽' },
  { front: 'beat', pos: 'v.', back: '击败; 战胜' }
];

const phrasesRaw6 = [
  { front: 'make jokes about', back: '拿...开玩笑' },
  { front: 'succeed in', back: '在...方面成功' },
  { front: 'be tired of', back: '厌烦' },
  { front: 'go on board', back: '上船' },
  { front: 'be jealous of', back: '嫉妒' },
  { front: 'be full of', back: '装满; 充满' },
  { front: 'look down at', back: '向下看; 俯视; 瞧不起' },
  { front: 'pull...into', back: '把...拉进' },
  { front: 'obey orders', back: '服从命令' },
  { front: 'celebrate their victory', back: '庆祝他们的胜利' },
  { front: 'make sure', back: '确保' },
  { front: 'except for', back: '除…之外' },
  { front: 'make one’s way to...', back: '前往...' },
  { front: 'miss home', back: '想家' },
  { front: 'pretend to sail away', back: '假装启航离开' },
  { front: 'Romance of the Three Kingdoms', back: '《三国演义》' },
  { front: 'borrow sth. from sb.', back: '向某人借某物' },
  { front: 'an impossible task', back: '一项不可能的任务' },
  { front: 'fill...with..', back: '用...装满' },
  { front: 'under attack', back: '受到攻击' },
  { front: 'the thick fog', back: '浓雾' },
  { front: 'shoot arrows', back: '射箭' },
  { front: 'on the other side of the river', back: '在河的对岸' }
];

/* =========================================
   UNIT 7 DATA
   ========================================= */
const unit7Vocab = [
  { front: 'memory', pos: 'n.', back: '记忆; 记忆力' },
  { front: 'memorize', pos: 'v.', back: '记住' },
  { front: 'lose', pos: 'v.', back: '丧失; 失去' },
  { front: 'loss', pos: 'n.', back: '损失' },
  { front: 'lost', pos: 'adj.', back: '失去的' },
  { front: 'get lost', pos: 'adj.', back: '迷路; 迷失' },
  { front: 'regular', pos: 'adj.', back: '有规律的' },
  { front: 'regularly', pos: 'adv.', back: '有规律地' },
  { front: 'repeat', pos: 'v.', back: '重复' },
  { front: 'repeated', pos: 'adj.', back: '重复的, 反复发生的' },
  { front: 'mental', pos: 'adj.', back: '精神上的' },
  { front: 'mentally', pos: 'adv.', back: '精神上' },
  { front: 'stress', pos: 'n.', back: '精神压力; 紧张' },
  { front: 'stressed', pos: 'adj.', back: '焦虑不安的' },
  { front: 'normal', pos: 'adj.', back: '正常的' },
  { front: 'normally', pos: 'adv.', back: '正常地; 通常' },
  { front: 'relaxed', pos: 'adj.', back: '放松的(人的精神状态)' },
  { front: 'relaxing', pos: 'adj.', back: '令人放松的(事物本身)' },
  { front: 'relax', pos: 'v.', back: '休息; 放松' },
  { front: 'summary', pos: 'n.', back: '总结; 概括' },
  { front: 'summarize', pos: 'v.', back: '总结; 概括' },
  { front: 'chemistry', pos: 'n.', back: '化学; 化学性质' },
  { front: 'chemical', pos: 'adj.', back: '化学的; n. 化学制品' },
  { front: 'chemist', pos: 'n.', back: '药剂师; 化学家' },
  { front: 'forget', pos: 'v.', back: '忘记' },
  { front: 'forgetful', pos: 'adj.', back: '健忘的, 记性差的' },
  { front: 'unforgettable', pos: 'adj.', back: '难以忘怀的' },
  { front: 'improve', pos: 'v.', back: '改进; 改善' },
  { front: 'improvement', pos: 'n.', back: '改进; 改善' },
  { front: 'physics', pos: 'n.', back: '物理学; 物理现象' },
  { front: 'physical', pos: 'adj.', back: '身体的; 物理的' }
];

const unit7Phrases = [
  { front: 'flash card', back: '识字卡片' },
  { front: 'make a point of doing sth.', back: '保证做某事' },
  { front: 'last but not least', back: '最后但同样重要的' },
  { front: 'natural disasters', back: '自然灾害' },
  { front: 'figure out', back: '弄懂; 弄清楚' },
  { front: 'take notes', back: '记笔记' },
  { front: 'organize information', back: '整理信息' },
  { front: 'make it visual', back: '使之形象化' },
  { front: 'live a mentally active life', back: '过一种精神活跃的生活' },
  { front: 'play a new instrument', back: '演奏一种新乐器' },
  { front: 'make up a story', back: '编一个故事' },
  { front: 'as well as', back: '和; 以及; 还有' },
  { front: 'maintain a good memory', back: '保持良好的记忆力' },
  { front: 'regular physical exercise', back: '有规律的体育锻炼' },
  { front: 'get too stressed or worried', back: '过度紧张或忧虑' },
  { front: 'tend to decline with age', back: '随着年龄而逐渐减退' },
  { front: 'a set of', back: '一组; 一套' },
  { front: 'learn words in context', back: '在语境中学习单词' },
  { front: 'use mind maps', back: '用思维导图' },
  { front: 'set a central topic', back: '设置一个中心话题' },
  { front: 'tree rings', back: '树木年轮' },
  { front: 'a record of', back: '...的记录' },
  { front: 'even though', back: '虽然; 尽管' }
];

/* =========================================
   UNIT 8 DATA
   ========================================= */
const unit8Vocab = [
  { front: 'complaint', pos: 'n.', back: '投诉; 抱怨' },
  { front: 'complain', pos: 'v.', back: '抱怨' },
  { front: 'reason', pos: 'n.', back: '原因; 理由' },
  { front: 'reasonable', pos: 'adj.', back: '合理的' },
  { front: 'responsibility', pos: 'n.', back: '责任' },
  { front: 'responsible', pos: 'adj.', back: '有责任的' },
  { front: 'noisy', pos: 'adj.', back: '吵闹的' },
  { front: 'noise', pos: 'n.', back: '噪音; 声响; 杂音' },
  { front: 'noisily', pos: 'adv.', back: '吵闹地' },
  { front: 'awake', pos: 'adj.', back: '醒着' },
  { front: 'awaken', pos: 'v.', back: '(使)醒来' },
  { front: 'choice', pos: 'n.', back: '选择; 抉择' },
  { front: 'choose', pos: 'v.', back: '选择' },
  { front: 'advise', pos: 'v.', back: '劝告; 建议' },
  { front: 'advice', pos: 'n.', back: '劝告; 建议' },
  { front: 'indoors', pos: 'adv.', back: '在室内' },
  { front: 'indoor', pos: 'adj.', back: '室内的' },
  { front: 'magical', pos: 'adj.', back: '有魔力的' },
  { front: 'magic', pos: 'n.', back: '魔力' },
  { front: 'wealth', pos: 'n.', back: '钱财; 财富' },
  { front: 'wealthy', pos: 'adj.', back: '富有的' },
  { front: 'serve', pos: 'v.', back: '接待, 服务' },
  { front: 'service', pos: 'n.', back: '接待, 招待' },
  { front: 'servant', pos: 'n.', back: '仆人, 佣人' },
  { front: 'likely', pos: 'adj.', back: '可能发生的' },
  { front: 'unlikely', pos: 'adv.', back: '不太可能发生的' },
  { front: 'pride', pos: 'n.', back: '自豪; 骄傲' },
  { front: 'proud', pos: 'adj.', back: '自豪的, 得意的' },
  { front: 'proudly', pos: 'adv.', back: '傲慢地, 自负地' }
];

const unit8Phrases = [
  { front: 'grow up', back: '长大; 成熟' },
  { front: 'care for', back: '照顾; 照料' },
  { front: 'in short', back: '总之; 简而言之' },
  { front: 'have no choice but to do', back: '别无选择' },
  { front: 'run free', back: '自由奔走' },
  { front: 'lie around', back: '懒散度日; 游手好闲' },
  { front: 'complain about', back: '抱怨' },
  { front: 'in addition', back: '除...以外(还)' },
  { front: 'catch the eye of sb.', back: '引起某人的注意' },
  { front: 'hold...in one\'s arms', back: '把...抱在怀里' },
  { front: 'be pleased to do sth.', back: '高兴做某事' },
  { front: 'bring you lots of happiness', back: '给你带来许多快乐' },
  { front: 'bark at strangers', back: '对陌生人吠叫' },
  { front: 'a small number of', back: '少数的...' },
  { front: 'What\'s more', back: '除此之外, ...' },
  { front: 'large open spaces', back: '大的开放式空间' },
  { front: 'because of all these reasons', back: '因为这些原因' },
  { front: 'advise sb. to do sth.', back: '建议某人做某事' },
  { front: 'grow closer', back: '变得更亲密' },
  { front: 'relieve themselves', back: '解手' },
  { front: 'make a loud noise', back: '发出大的噪声' },
  { front: 'magical powers', back: '魔力' },
  { front: 'a symbol of', back: '一种...的标志' },
  { front: 'be full of pride for', back: '对...充满自豪' },
  { front: 'all kinds of', back: '各种各样的' }
];

const compileUnitData = (unitId: string, vocab: any[], phrases: any[], sentences: any[] = []): FlashcardData[] => {
    return [
        ...vocab.map((item, idx) => ({
            id: generateId(`${unitId}-voc`, idx),
            front: item.front,
            back: item.back,
            pos: item.pos,
            type: CardType.WORD,
            level: 0,
            nextReview: 0 
        })),
        ...phrases.map((item, idx) => ({
            id: generateId(`${unitId}-phr`, idx),
            front: item.front,
            back: item.back,
            type: CardType.PHRASE,
            level: 0,
            nextReview: 0
        })),
        ...sentences.map((item, idx) => ({
            id: generateId(`${unitId}-sen`, idx),
            front: item.front,
            back: item.back,
            type: CardType.SENTENCE,
            level: 0,
            nextReview: 0
        }))
    ];
};

export interface PreloadedUnit {
    id: string;
    name: string;
    data: FlashcardData[];
}

import { unit8B1Vocab, unit8B1Phrases, unit8B1Sentences } from './vocabData8B1';

export const PRELOADED_UNITS: PreloadedUnit[] = [
    { id: 'unit_grade8a_1', name: 'Grade 8A Unit 1', data: compileUnitData('u1', unit1Vocab, unit1Phrases) },
    { id: 'unit_grade8a_2', name: 'Grade 8A Unit 2', data: compileUnitData('u2', unit2Vocab, unit2Phrases) },
    { id: 'unit_grade8a_3', name: 'Grade 8A Unit 3', data: compileUnitData('u3', unit3Vocab, unit3Phrases) },
    { id: 'unit_grade8a_4', name: 'Grade 8A Unit 4', data: compileUnitData('u4', unit4Vocab, unit4Phrases) },
    { id: 'unit_grade8a_5', name: 'Grade 8A Unit 5', data: compileUnitData('u5', unit5Vocab, unit5Phrases) },
    { id: 'unit_grade8a_6', name: 'Grade 8A Unit 6', data: compileUnitData('u6', vocabularyRaw6, phrasesRaw6) },
    { id: 'unit_grade8a_7', name: 'Grade 8A Unit 7', data: compileUnitData('u7', unit7Vocab, unit7Phrases) },
    { id: 'unit_grade8a_8', name: 'Grade 8A Unit 8', data: compileUnitData('u8', unit8Vocab, unit8Phrases) },
    { id: 'unit_grade8b_1', name: 'Grade 8B Unit 1', data: compileUnitData('u9', unit8B1Vocab, unit8B1Phrases, unit8B1Sentences) }
];

export const INITIAL_DATA: FlashcardData[] = PRELOADED_UNITS[5].data;