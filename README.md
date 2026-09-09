# coast-site

Coast App 的对外站点，托管在 GitHub Pages：https://eatlei.github.io/coast-site/

| 页面 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | 产品介绍、试算器、定价、FAQ |
| 使用手册 | `/guide.html` | 占位中 |
| 隐私政策 | `/privacy.html` | App 内设置页与付费墙链接到这里，**文件名不能改** |
| 更新日志 | `/changelog.html` | 同上 |

## 技术栈

Vite + React + TypeScript，UI 用 [shadcn/ui](https://ui.shadcn.com)（Base UI 版，`components.json`
里 style 为 `base-nova`），Tailwind v4。多页面入口在 `vite.config.ts` 的 `rollupOptions.input`，
每个 HTML 对应 `src/entries/*.tsx`。

```bash
npm install
npm run dev      # 本地开发
npm run build    # 产物在 dist/
```

- 品牌 token 只改 `src/index.css` 末尾那一段（主色 iOS 蓝、衬线标题字体），不改组件源码
- 中英切换在 `src/lib/i18n.tsx`，文案就地写 `t("中文", "English")`
- 加组件：`npx shadcn@latest add <name>`

## 部署

`main` 分支 push 后由 `.github/workflows/deploy.yml` 构建并发布到 Pages
（仓库 Settings → Pages → Source 需选 **GitHub Actions**）。

## 素材

`public/assets/screen-*.{zh,en}.webp` 是手机截图，按站点语言切换。中文的 `fire / ledger / assets` 从 App Store 营销图
（FIRE 仓库 `app-store-fixed/zh`）裁出，偏移 (140, 500)、尺寸 962×2084；其余中文图和全部英文图来自模拟器
`--seed-demo --pro` 加对应页面参数直接截屏（英文加 `-appLanguage en -AppleLanguages "(en)"`），状态栏用 `simctl status_bar override` 定成 9:41。
`icon.png` 取自 App Store 的应用图标。
