import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { LangProvider } from "@/lib/i18n"
import Page from "@/pages/Privacy"

const titles = { zh: "Coast · 隐私政策", en: "Coast · Privacy" }
createRoot(document.getElementById("root")!).render(
  <StrictMode><LangProvider titles={titles}><Page /></LangProvider></StrictMode>,
)
