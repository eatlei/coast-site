# coast-site

Coast App 的对外站点，托管在 GitHub Pages：https://eatlei.github.io/coast-site/

| 页面 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | 产品小册、用户评价、原地体验、定价、FAQ |
| 使用手册 | `/guide.html` | 可搜索的分章说明，含 v1.1.1 测试版功能与用法 |
| 隐私政策 | `/privacy.html` | App 内设置页与付费墙链接到这里，**文件名不能改** |
| 更新日志 | `/changelog.html` | 常驻版本目录；v1.1.1 标注未更新、测试中 |
| 常见问题 | `/faq.html` | 功能范围、免费与 Pro、同步与数据 |
| 联系方式 | `/contact.html` | 作者与产品联系入口 |

## 技术栈

Vite + React + TypeScript，UI 用 [shadcn/ui](https://ui.shadcn.com)（Base UI 版，`components.json`
里 style 为 `base-nova`），Tailwind v4。多页面入口在 `vite.config.ts` 的 `rollupOptions.input`，
每个 HTML 对应 `src/entries/*.tsx`。

```bash
npm install
npm run dev      # 本地开发
npm run build    # 产物在 dist/
```

- 品牌 token 只改 `src/index.css` 末尾那一段（主色 iOS 蓝、字体），不改组件源码
- 字体自托管（fontsource）：标题 Besley + Noto Serif SC 600，正文 Inter + 苹方 / Noto Sans SC；
  中文字体按 unicode-range 切成 101 片，浏览器只下载用到的片，不依赖 Google Fonts
- 中英切换在 `src/lib/i18n.tsx`，文案就地写 `t("中文", "English")`
- 加组件：`npx shadcn@latest add <name>`

## 部署

`main` 分支 push 后由 `.github/workflows/deploy.yml` 构建并发布到 Pages
（仓库 Settings → Pages → Source 需选 **GitHub Actions**）。

## 素材

`public/assets/screen-<name>.{zh,en}.webp` 为浅色 App 截图，`screen-<name>.{zh,en}.dark.webp` 为对应的深色截图。两种语言、两种外观共 44 张，来自 Coast 1.1.1（1364）的专用模拟器演示账本；网页外观切换时使用对应原图。

`iphone-mockup.png` 来自 Apple Design Resources，保留官方边框与灵动岛；来源见 `public/assets/iphone-mockup-source.txt`。`difference-*-line.png` 为小火人主题插画，深色页面使用专用的 SVG 颜色与线条处理。`icon.png` 取自 App Store 应用图标。

手册与首页详情弹窗共用 `Guide.tsx` 的内容；新增用法后应同步核对首页小册入口、`content/product.ts` 的免费 / Pro 范围和 FAQ。v1.1.1 当前仍标注「未更新 · 测试中」，正式发布时再调整状态。
