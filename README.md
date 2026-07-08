# SMME 网站

SMME（SMM Entertainment）单页 cinematic 展示站点。当前处于 **全屏滚动交互调整** 阶段，核心页面为 Scene 1 至 Scene 5 的全屏滚动展示。

**目标体验：** 参考 [Thorgal](https://www.thorgal.com/) 的分屏滚动——每次滚动只切换一屏、Scene 完整占满视口、Scene 5 与 Scene 1 循环衔接。

**当前重点：** 一次连续滚轮输入只切换一个 Scene、Scene 5 循环回 Scene 1、首页 Scroll Down 提示。

**仓库：** `https://github.com/seven2303779642-lab/smme-landing-page.git`  
**协作说明：** 根目录 `AGENTS.md`（面向 Cursor / AI Agent）

## 目录

- [技术栈](#技术栈)
- [页面与组件结构](#页面与组件结构)
- [本轮滚动交互改造记录](#本轮滚动交互改造记录)
- [Footer 状态](#footer-状态)
- [验收状态](#验收状态)
- [Build / Lint 记录](#build--lint-记录)
- [后续待办](#后续待办)
- [本地运行](#本地运行)
- [更新记录](#更新记录)

---

## 技术栈

基于 `package.json` 实际依赖：

| 层级 | 技术 | 版本 / 说明 |
|------|------|-------------|
| 框架 | Next.js 15（App Router） | `^15.5.0` |
| UI | React | `^19.1.0` |
| 语言 | TypeScript | `strict: true` |
| 样式 | Tailwind CSS v4 | `@import "tailwindcss"` + `@theme inline` |
| 动画 | Framer Motion | Scene 文字 fade-up、Scroll Down 浮动、CTA hover |
| 图片 | `next/image` | 桌面 JPG / 移动 PNG |
| 字体 | Bebas Neue（本地） | `app/fonts/Bebas-Neue-400.ttf` |
| 代码检查 | ESLint + eslint-config-next | `npm run lint` |
| 部署 | GitHub + Vercel | `main` push 触发 |

**未采用：** shadcn/ui、lucide-react、Prettier。

---

## 页面与组件结构

```text
app/
  layout.tsx          # 根布局、本地字体、suppressHydrationWarning
  page.tsx            # 入口，渲染 FullpageLanding
  globals.css         # @theme 颜色 token、base 样式、scrollbar 隐藏规则

components/
  FullpageLanding.tsx   # 页面骨架；包裹 SceneScrollProvider
  SceneSection.tsx      # 单 Scene（桌面 overlay / 移动左右分栏）
  SceneIndicator.tsx    # 右侧 01–05 导航（仅 md+）
  ScrollDownHint.tsx    # Scene 1 底部 SCROLL DOWN 提示
  SiteHeader.tsx        # 固定 logo + 顶部渐变
  SiteFooter.tsx        # 三栏 footer（保留，当前不参与滚动循环）

context/
  SceneScrollContext.tsx  # 中心化全屏滚动控制（currentIndex、手势锁、输入统一）

data/
  scenes.ts           # 唯一文案与图片路径数据源；titleLines[] 控制标题断行

public/images/
  smme-logo.png
  scenes/scene-0N.jpg
  scenes/mobile/scene-0N-mobile.png
```

### 主要文件职责

| 文件 | 作用 |
|------|------|
| `components/FullpageLanding.tsx` | 组合 Header、5 个 Scene、Footer、Indicator、ScrollDownHint；挂载 `SceneScrollProvider` |
| `components/SceneSection.tsx` | 单屏 Scene 布局与内容动画；`data-scene-id` 供滚动定位 |
| `components/SceneIndicator.tsx` | 桌面右侧场景编号与 active line；点击走 `goTo(index)` |
| `components/ScrollDownHint.tsx` | 仅 Scene 1 显示；文案 `SCROLL DOWN` + 箭头；可点击 `goNext` |
| `context/SceneScrollContext.tsx` | 全屏滚动状态机：索引、动画锁、wheel gesture lock、多输入统一 |
| `app/globals.css` | 品牌色 token；已禁用 CSS scroll snap；已隐藏浏览器原生 scrollbar |
| `data/scenes.ts` | Scene 文案、图片路径、accent、CTA 等结构化数据 |

**页面树：**

```text
FullpageLanding (SceneScrollProvider)
├── SiteHeader
├── SceneSection × 5
├── SiteFooter          # 保留在 DOM，当前滚动不进入
├── SceneIndicator
└── ScrollDownHint
```

**滚动容器：** document / `window` 级别滚动（`window.scrollTo`），对应 `html` + `body`。

---

## 本轮滚动交互改造记录

### 已完成

#### 1. 新增中心化滚动控制逻辑

**文件：** `context/SceneScrollContext.tsx`

功能包括：

- `currentIndex`（Scene 1 = 0，Scene 5 = 4）
- `goTo(index)` / `goNext()` / `goPrev()`
- **animation lock** — 切屏动画进行中忽略新导航
- **wheel gesture lock** — 一段连续滚轮输入只消费一次切换
- touch swipe — 一次滑动手势切换一屏
- keyboard — `ArrowUp` / `ArrowDown` / `PageUp` / `PageDown` / `Space`
- indicator click — 走 `goTo`，遵守 animation lock
- ScrollDownHint click — 走 `goNext`，遵守 animation lock

所有输入经 `beginNavigation` 统一入口；wheel 与 indicator / keyboard / touch 的释放条件不同（见下）。

#### 2. 一次连续滚轮输入只切换一个 Scene

**关键语义：** 不是「每个 wheel event 切一次」，而是「一段连续 wheel gesture / wheel burst 只消费一次」。

行为：

- 第一个有效 wheel 事件（`|deltaY| ≥ 12`）触发一次 `goNext` 或 `goPrev`，并标记 `wheelGestureActive`
- 同一段连续 wheel 期间：所有后续 wheel 事件 `preventDefault` 并忽略，**不排队**
- 每次 wheel 事件刷新 **300ms** 静默计时器（`WHEEL_IDLE_MS`）
- 动画结束（`scrollend` 或 **900ms** fallback）标记 `animationDone`
- **仅当** `animationDone === true` **且** `wheelIdleDone === true`（滚轮已静默 300ms）才释放锁
- 快速拨动很多档滚轮：只触发 **一次** Scene 切换；即使 wheel 事件持续超过 900ms，也不会在滚轮未停稳前触发第二次

非 wheel 输入（indicator、keyboard、ScrollDown、touch）不启用 wheel gesture，动画完成即可释放。

#### 3. Scene 循环逻辑

| 规则 | 实现 |
|------|------|
| Scene 1 | `index 0` |
| Scene 5 | `index 4` |
| 向下 | `(currentIndex + 1) % 5` |
| 向上 | `(currentIndex - 1 + 5) % 5` |
| Scene 5 向下 | 回到 Scene 1 |
| Scene 1 向上 | 回到 Scene 5 |

相邻 Scene 使用 `behavior: "smooth"`；循环跳转（0↔4）及跨多屏 indicator 跳转使用 `behavior: "auto"`（瞬间跳转，避免穿过中间 Scene）。

#### 4. Scroll Down 提示

**文件：** `components/ScrollDownHint.tsx`

- 只在 Scene 1（`currentIndex === 0`）显示
- 文案：`SCROLL DOWN`
- 带向下箭头
- 支持点击切换到下一屏（`goNext`）
- 文字约 `clamp(18px, 1.6vw, 24px)`，箭头约 `clamp(28px, 2.8vw, 40px)`，接近 subtitle / 小标语尺寸
- Framer Motion 轻微上下浮动

#### 5. SceneIndicator 改造

**文件：** `components/SceneIndicator.tsx`

- 移除 `IntersectionObserver` 驱动 active
- `active` 由 `currentIndex` 驱动
- 点击不再直接 `scrollIntoView`
- 点击走 `goTo(index)`，遵守 `isScrolling` / animation lock
- 不受 `wheelGestureActive` 永久锁住（非 wheel 路径立即 `wheelIdleDone = true`）

#### 6. SceneSection 改造

**文件：** `components/SceneSection.tsx`

- 移除 CSS snap class（`snap-start`、`scroll-snap-stop`）
- 移除 `IntersectionObserver` 控制 in-view
- 文字显示动画由 `currentIndex === scene.id - 1` 控制 `isInView`

#### 7. CSS Scroll Snap 已禁用

**文件：** `app/globals.css`

- 已移除 `scroll-snap-type: y mandatory`
- 已移除全局 `scroll-behavior: smooth`
- 页面切换改由 JS（`SceneScrollContext`）统一控制
- Scene 仍保持 `h-screen` / `min-h-[100svh]` 全屏高度

#### 8. 浏览器原生 Scrollbar 已隐藏

**文件：** `app/globals.css`

客户需求为隐藏 **浏览器原生** 右侧滚动条（非 SceneIndicator 编号导航），已与客户确认。

实现方式（作用于 `html` + `body`，即 document 滚动容器）：

```css
html,
body {
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE / Edge */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;                /* Chrome / Safari / Opera */
  width: 0;
  height: 0;
}
```

滚动/切屏功能保留；右侧 SceneIndicator（01–05）**未隐藏**。

---

## Footer 状态

- `SiteFooter` 组件 **保留在代码与 DOM 中**，未删除
- 当前滚动体验 **严格限制在 Scene 1～Scene 5** 循环
- Footer **不参与** 全屏滚动循环；wheel 拦截与 scroll 钳位防止滚入 Footer 区域
- 若客户后续要求 Footer 可达，需单独设计入口（如 CTA、独立链接）或调整循环范围

---

## 验收状态

### 已通过

- [x] 快速滚轮不会一次跳过多个 Scene
- [x] 一段连续滚轮输入只切换一个 Scene
- [x] 动画期间不会插队触发下一屏
- [x] Scene 5 向下回到 Scene 1
- [x] Scene 1 向上回到 Scene 5
- [x] Scroll Down 提示功能正确
- [x] Scroll Down 提示尺寸已放大
- [x] Indicator 点击遵守统一滚动锁
- [x] 浏览器原生 Scrollbar 已隐藏（客户已确认指原生滚动条，非 SceneIndicator）
- [x] `npm run build` 通过
- [x] `npm run lint` 通过

---

## Build / Lint 记录

```bash
npm run build  # passed
npm run lint   # passed
```

最近一次全屏滚动改造后本地验证通过。交付前请重新执行上述命令。

---

## 后续待办

1. **Footer 可达方案** — 若产品要求，设计 Footer 入口或调整循环范围
2. **循环过渡优化** — Scene 5 → Scene 1 可改为更接近参考站的 fade / seamless transition（当前为 instant jump）
3. **移动端 touch swipe 实机 QA** — 不同机型验证手势与滚动锁
4. **跨浏览器验证** — wheel gesture lock、scrollend fallback 表现
5. **同步更新 `AGENTS.md`** — 滚动章节仍描述旧 CSS snap 行为，接手前以本 README 与代码为准

---

## 本地运行

```bash
npm install
npm run dev          # 推荐；遇 .next 缓存问题用 npm run dev:clean
npm run build
npm run lint
```

开发地址：`http://localhost:3000`

---

## 更新记录

### 2026-07-08 — 全屏滚动交互调整

- 新增中心化 Scene 滚动控制（`context/SceneScrollContext.tsx`）。
- 实现一次连续滚轮输入只切换一个 Scene（wheel gesture lock + animation lock）。
- 实现 Scene 1 ↔ Scene 5 循环切换。
- 新增首页 Scroll Down 提示（`components/ScrollDownHint.tsx`）。
- 放大 Scroll Down 文字与箭头尺寸。
- SceneIndicator 改为由 `currentIndex` 驱动；点击走统一 `goTo`。
- SceneSection 移除 CSS snap / IO，改由 `currentIndex` 控制 in-view。
- 禁用 CSS Scroll Snap，改为 JS 控制滚动。
- 隐藏浏览器原生 Scrollbar（`html` / `body`）；客户已确认非 SceneIndicator。
- Build / Lint 均通过。

### 2026-07-08 — README 验收更新

- 客户确认 Scroll Bar 指浏览器原生滚动条；README 将该项标为已完成。

### 更早阶段（概要）

- 初始 landing page：5 Scene 桌面/移动双布局、Framer Motion、Bebas Neue 本地字体。
- Tailwind v4 规范对齐：`@theme` token、移除 wrapper utility class。
- 详见 `AGENTS.md` 与桌面 `工作总结/smme-project-retrospective.md`。

---

*README 维护：滚动或验收状态变更后请同步更新「验收状态」「待确认问题」与「更新记录」。*
