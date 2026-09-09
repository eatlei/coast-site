export type Theme = "auto" | "light" | "dark"
const KEY = "coast-theme"

// 各 HTML 入口的 <head> 里有一段同逻辑的内联脚本，首帧就把 .dark 打上，避免闪白；
// 这里只负责运行时切换和读回当前选择。两处的 key 和判定必须一致。
export function getTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    return v === "light" || v === "dark" ? v : "auto"
  } catch { return "auto" }
}

export function applyTheme(t: Theme) {
  const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

export function setTheme(t: Theme) {
  try {
    if (t === "auto") localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, t)
  } catch {}
  applyTheme(t)
}
