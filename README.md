# SmartRecite

基于间隔重复 (Spaced Repetition System, SRS) 的英语单词学习单页应用。内置 8 年级英语教材词库，支持 Google 账号登录与 Firestore 云端同步。

## 功能特性

- **6 级 SRS 算法**：根据答题对错动态调整复习间隔（10m / 6h / 15h / 2d / 5d / 已掌握）
- **三种学习模式**：
  - **Spell**：按 SRS 调度，只复习到期卡片
  - **Read**：纯浏览，无 SRS 干预
  - **Cram**：考前突击，所有未掌握卡片一次性纳入复习
- **多视图**：卡片翻转 / 列表全览
- **云端同步**：Firestore 多设备实时同步学习进度
- **预置词库**：人教版 8 年级 (Grade 8A Unit 1-8 + Grade 8B Unit 1) 共 9 个单元
- **PIN 二次确认**：重置进度、删除单元、导入、时间穿梭等危险操作需要 PIN 验证（每用户自设）
- **TTS 朗读 + 提示音**：Web Speech API + Web Audio API 实时合成，无音频文件依赖

## 技术栈

- **前端**：React 18 + TypeScript + Vite
- **样式**：Tailwind CSS（CDN 注入）
- **数据**：Firebase Firestore + Google OAuth
- **动效**：framer-motion + canvas-confetti
- **图标**：lucide-react
- **部署**：GitHub Pages（push 到 `main` 自动触发）

## 本地运行

前置要求：Node.js 20+

```bash
npm install
npm run dev          # 启动 Vite 开发服务器，默认 http://localhost:5173
npm run build        # 类型检查 + 生产构建到 dist/
npm run preview      # 本地预览 build 产物
npm run lint         # tsc --noEmit 类型检查
```

## 数据模型

```
/users/{userId}                                — 用户档案（uid, email, pin, lastSync）
/users/{userId}/units/{unitId}                 — 学习单元
/users/{userId}/units/{unitId}/cards/{cardId}  — 单张卡片
```

字段定义、校验规则与服务端约束分别落在：

- `types.ts` — 前端类型
- `firebase-blueprint.json` — 数据蓝图
- `firestore.rules` — 服务端校验规则

三者必须保持一致，改动任一处需同步另外两处。

## 部署

`.github/workflows/deploy.yml` 在 push 到 `main` 时自动触发：

1. `npm install` + `npm run build`
2. 上传 `dist/` 到 GitHub Pages

`vite.config.ts` 中的 `base: './'` 是为相对路径部署设置的，**勿改成绝对路径**。

## 安全说明

- `firebase-applet-config.json` 中的 `apiKey` 是 Firebase Web 客户端 key，**设计上即可公开**，安全由 Firestore Rules + Firebase Auth 保证。
- 服务端不存储任何 server-side 凭据。
- PIN 仅用于客户端"危险操作二次确认"，存储在 Firestore 用户档案中，**不是登录密码**。

## 项目结构

```
App.tsx                  — 根组件（巨石组件，含所有状态与副作用）
FirebaseContext.tsx      — Firebase Auth 上下文
firebase.ts              — Firebase SDK 初始化与错误处理
components/              — UI 组件
hooks/usePinAuth.ts      — PIN 验证流程
utils/                   — 媒体、词性配色、词族工具
vocabData.ts / vocabData8B1.ts  — 预置词库
```
