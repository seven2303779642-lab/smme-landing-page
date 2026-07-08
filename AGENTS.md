# SMME Landing Page — Agent 协作说明

> 面向 Cursor / AI Agent 的项目指南。详细复盘见：`C:\Users\23037\Desktop\工作总结\smme-project-retrospective.md`  
> 仓库：`https://github.com/seven2303779642-lab/smme-landing-page.git`

---

## 1. 项目目标与背景

SMME（SMM Entertainment）是一个 **单页 cinematic 展示站点**，用于品牌视觉呈现，不是多页 CMS 站点。

核心交付：

- 5 个全屏 Scene（01–05）+ 独立 Footer
- 桌面端 fullpage scroll snap + 右侧场景导航
- 移动端独立左右分栏布局
- GitHub 托管，Vercel 自动部署（`main` push 触发）

项目经历多轮视觉微调与结构重构（滚动容器、移动端布局方向、标题断行、Tailwind 规范对齐）。**后续改动应小步、窄范围，避免架构级重写。**

---

## 2. 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 15 App Router | `^15.5.0` |
| 语言 | TypeScript | `strict: true`，禁止 `any` |
| 样式 | Tailwind CSS v4 | `@import "tailwindcss"` + `@theme inline` |
| 动画 | Framer Motion | 仅 scene 进入视口 fade-up、CTA hover |
| 图片 | `next/image` | 桌面 JPG / 移动 PNG，双 DOM 切换 |
| 字体 | Bebas Neue（本地） | `app/fonts/Bebas-Neue-400.ttf` |
| 部署 | GitHub + Vercel | push 成功后触发 |

**未采用（勿擅自引入）：** shadcn/ui、lucide-react、Google Fonts、默认 Turbopack dev。

**组件边界：** `page.tsx`、`FullpageLanding` 为 Server Component；`SceneSection`、`SceneIndicator` 为 Client Component（hooks / IntersectionObserver / Framer Motion）。

---

## 3. 页面结构

```
FullpageLanding
├── SiteHeader          # 固定 logo + 顶部渐变
├── SceneSection × 5    # 单 scene，桌面/移动双布局
├── SiteFooter          # 三栏 footer（非 snap section）
└── SceneIndicator      # 右侧 01–05 导航（仅 md+）
```

**滚动行为（已定型，勿改）：**

- `html` 级别 `scroll-snap-type: y mandatory`
- Scene 01–05：`h-screen` + `snap-start` + `[scroll-snap-stop:always]`
- Footer **不在** snap 范围内；Scene 05 之后正常向下滚动到达
- 使用 **document-level scroll**，禁止 inner `h-screen overflow-y-auto` 滚动陷阱

---

## 4. 关键文件

| 路径 | 职责 |
|------|------|
| `data/scenes.ts` | **唯一文案与图片路径数据源**；`titleLines[]` 控制标题断行 |
| `components/SceneSection.tsx` | 最复杂组件：双布局、渐变、动画、CTA |
| `components/SceneIndicator.tsx` | 桌面右侧导航；active line `translateY` 动画 |
| `components/FullpageLanding.tsx` | 页面组合层；footer 独立于 scenes 列表 |
| `components/SiteHeader.tsx` | Logo + 顶部渐变 |
| `components/SiteFooter.tsx` | Footer 三栏文案 |
| `app/globals.css` | `@theme` 颜色 token、`@layer base`（scroll-snap 等） |
| `app/layout.tsx` | 根布局、字体、`suppressHydrationWarning` |
| `scripts/clean-next.mjs` | 清理 `.next` 缓存 |

**图片资产：**

- 桌面：`public/images/scenes/scene-0N.jpg`
- 移动：`public/images/scenes/mobile/scene-0N-mobile.png`
- Logo：`public/images/smme-logo.png`

---

## 5. 设计与响应式规则

**主断点：** `md`（768px）。桌面与移动是 **两套独立 DOM**，不是简单缩放。

### 桌面端（`md+`）

- 全屏背景 JPG + 左侧 `42vw` 渐变 readability panel
- 文字左偏移约 `5.5vw`，垂直居中
- 右侧黑色 rail（`88px`）：01–05 编号 + 滑动 active line
- Headline 使用 `titleLines` 逐行渲染；桌面 `md:whitespace-nowrap` 防意外换行
- Scene 05 含 CTA「ENTER NEXT STAGE」

### 移动端（`< md`）

- **左右分栏**：左 `42vw` 文字面板 | 中 `2px` accent 竖线 | 右 `flex-1` 图片
- 文字面板垂直渐变；竖线 accent 色上下 fade
- **无** 右侧 indicator
- 移动参考图 **仅作布局参考**，文案以 `data/scenes.ts` 为准

### 强调色

| Scene | Accent | Subtitle 特殊规则 |
|-------|--------|-------------------|
| 01 | gold | 灰白 |
| 02 | purple | 全句 purple |
| 03 | purple | 全句 purple |
| 04 | gold | 灰白 |
| 05 | purple | 仅 `NEXT STAGE IS` 为 purple（`subtitleAccentPrefix`） |

### 明确不做

- 右上角 menu / drawer（仅 logo）
- 将 UI 元素烘焙进背景图（编号、标题、indicator、footer、CTA 必须 HTML/CSS）

---

## 6. Tailwind 与样式约定

**老板工程规范（必须遵守）：**

- JSX 中优先使用 Tailwind utility
- **禁止** 组件专属 CSS class（如 `.about-hero`、`.scene-panel`）
- **允许：** `@theme` token、`@layer base`、Tailwind arbitrary values（如 `bg-[linear-gradient(...)]`）
- **允许：** 仅 JS 动态计算值的 inline `style`（当前仅 `SceneIndicator` 的 `translateY`）

**颜色 token（`app/globals.css`）：**

- `--color-gold` / `--color-gold-muted`
- `--color-purple-accent` / `--color-purple-muted`

对应 utility：`text-gold`、`bg-purple-accent`、`border-gold` 等。

---

## 7. 已完成内容

- [x] 5 Scene 桌面 fullpage + scroll snap
- [x] 桌面右侧 SceneIndicator（IntersectionObserver + active line 动画）
- [x] 移动端左右分栏独立布局
- [x] 桌面/移动分图加载
- [x] `titleLines[]` 数据化标题断行
- [x] Scene 05 局部 subtitle accent + CTA
- [x] Footer 独立于 snap sections，可达
- [x] 本地 Bebas Neue 字体
- [x] Hydration 扩展兼容（`suppressHydrationWarning`）
- [x] Dev 稳定性脚本（`npm run dev:clean`）
- [x] Tailwind 规范对齐（移除 wrapper utility class，渐变改 arbitrary values）

---

## 8. 已知问题与待办

| 项 | 状态 | 说明 |
|----|------|------|
| CTA `href="#"` | 待确认 | 可能为占位链接，需产品确认真实跳转 |
| 根目录 `README.md` | 未提交 | 空文件，部署/协作说明待补 |
| shadcn / lucide | 未采用 | 若公司强制 stack 再评估引入 |
| Prettier | 未配置 | 可选，减少 diff 噪音 |
| E2E smoke test | 无 | 可选：footer 可达、5 scenes 存在 |
| QA checklist 文件化 | 无 | 可参考总结文档 §14 |

**Dev 常见问题：**

- `.next` 缓存损坏 / 500：运行 `npm run dev:clean`
- 避免 dev 运行时并行 `npm run build`（Windows 易触发 manifest 竞态）
- 默认 `npm run dev`（不用 Turbopack）；可选 `npm run dev:turbo`

---

## 9. 开发约束（Agent 必读）

### 修改前

1. 明确改动范围：**桌面 / 移动 / 两者**
2. 文案改动只动 `data/scenes.ts`，不从参考图 OCR  invent 文案
3. 滚动、footer 位置、双布局架构：**先报告再改**，不要静默重构

### 修改时

- 一次只改一个明确目标（字号、间距、单组件等）
- 视觉微调 **不要** 连带改 scroll、data、组件拆分
- 桌面与移动用 `hidden md:block` / `md:hidden` 分离，改一端勿破坏另一端

### 修改后

- 运行 `npm run build` 确认 0 TS error
- 列出修改文件清单
- **不要** 自动 `git commit` / `git push`，除非用户明确要求

### 推荐提示词模式

```
请 ONLY 调整 [具体元素] 的 [桌面/移动] 样式。

Do not change:
- scroll behavior
- data/scenes.ts
- component architecture
- footer 位置
- 双布局 DOM 结构

改完后运行 build 并列出修改文件。
```

---

## 10. 不要随意改动的内容

以下结构已经过多次迭代验证，**除非用户明确要求，否则禁止改动：**

| 锁定项 | 原因 |
|--------|------|
| Document-level scroll + snap 范围 | 曾出现 footer 不可达 |
| Footer 在 `FullpageLanding` scenes 列表之外 | 非第六个 snap section |
| 移动端左右分栏（非上下分栏） | 已按参考图定稿 |
| `data/scenes.ts` 文案结构 | 单一数据源 |
| `titleLines: string[]` 断行方式 | 避免 CSS 意外换行 |
| 桌面/移动双 DOM 图片切换 | 非同一 Image responsive class |
| SceneIndicator 行为 spec | 不完全照抄有问题的参考图 |
| Header 仅 logo，无 menu | 产品决策 |
| `suppressHydrationWarning` | 浏览器扩展兼容 |
| Tailwind 样式边界 | 老板工程规范 |

---

## 11. 常用命令

```bash
npm run dev          # 本地开发（推荐）
npm run dev:clean    # 清 .next 后启动（遇 500 时用）
npm run build        # 生产构建（交付前必跑）
npm run lint         # ESLint
```

---

## 12. 验收检查（交付前）

- [ ] `npm run build` 通过
- [ ] 桌面 5 scenes 背景、左 panel、右 indicator 正常
- [ ] 移动左右分栏、竖线渐变、无横向溢出
- [ ] Scene 01–05 snap；Scene 05 向下可达 footer
- [ ] 文案与 `data/scenes.ts` 一致
- [ ] GitHub push → Vercel 部署成功

---

## 13. 信息缺口（总结文件中未完全明确）

以下内容代码库中无完整记录，Agent 不应自行假设：

1. Vercel 项目 URL、环境变量、绑定账号
2. CTA 最终跳转 URL 是否已确定
3. 桌面 scene JPG 是否为最终素材（部分可能源自 PNG 转换）
4. Stakeholder 是否已正式验收 sign-off
5. 公司 Mandatory Tech Stack 文档的权威版本
6. 各轮视觉参考图的完整附件与冲突裁决记录

遇到上述问题时，**向用户确认**，不要凭猜测实现。

---

*维护说明：本文件随项目演进更新；重大架构变更后请同步修订 §3、§10。*
