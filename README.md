# World Cup Display

<div align="center">

<img src="https://img.shields.io/badge/Platform-Windows%2010%2F11-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Electron-Desktop_App-47848F?style=for-the-badge&logo=electron" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

### Windows 桌面世界杯实时比分悬浮窗

**Dynamic Island 风格 · 国旗展示 · 进球提醒 · 赛程轮播**

</div>

---

## 项目简介

World Cup Display 是一个基于 **Electron + React** 的 Windows 桌面足球赛事悬浮组件，以 **Apple Dynamic Island（灵动岛）** 风格的胶囊窗口常驻桌面顶部，在不影响日常工作的同时提供实时赛事信息。

### 核心特性

- **国旗展示** — 使用高清国旗图片替代系统 emoji，在 Windows 上完美渲染各国/地区国旗
- **实时比分** — 自动同步世界杯赛事数据，显示实时比分与比赛时间
- **进球提醒** — 检测到进球时弹出动画通知，显示进球球员与助攻信息
- **展开面板** — 点击悬浮窗展开完整赛事面板，分为进行中、已结束、即将开始三个区域
- **多场轮播** — 同时有多场直播赛事时自动轮播切换
- **系统托盘** — 最小化到系统托盘，后台持续运行

---

## 技术栈

| 技术 | 用途 |
|---|---|
| Electron 33 | Windows 桌面应用容器 |
| React 18 | UI 框架 |
| Vite 5 | 构建工具 |
| Zustand | 状态管理 |
| Tailwind CSS 3 | 样式系统 |
| Axios | HTTP 请求 |
| Football-Data.org API | 实时赛事数据 |
| FlagCDN | 国旗图片 CDN |

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 1. 克隆项目

```bash
git clone https://github.com/your-name/WorldCupDisplay.git
cd WorldCupDisplay
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 API Token

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Football-Data.org API Token：

```env
VITE_FOOTBALL_DATA_TOKEN=YOUR_TOKEN
```

> 免费注册获取 Token：[football-data.org](https://www.football-data.org/)

---

## 开发

### Web 模式

```bash
npm run dev
```

### Electron 桌面模式

```bash
npm run electron:dev
```

---

## 打包

生成 Windows 安装包：

```bash
npm run electron:build
```

构建产物位于 `dist/` 或 `release/` 目录。

---

## 项目结构

```text
WorldCupDisplay/
├── electron/
│   ├── main.cjs              # Electron 主进程
│   └── preload.cjs           # 预加载脚本
├── src/
│   ├── components/
│   │   ├── DynamicIsland.jsx  # 胶囊悬浮窗（Live/Upcoming/空闲）
│   │   ├── ExpandedPanel.jsx  # 展开式赛事面板
│   │   ├── MatchCard.jsx      # 单场赛事卡片
│   │   └── GoalPopup.jsx      # 进球动画弹窗
│   ├── hooks/
│   │   └── useGoalDetector.js # 进球检测 Hook
│   ├── services/
│   │   └── api.js             # API 请求、数据映射、国旗 URL 生成
│   ├── store/
│   │   └── useStore.js        # Zustand 全局状态
│   ├── styles/
│   │   └── index.css          # 全局样式
│   ├── App.jsx                # 根组件
│   └── main.jsx               # React 入口
├── assets/
│   └── tray-icon.png          # 系统托盘图标
├── .env.example               # 环境变量示例
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 数据流

```text
Football-Data.org API
        │
        ▼
   api.js (mapMatch → getFlagUrl)
        │
        ▼
  Zustand Store
        │
   ┌────┼────────────┐
   ▼    ▼            ▼
 Island Panel   GoalDetector
 悬浮窗 展开面板  进球检测
```

### 国旗显示机制

项目使用 [FlagCDN](https://flagcdn.com) 提供高清国旗图片。`api.js` 中的 `TLA_TO_ISO` 映射表将 FIFA 三字母国家代码（如 `ARG`）转换为 ISO 3166-1 两位代码（如 `ar`），再拼接为 CDN URL：

```
https://flagcdn.com/w80/ar.png  ← 阿根廷国旗
https://flagcdn.com/w80/br.png  ← 巴西国旗
```

对于未匹配的国家代码，显示地球 emoji `🌐` 作为占位符。

---

## API 限制

Football-Data.org 免费版限制：

| 项目 | 限制 |
|---|---|
| 请求频率 | 10 次/分钟 |
| 应用轮询 | 30 秒/次 |
| 限流处理 | 自动退避 |

> 请勿将 API Token 提交到 Git 仓库。

---

## 贡献

欢迎提交 Issue、Pull Request 或功能建议。

如果觉得项目有用，欢迎给一个 ⭐ Star。

---

## License

MIT

---

<div align="center">

**⚽ Never Miss A Goal**

</div>
