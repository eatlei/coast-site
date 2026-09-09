import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// 站点挂在 https://eatlei.github.io/coast-site/ 下；四个 HTML 入口的文件名
// 必须保持不变——App 内的设置页和付费墙硬编码了 privacy.html / changelog.html
export default defineConfig({
  base: "/coast-site/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, "index.html"),
        privacy: path.resolve(import.meta.dirname, "privacy.html"),
        changelog: path.resolve(import.meta.dirname, "changelog.html"),
        guide: path.resolve(import.meta.dirname, "guide.html"),
      },
    },
  },
})
