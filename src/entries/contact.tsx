import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { LangProvider } from "@/lib/i18n"
import Page from "@/pages/Contact"

const titles = { zh: "Coast · 联系我", en: "Coast · Contact" }
createRoot(document.getElementById("root")!).render(
  <StrictMode><LangProvider titles={titles}><Page /></LangProvider></StrictMode>,
)
