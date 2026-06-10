# World Cup Display 🏆

> Windows 桌面世界杯实时比分显示器 — Dynamic Island 风格悬浮窗

一个基于 Electron + React 的 Windows 桌面小工具，以类似 iPhone Dynamic Island（灵动岛）的胶囊形态悬浮在屏幕右上角，实时展示 2026 世界杯赛事比分和进球提醒。

---

## ✨ 功能

- **灵动岛悬浮窗** — 胶囊形状，置顶悬浮，实时显示当前直播比分
- **展开赛程面板** — 点击胶囊展开完整面板，查看所有赛事（直播 / 已结束 / 即将开始）
- **进球弹窗动画** — 进球时自动弹出动画提醒，包含进球者、助攻者和当前比分
- **多场直播轮播** — 多场直播同时进行时自动轮播展示
- **系统托盘** — 最小化到系统托盘，右键可显示/隐藏/退出

---

## 🖥️ 截图

<!-- TODO: 补充应用截图 -->
<!-- 可在运行时截图后替换此处 -->

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Electron](https://www.electronjs.org/) | 桌面窗口（无边框、透明、置顶） |
| [React 18](https://react.dev/) | UI 框架 |
| [Vite 5](https://vitejs.dev/) | 构建工具 |
| [Zustand](https://zustand.docs.pmnd.rs/) | 状态管理 |
| [Tailwind CSS](https://tailwindcss.com/) | 样式 |
| [Axios](https://axios-http.com/) | HTTP 请求 |
| [Football-Data.org API](https://www.football-data.org/) | 实时比赛数据 |

---

## 📦 快速开始

### 前提条件

- Node.js 18+
- 注册 [Football-Data.org](https://www.football-data.org/client/register) 账号获取 API Token

### 安装

```bash
# 克隆仓库
git clone https://github.com/你的用户名/WorldCupDisplay.git
cd WorldCupDisplay

# 安装依赖
npm install

# 配置 API Token
cp .env.example .env
# 编辑 .env 文件，将 your_token_here 替换为你的 API Token
```

### 开发

```bash
# 仅前端（浏览器预览）
npm run dev

# Electron 桌面窗口
npm run electron:dev
```

### 构建

```bash
npm run electron:build
```

---

## 🔑 API Token 配置

本项目使用 Football-Data.org 的免费 API 获取实时比赛数据。

1. 前往 [Football-Data.org 注册页](https://www.football-data.org/client/register) 注册账号
2. 注册后你会收到一封包含 API Token 的邮件
3. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```
4. 将 Token 填入 `.env` 文件：
   ```
   VITE_FOOTBALL_DATA_TOKEN=你的Token
   ```

> ⚠️ **`.env` 文件已被 `.gitignore` 忽略，不会被提交到 GitHub。** 请勿将你的 API Token 分享给他人。

### 免费版 API 限制

- 每分钟最多 10 次请求
- 本项目每 30 秒轮询一次，完全在限制范围内
- 遇到限流（429）会自动等待重试

---

## 📁 项目结构

```
WorldCupDisplay/
├── electron/
│   ├── main.cjs          # Electron 主进程
│   └── preload.cjs       # 预加载脚本（IPC 通信）
├── src/
│   ├── components/
│   │   ├── DynamicIsland.jsx   # 胶囊悬浮窗
│   │   ├── ExpandedPanel.jsx   # 展开面板
│   │   ├── MatchCard.jsx       # 比赛卡片
│   │   └── GoalPopup.jsx       # 进球弹窗
│   ├── hooks/
│   │   └── useGoalDetector.js  # 进球检测 Hook
│   ├── services/
│   │   └── api.js              # API 数据层
│   ├── store/
│   │   └── useStore.js         # Zustand 状态管理
│   ├── styles/
│   │   └── index.css           # 全局样式 + Tailwind
│   ├── App.jsx
│   └── main.jsx
├── assets/
│   └── tray-icon.png           # 系统托盘图标
├── .env.example                # 环境变量模板
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## ⚙️ 工作原理

```
Football-Data.org API
        │
        ▼
  src/services/api.js     每 30 秒拉取一次数据
        │
        ▼
  src/store/useStore.js   Zustand 全局状态
        │
        ├──► DynamicIsland     胶囊窗口（直播比分）
        ├──► ExpandedPanel     展开面板（全部赛事）
        └──► useGoalDetector   检测新增进球 → GoalPopup 弹窗动画
```

---

## 📝 License

MIT

---

## 🙏 致谢

- 比赛数据由 [Football-Data.org](https://www.football-data.org/) 提供
- UI 设计灵感来自 Apple Dynamic Island
