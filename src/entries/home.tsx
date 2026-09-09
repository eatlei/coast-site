import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { LangProvider } from "@/lib/i18n"
import Page from "@/pages/Home"

const titles = { zh: "Coast · 为自由记账", en: "Coast · Budget & FIRE" }
createRoot(document.getElementById("root")!).render(
  <StrictMode><LangProvider titles={titles}><Page /></LangProvider></StrictMode>,
)
