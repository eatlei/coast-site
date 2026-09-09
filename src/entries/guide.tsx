import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { LangProvider } from "@/lib/i18n"
import Page from "@/pages/Guide"

const titles = { zh: "Coast · 使用手册", en: "Coast · Manual" }
createRoot(document.getElementById("root")!).render(
  <StrictMode><LangProvider titles={titles}><Page /></LangProvider></StrictMode>,
)
