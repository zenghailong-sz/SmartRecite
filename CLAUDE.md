# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

- `npm install` — 安装依赖
- `npm run dev` — 启动 Vite 开发服务器（默认 5173，已具备 HMR）
- `npm run build` — 先 `tsc` 类型检查再 `vite build`，输出到 `dist/`
- `npm run preview` — 本地预览 build 产物
- `npm run lint` — `tsc --noEmit`，本项目没有 ESLint，类型检查即 lint

无测试套件。无单测、无 e2e。

部署：push 到 `main` 会触发 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。`vite.config.ts` 中 `base: './'` 是为相对路径部署设置的，**不要改成绝对路径**。

## 架构总览

### 整体形态
- 单页 React 18 应用，**没有路由**。全部 UI 状态集中在 `App.tsx`（约 1300 行的"巨石组件"，含所有视图模式、键盘逻辑、Firestore 同步副作用）。
- Tailwind CSS 走 `index.html` 里的 CDN 注入，**不在构建管线里**，新建样式无需配置，但也无法 tree-shake。
- `index.html` 同时包含一段 importmap（指向 esm.sh）——这是 AI Studio 模板遗留，**实际构建走 npm + Vite，不要依赖 importmap 跑生产**。

### 数据层：Firestore + 本地迁移
所有用户数据存放在 Firestore，集合结构：
```
/users/{userId}                        — 用户档案（uid, email, createdAt, lastSync）
/users/{userId}/units/{unitId}         — 学习单元（name, count, masteredCount, learningCount, ownerId）
/users/{userId}/units/{unitId}/cards/{cardId}  — 单张卡片（front/back/pos/type/level/nextReview/lastReviewed）
```
- 验证规则：`firestore.rules`。改字段/枚举（`type`、`level` 范围 0-5）时必须**同步更新规则**，否则写入会被拒绝。
- 数据模型源：`types.ts`（前端）+ `firebase-blueprint.json`（声明式蓝图）+ `firestore.rules`（服务端校验）三者必须一致。
- 旧版数据迁移：`App.tsx` 顶部 `runMigration()` 会把旧的 `localStorage` 中以 `flashcards_app_registry_v1` / `flashcards_unit_*` 为键的数据批量写入 Firestore，迁移完成后写入 `flashcards_migration_complete` 标记。**新功能不要再往 localStorage 写**。
- 首次登录种子数据：当 Firestore 中该用户 units 为空时，会用 `PRELOADED_UNITS`（来自 `vocabData.ts` + `vocabData8B1.ts`）批量 seed。

### Firebase 接入
- `firebase.ts`：初始化 SDK，导出 `db` / `auth`，统一错误处理 `handleFirestoreError(error, OperationType, path)`——所有 Firestore 调用都应该用 try/catch 包住并把错误丢给它（保留 uid/email/operation/path 上下文，便于排查权限问题）。
- `FirebaseContext.tsx`：Google OAuth 登录，`user` / `isAuthReady` 两个状态贯穿整个 App 的数据同步副作用。**写新副作用时务必加 `if (!isAuthReady || !user) return;` 守卫**，否则会在登录前发起请求被规则拒。
- Firestore 用 `firestoreDatabaseId` 指定的命名数据库（非 `(default)`），见 `firebase-applet-config.json`。

### 间隔重复算法 (SRS)
- 6 个等级（0-5），间隔在 `constants.ts` 的 `INTERVALS_MINUTES` 中：10m / 6h / 15h / 2d / 5d。
- `updateCardLevel(cardId, isCorrect)`：答对升一级、答错降一级；同时维护 unit 上的 `masteredCount` / `learningCount`（用 batch 一次更新，**不要拆成两次写**，避免计数漂移）。
- "Cram 模式"绕过 SRS，把所有 `level < 5` 的卡都纳入复习；"Read 模式"无 SRS，纯浏览；"Spell 模式"按 `nextReview <= now` 过滤。三种模式的过滤逻辑都在 `checkIsActive()`。

### 导航与渲染优化
- 卡片导航不用 `useEffect` 响应模式切换——`App.tsx` 注释明确说"防止 State→Render→Effect→State→Render 的双渲染循环"。模式/筛选/Cram 切换通过显式 handler (`handleStudyModeChange` / `handleFilterChange` / `handleProtectedCramToggle`) 立即调用 `resetNavigation`。**新增模式时遵循同样模式，不要写 effect 同步**。
- 自动朗读防双播：`lastPlayedCardId` ref + 100ms 防抖；切卡过快时 cleanup 会清掉 timeout。

### PIN 保护机制
- `hooks/usePinAuth.ts`：硬编码 `ADMIN_PIN = '1897'`。**不是登录密码**，是"危险操作二次确认"——重置进度、删除单元、导入、考前突击切换、时间穿梭都走 `requireAuth(callback)`，弹 PIN 弹窗，验证通过后才执行回调。
- `isLocked` 始终为 `true`，仅作为 UI 上锁图标的视觉提示；授权是"一次性"的，不持久。

### 媒体能力
- `utils/media.ts`：所有提示音用 Web Audio API 实时合成（无音频文件依赖）；TTS 走 `window.speechSynthesis`，会优先选 Google/Samantha/Zira 英语音色，缓存 `voices` 列表避免每次 `getVoices()`。
- 庆祝彩带：`window.confetti` 来自 `index.html` 里 CDN 引入的 `canvas-confetti`，用 `(window as any).confetti` 访问。

### 词库
- `vocabData.ts` + `vocabData8B1.ts` 是 8 年级英语教材内置词库（Grade 8A Unit 1-8 + Grade 8B Unit 1），通过 `compileUnitData()` 把 raw vocab/phrase/sentence 合并成 `FlashcardData[]`。新增预置单元只需在 `PRELOADED_UNITS` 数组里加一项。

## 修改前必读

- 改 Firestore 字段结构 → 必须同步 `types.ts` + `firestore.rules` + `firebase-blueprint.json`，否则写入会被规则拒绝。
- 改 `INTERVALS_MINUTES` 数组长度 → 必须同时调整 `level` 上限（目前硬编码为 5）和规则中 `level <= 5` 的校验。
- App.tsx 已极度臃肿（>1300 行）。如需新增大块功能，优先抽组件到 `components/`；不要在 App.tsx 内继续堆叠 useEffect。
- `firebase-applet-config.json` 中包含明文 API key（Firebase Web 客户端 key 设计上即可公开，安全靠 Firestore Rules 保证），但**不要把任何 server-side 凭据塞进这个仓库**。
