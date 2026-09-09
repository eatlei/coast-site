import * as React from "react"
import { Apple, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { APP_STORE, BASE, MAIL, asset, useLang, type Lang } from "@/lib/i18n"

const NAV = [
  { href: `${BASE}#features`, zh: "功能", en: "Features", home: true },
  { href: `${BASE}#try`, zh: "试算", en: "Try it", home: true },
  { href: `${BASE}#pricing`, zh: "定价", en: "Pricing", home: true },
  { href: `${BASE}#faq`, zh: "常见问题", en: "FAQ", home: true },
  { href: `${BASE}guide.html`, zh: "使用手册", en: "Manual" },
  { href: `${BASE}changelog.html`, zh: "更新日志", en: "Changelog" },
]

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <ToggleGroup
      value={[lang]}
      onValueChange={(v) => { const next = (v as Lang[])[0]; if (next) setLang(next) }}
      variant="outline"
      size="sm"
      aria-label="Language"
    >
      <ToggleGroupItem value="zh" className="px-3 text-xs font-semibold">中文</ToggleGroupItem>
      <ToggleGroupItem value="en" className="px-3 text-xs font-semibold">EN</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function DownloadButton({ size = "default", className = "", full = false }: { size?: "sm" | "default" | "lg"; className?: string; full?: boolean }) {
  const { t } = useLang()
  return (
    <Button size={size} className={`${size === "lg" ? "h-11 px-5 text-[15px]" : ""} ${className}`} render={<a href={APP_STORE} rel="noopener" />}>
      <Apple />
      {full ? t("App Store 免费下载", "Free on the App Store") : t("免费下载", "Download")}
    </Button>
  )
}

export function Header() {
  const { t } = useLang()
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-20 border-b transition-colors ${scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent"}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-5">
        <a href={BASE} className="mr-auto flex items-center gap-2.5 font-heading text-xl font-semibold">
          <img src={asset("icon.png")} alt="" className="size-7 rounded-md" />Coast
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {NAV.map((n) => <a key={n.href} href={n.href} className="hover:text-foreground">{t(n.zh, n.en)}</a>)}
        </nav>
        <LangToggle />
        <DownloadButton size="sm" className="hidden sm:inline-flex" />
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Menu" />}>
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader><SheetTitle className="font-heading">Coast</SheetTitle></SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="rounded-md px-2 py-2.5 text-base hover:bg-muted">{t(n.zh, n.en)}</a>
              ))}
              <Separator className="my-3" />
              <a href={`${BASE}privacy.html`} className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted">{t("隐私政策", "Privacy")}</a>
              <div className="mt-3 px-2"><DownloadButton full className="w-full" /></div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border px-6 py-10 text-xs text-muted-foreground md:px-10">
      <a href={BASE} className="flex items-center gap-2 font-heading text-base text-foreground"><img src={asset("icon.png")} alt="" className="size-6 rounded-md" />Coast</a>
      <span>© 2026 Leon · <a href={`mailto:${MAIL}`} className="hover:text-foreground">{MAIL}</a></span>
      <nav className="flex flex-wrap gap-5 md:ml-auto">
        <a href={`${BASE}guide.html`} className="hover:text-foreground">{t("使用手册", "Manual")}</a>
        <a href={`${BASE}privacy.html`} className="hover:text-foreground">{t("隐私政策", "Privacy")}</a>
        <a href={`${BASE}changelog.html`} className="hover:text-foreground">{t("更新日志", "Changelog")}</a>
        <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" rel="noopener" className="hover:text-foreground">EULA</a>
        <a href={APP_STORE} rel="noopener" className="hover:text-foreground">App Store</a>
      </nav>
    </footer>
  )
}

/** 子页面（隐私 / 日志 / 手册）的统一窄版容器 */
export function DocPage({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[720px] px-6 pb-24 pt-28">
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        <div className="prose-coast mt-10">{children}</div>
      </main>
      <Footer />
    </>
  )
}

export function Device({ src, alt = "", width = 300, className = "" }: { src: string; alt?: string; width?: number; className?: string }) {
  const pad = Math.round(width * 0.04), radius = Math.round(width * 0.173)
  return (
    <div className={`mx-auto border border-border/70 bg-card/60 shadow-[0_30px_60px_-30px_rgba(15,26,46,.35)] ${className}`} style={{ width: width + pad * 2, padding: pad, borderRadius: radius }}>
      <img src={src} alt={alt} width={width} className="h-auto border border-border/70" style={{ width, borderRadius: radius - pad }} loading="lazy" />
    </div>
  )
}
