# 🏆 World Cup Display

<div align="center">

<img src="https://img.shields.io/badge/Platform-Windows%2010%2F11-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Electron-Desktop_App-47848F?style=for-the-badge&logo=electron" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

### ⚽ Windows 桌面世界杯实时比分组件

**Dynamic Island 风格悬浮比分助手**  
实时追踪世界杯赛事、进球提醒与赛程动态

</div>

---

## ✨ 项目简介

World Cup Display 是一个基于 **Electron + React** 构建的 Windows 桌面足球赛事组件。

应用以类似 **Apple Dynamic Island（灵动岛）** 的悬浮胶囊形式常驻桌面右上角，在不影响工作的情况下实时展示：

- 🔴 正在进行的比赛
- ⚽ 实时比分变化
- 🚨 进球事件提醒
- 📅 当日赛事赛程
- 🔄 多场比赛自动轮播

让用户无需打开浏览器或直播网站，即可第一时间获取世界杯比赛动态。

---

## 🎯 核心特性

### 🏝️ Dynamic Island 风格悬浮窗

- 无边框透明窗口
- 始终置顶显示
- 胶囊式现代化设计
- 不影响日常办公和学习

### ⚽ 实时比分更新

- 自动同步世界杯赛事数据
- 显示实时比分
- 展示比赛状态与时间

### 🚨 进球动画提醒

当检测到进球事件时：

- 自动弹出通知动画
- 显示进球球员
- 显示助攻球员
- 实时更新比分

### 📋 展开式赛事面板

点击悬浮窗即可展开：

- 进行中的比赛
- 已结束比赛
- 即将开始比赛
- 完整赛事信息

### 🔄 多场比赛轮播

支持同时展示多场直播赛事：

- 自动轮播切换
- 无需手动操作
- 保持信息实时更新

### 🖥️ 系统托盘支持

- 最小化到系统托盘
- 隐藏/显示窗口
- 后台持续运行
- 一键退出应用

---

## 📸 应用预览

> 建议放置以下截图：

```text
docs/
├── preview-main.png
├── preview-expanded.png
└── goal-popup.png
```

### 主界面

![主界面](docs/preview-main.png)

### 展开面板

![展开面板](docs/preview-expanded.png)

### 进球提醒

![进球提醒](docs/goal-popup.png)

---

## 🛠️ 技术架构

| 技术 | 作用 |
|--------|--------|
| Electron | Windows 桌面应用容器 |
| React 18 | UI 构建 |
| Vite 5 | 项目构建工具 |
| Zustand | 全局状态管理 |
| Tailwind CSS | 样式系统 |
| Axios | 网络请求 |
| Football-Data API | 实时赛事数据源 |

---

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18
npm >= 9
```

### 1️⃣ 克隆项目

```bash
git clone https://github.com/your-name/WorldCupDisplay.git

cd WorldCupDisplay
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 配置 API Token

复制环境变量文件：

```bash
cp .env.example .env
```

修改 `.env`：

```env
VITE_FOOTBALL_DATA_TOKEN=YOUR_TOKEN
```

---

## 💻 开发运行

### Web 模式

```bash
npm run dev
```

### Electron 模式

```bash
npm run electron:dev
```

---

## 📦 打包发布

生成 Windows 安装包：

```bash
npm run electron:build
```

构建产物通常位于：

```text
dist/
release/
```

---

## 🔑 数据源说明

项目使用 Football-Data.org 提供的赛事接口。

### 获取 Token

1. 注册 Football-Data.org
2. 获取 API Token
3. 填写到 `.env` 文件

### 免费版限制

| 项目 | 限制 |
|--------|--------|
| 请求频率 | 10 次/分钟 |
| 当前策略 | 30 秒/次 |
| 限流处理 | 自动重试 |

> ⚠️ 请勿将 Token 提交到 GitHub。

---

## 📂 项目结构

```text
WorldCupDisplay
│
├─ electron
│  ├─ main.cjs
│  └─ preload.cjs
│
├─ src
│  ├─ components
│  │  ├─ DynamicIsland.jsx
│  │  ├─ ExpandedPanel.jsx
│  │  ├─ MatchCard.jsx
│  │  └─ GoalPopup.jsx
│  │
│  ├─ hooks
│  │  └─ useGoalDetector.js
│  │
│  ├─ services
│  │  └─ api.js
│  │
│  ├─ store
│  │  └─ useStore.js
│  │
│  ├─ styles
│  │  └─ index.css
│  │
│  ├─ App.jsx
│  └─ main.jsx
│
├─ assets
│  └─ tray-icon.png
│
├─ .env.example
├─ package.json
├─ vite.config.js
└─ tailwind.config.js
```

---

## ⚙️ 数据流

```text
Football-Data API
        │
        ▼
   api.js
        │
        ▼
 Zustand Store
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
Island Panel     GoalDetector
窗口    面板       进球检测
```
---

## 🌟 未来规划

- [ ] 世界杯赛程订阅
- [ ] 自定义球队关注
- [ ] Windows 通知中心集成
- [ ] 多语言支持
- [ ] 深色 / 浅色主题切换
- [ ] 数据缓存优化
- [ ] FIFA 排名展示

---

## 🤝 贡献

欢迎提交：

- Issue
- Pull Request
- 功能建议
- UI 优化方案

如果这个项目对你有帮助，欢迎点一个 ⭐ Star。

---

## 📄 License

本项目采用 MIT License 开源。

---

<div align="center">

### ⚽ Never Miss A Goal

实时关注世界杯每一个精彩瞬间

</div>
