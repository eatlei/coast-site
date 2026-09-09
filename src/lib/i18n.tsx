import * as React from "react"

export type Lang = "zh" | "en"

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (zh: string, en: string) => string }

const LangContext = React.createContext<Ctx>({ lang: "zh", setLang: () => {}, t: (zh) => zh })

const KEY = "coast-lang"

function detect(): Lang {
  const q = new URLSearchParams(location.search).get("lang")
  if (q === "en" || q === "zh") return q
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "en" || saved === "zh") return saved
  } catch {}
  return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en"
}

export function LangProvider({ children, titles }: { children: React.ReactNode; titles: { zh: string; en: string } }) {
  const [lang, setLangState] = React.useState<Lang>(detect)
  const setLang = React.useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch {}
  }, [])
  React.useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en"
    document.title = lang === "zh" ? titles.zh : titles.en
  }, [lang, titles])
  const t = React.useCallback((zh: string, en: string) => (lang === "zh" ? zh : en), [lang])
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return React.useContext(LangContext)
}

/** 站点根路径（GitHub Pages 子目录），静态资源统一走这里 */
export const BASE = import.meta.env.BASE_URL
export const asset = (name: string) => `${BASE}assets/${name}`
/** 手机截图按语言分两套：screen-<name>.zh.webp / .en.webp */
export const screen = (name: string, lang: Lang) => `${BASE}assets/screen-${name}.${lang}.webp`
export const APP_STORE = "https://apps.apple.com/cn/app/id6793885422"
export const MAIL = "hi@thisleon.com"
