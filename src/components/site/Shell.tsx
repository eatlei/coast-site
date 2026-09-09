import * as React from "react"
import { Languages, Menu, Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getTheme, setTheme, type Theme } from "@/lib/theme"
import { APP_STORE, BASE, MAIL, asset, useLang, type Lang } from "@/lib/i18n"

const NAV = [
  { href: `${BASE}#features`, zh: "功能", en: "Features", home: true },
  { href: `${BASE}#try`, zh: "试算", en: "Try it", home: true },
  { href: `${BASE}#pricing`, zh: "定价", en: "Pricing", home: true },
  { href: `${BASE}#faq`, zh: "常见问题", en: "FAQ", home: true },
  { href: `${BASE}guide.html`, zh: "使用手册", en: "Manual" },
  { href: `${BASE}changelog.html`, zh: "更新日志", en: "Changelog" },
]

/** 右上角两个下拉：语言、亮暗模式。都是单选，选中项打勾 */
export function LangMenu() {
  const { lang, setLang, t } = useLang()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Button variant="outline" size="sm" className="gap-1.5 px-2.5 text-xs font-medium" aria-label={t("语言", "Language")} />}>
        <Languages className="size-3.5" />{lang === "zh" ? "中文" : "EN"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
          <DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const THEME_ICON = { auto: Monitor, light: Sun, dark: Moon } as const
export function ThemeMenu() {
  const { t } = useLang()
  const [theme, setThemeState] = React.useState<Theme>(() => (typeof window === "undefined" ? "auto" : getTheme()))
  const pick = (v: Theme) => { setTheme(v); setThemeState(v) }
  const Icon = THEME_ICON[theme]
  const label = { auto: t("自动", "Auto"), light: t("浅色", "Light"), dark: t("深色", "Dark") }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Button variant="outline" size="sm" className="gap-1.5 px-2.5 text-xs font-medium" aria-label={t("外观", "Appearance")} />}>
        <Icon className="size-3.5" />{label[theme]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => pick(v as Theme)}>
          <DropdownMenuRadioItem value="auto"><Monitor className="size-4" />{label.auto}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light"><Sun className="size-4" />{label.light}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon className="size-4" />{label.dark}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.37 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.6zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  )
}

export function DownloadButton({ size = "default", className = "", full = false }: { size?: "sm" | "default" | "lg"; className?: string; full?: boolean }) {
  const { t } = useLang()
  return (
    <Button size={size} className={`${size === "lg" ? "h-11 px-5 text-[15px]" : ""} ${className}`} nativeButton={false} render={<a href={APP_STORE} rel="noopener" />}>
      <AppleLogo />
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
    <header className="pointer-events-none fixed inset-x-0 top-3 z-20 px-3 md:px-6">
      <div className={`glass pointer-events-auto mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 rounded-full pl-5 pr-2.5 md:pl-7 ${scrolled ? "is-scrolled" : ""}`}>
        <a href={BASE} className="mr-auto flex items-center gap-2.5 font-heading text-xl font-semibold">
          <img src={asset("icon.png")} alt="" className="size-7 rounded-md" />Coast
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {NAV.map((n) => <a key={n.href} href={n.href} className="hover:text-foreground">{t(n.zh, n.en)}</a>)}
        </nav>
        <LangMenu />
        <ThemeMenu />
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
    <footer className="rule mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-7 gap-y-3 py-10 text-xs text-muted-foreground">
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
export function DocPage({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <Header />
      <main className={`mx-auto w-full px-6 pb-24 pt-32 md:px-10 ${wide ? "max-w-[1200px]" : "max-w-[760px]"}`}>
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
    <div className={`mx-auto border border-rule bg-card shadow-[0_20px_50px_-30px_rgba(0,0,0,.4)] ${className}`} style={{ width: width + pad * 2, padding: pad, borderRadius: radius }}>
      <img src={src} alt={alt} width={width} className="h-auto border border-rule" style={{ width, borderRadius: radius - pad }} loading="lazy" />
    </div>
  )
}
