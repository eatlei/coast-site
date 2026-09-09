import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { LangProvider } from "@/lib/i18n"
import Page from "@/pages/Changelog"

const titles = { zh: "Coast · 更新日志", en: "Coast · Changelog" }
createRoot(document.getElementById("root")!).render(
  <StrictMode><LangProvider titles={titles}><Page /></LangProvider></StrictMode>,
)
