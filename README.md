# FocusForge 🍅

[![Deploy to GitHub Pages](https://github.com/charlespura/FocusForge/actions/workflows/deploy.yml/badge.svg)](https://github.com/charlespura/FocusForge/actions/workflows/deploy.yml)
[![PWA](https://img.shields.io/badge/PWA-Installable-blueviolet)](https://charlespura.github.io/FocusForge/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


<img width="450" height="250" alt="image" src="https://github.com/user-attachments/assets/20b0f272-2d70-463c-9147-af990f4f06c7" />
<img width="450" height="250" alt="image" src="https://github.com/user-attachments/assets/da93c4b2-8360-45f7-9399-147c76fa803c" />
<img width="450" height="250" alt="image" src="https://github.com/user-attachments/assets/61d306d7-3637-433c-bd04-823aa57b5ba8" />

<img width="450" height="250" alt="image" src="https://github.com/user-attachments/assets/01793bb1-4b53-4669-9030-40083ff07b5d" />

A modern, production-quality **Pomodoro productivity web application** built with **React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, and Recharts**.

FocusForge helps you stay focused, organize tasks, build consistent work habits, and visualize your productivity with a beautiful, premium interface.

## 🌐 Live Demo

**Deployed on GitHub Pages:** [https://charlespura.github.io/FocusForge/](https://charlespura.github.io/FocusForge/)

> **No account required. No backend. No cloud.**
> Everything is stored securely in your browser using **LocalStorage**.

## 📱 Progressive Web App

FocusForge is a fully installable **PWA** (Progressive Web App) that works offline:
- 📲 Install on your phone or desktop
- 🔌 Works without internet connection
- 🔄 Auto-updates when online
- 🎯 App-like experience with splash screen
- 🏠 Home screen icon

### Install Instructions

| Platform | How to Install |
|----------|----------------|
| **Android (Chrome)** | Open the site, tap the install banner or "Add to Home Screen" |
| **iOS (Safari)** | Tap Share → "Add to Home Screen" |
| **Desktop (Chrome/Edge)** | Click the install icon in the address bar |
| **Desktop (Firefox)** | Click the install icon in the address bar |

## ✨ Features

### 🍅 Pomodoro Timer
- Animated circular progress timer with smooth transitions
- Focus, Short Break, Long Break modes with visual indicators
- Start, Pause, Resume, Reset, Skip controls
- Auto-switch between sessions with smart break management
- Fullscreen Focus Mode for distraction-free work
- Keyboard shortcuts for power users
- Browser notifications when sessions complete
- Session tracking with daily completion count
- Current task selection integration
- **Global timer continues running even when navigating to other pages**

### ✅ Task Management
- Create, edit, and delete tasks with rich details
- **Drag & drop reordering** for priority sorting
- Priority levels (High, Medium, Low) with color indicators
- Categories and due dates for better organization
- Pomodoro estimation and progress tracking
- Task completion with automatic streak updates
- Visual progress bar for each task

### 🎯 Daily Goals
- Set daily Pomodoro target (default: 8 sessions)
- Interactive progress ring with percentage
- Goal completion tracking with motivational messages
- Persisted daily goals across sessions

### 📊 Analytics Dashboard
- Comprehensive statistics at a glance
- **Total Focus Time** (hours and minutes)
- **Current Streak** and **Longest Streak** tracking
- **Total Sessions** completed
- **Daily Sessions** (Last 7 Days) - Bar chart
- **Task Completion Rate** - Pie chart with visual breakdown
- Real-time data updates

### 🔥 Streak Tracking
- Current streak with automatic tracking
- Longest streak milestone tracking
- Days active monitoring
- Milestone achievements (3, 7, 14, 30, 50, 100, 365 days)
- Streak persistence across sessions

### 📝 Focus Notes
- **Full Markdown support** with live rendering
- Search notes functionality
- Pin important notes for quick access
- Auto-save with timestamps
- Delete and edit capabilities
- Recent notes sorting

### 🌙 Theme System
Multiple premium themes to match your preference:
- **Light** - Clean and bright
- **Dark** - Eye-friendly dark mode
- **AMOLED** - Pure black for OLED screens
- **Ocean** - Calming blue tones
- **Forest** - Natural green tones
- **Lavender** - Soft purple tones
- **Warm Sand** - Cozy warm tones
- **Midnight** - Deep night theme

### 🏆 Achievement System
Unlock achievements as you build productive habits:
- First Focus Session
- 10, 50, 100, 500, 1000 Sessions
- 7 Day, 30 Day Streak
- Complete Daily Goal
- Focus 4 Hours, 8 Hours
- **Pop-up notifications** when achievements are unlocked

### 🎵 Ambient Sounds *(Coming Soon)*
- Rain, Forest, Coffee Shop, Ocean
- Brown Noise, White Noise, Fireplace, Wind
- Play/Pause controls with volume slider

### 📱 Progressive Web App
- **Installable** on any device
- **Offline support** with service worker
- **Auto-updates** with latest changes
- **Splash screen** on launch
- **Home screen icon** with maskable icon
- **Fullscreen** app-like experience

### 🎨 UI/UX Highlights
- **Premium glassmorphism effects** with backdrop blur
- **Smooth animations** powered by Framer Motion
- **Interactive video banners** on each page
- **Responsive design** for all screen sizes
- **Haptic feedback** on interactive elements
- **Loading states** and transitions
- **Accessibility-first** design
- **Keyboard shortcuts** for efficiency

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| React Router | Navigation |
| Recharts | Data Visualization |
| React Markdown | Markdown Rendering |
| Lucide React | Icons |
| LocalStorage | Data Persistence |
| Vite Plugin PWA | PWA Support |

## 📦 Installation

```bash
git clone https://github.com/charlespura/FocusForge.git
cd FocusForge
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Generate PWA Icons

```bash
npm run generate-icons
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Start / Pause Timer |
| R | Reset Timer |
| S | Skip Timer |
| F | Fullscreen Mode |
| Esc | Exit Fullscreen |

## 📁 Project Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       └── PWAInstallPrompt.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── PomodoroTimer.tsx
│   ├── Tasks.tsx
│   ├── Analytics.tsx
│   ├── Notes.tsx
│   ├── Achievements.tsx
│   └── Settings.tsx
├── store/
│   ├── themeStore.ts
│   ├── taskStore.ts
│   ├── noteStore.ts
│   ├── statisticsStore.ts
│   ├── achievementStore.ts
│   ├── timerStore.ts
│   ├── goalStore.ts
│   └── globalTimerStore.ts
├── hooks/
│   └── useDocumentTitle.ts
├── utils/
│   └── cn.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

## 🎨 Design Philosophy

FocusForge embraces a calm, distraction-free workspace:

- Minimal interface - Clean, uncluttered design
- Premium aesthetic - Feels like a desktop app
- Soft tomato accent - Warm, not aggressive
- Generous whitespace - Breathing room for focus
- Smooth animations - Intentional, not flashy
- Responsive layouts - Works on all devices
- Accessibility-first - WCAG friendly
- Glassmorphism - Modern visual depth
- Soft shadows - Subtle depth without distraction

## ♿ Accessibility

- Keyboard navigation - Full keyboard support
- High contrast - WCAG compliant contrast ratios
- ARIA labels - Screen reader compatible
- Screen reader support - ARIA live regions
- Reduced motion - Respects prefers-reduced-motion
- Focus indicators - Visible focus rings
- Touch targets - Minimum 44px touch targets

## 💾 Data Storage

Everything is stored locally using LocalStorage:

| Data | Storage Key |
|------|-------------|
| Tasks | tasks-storage |
| Notes | notes-storage |
| Statistics | statistics-storage |
| Achievements | achievements-storage |
| Theme | theme-storage |
| Timer Settings | timer-settings |
| Daily Goals | goal-storage |
| Global Timer | global-timer-storage |

No user account required. No data sent to any server.

## 🚀 Deployment

### GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions:

1. Push to the main branch
2. GitHub Actions builds and deploys
3. Site is live at https://charlespura.github.io/FocusForge/

### Manual Deployment

```bash
npm run build
# Upload the contents of the dist folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strictly (no any types)
- Follow the existing code style
- Write meaningful commit messages
- Test your changes before submitting

## 📄 License

Distributed under the MIT License. See LICENSE.md for more information.

## 👨‍💻 Author

**Charles Pura**

- GitHub: [@charlespura](https://github.com/charlespura)
- Project: [FocusForge](https://github.com/charlespura/FocusForge)

## 🙏 Acknowledgments

- Pomodoro Technique - Time management method
- Vite - Build tool
- Tailwind CSS - CSS framework
- Framer Motion - Animation library
- Zustand - State management

## ⭐ Support

If you find FocusForge helpful, please consider giving it a star ⭐ on GitHub. It helps the project grow and reach more people!

![Stars](https://img.shields.io/github/stars/charlespura/FocusForge?style=social)
![Forks](https://img.shields.io/github/forks/charlespura/FocusForge?style=social)

Made with ❤️ and 🍅 by Charles Pura