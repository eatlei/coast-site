import * as React from "react"
import {
  Banknote, BarChart3, Camera, CalendarDays, Cloud, EyeOff, FileText, Gauge, Globe, GitBranch, LayoutGrid,
  Palette, Receipt, Repeat, Scale, ShoppingCart, Smartphone, Split, Timer, Upload, Wand2, Check,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Device, DownloadButton, Footer, Header } from "@/components/site/Shell"
import { APP_STORE, MAIL, asset, useLang } from "@/lib/i18n"

/* ---------- 小工具 ---------- */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-primary">{children}</div>
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`max-w-[560px] text-3xl font-semibold leading-[1.2] md:text-[38px] ${className}`}>{children}</h2>
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground">{children}</p>
}
function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return <section id={id} className={`border-x border-border ${className}`}>{children}</section>
}
function IconTile({ icon: Icon, tone = "primary" }: { icon: React.ComponentType<{ className?: string }>; tone?: "primary" | "success" }) {
  const cls = tone === "success" ? "bg-success/12 text-success" : "bg-primary/12 text-primary"
  return <div className={`grid size-10 place-items-center rounded-xl ${cls}`}><Icon className="size-5" /></div>
}

/* ---------- Hero ---------- */
function Hero() {
  const { t, lang } = useLang()
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-border px-6 pb-16 pt-32 md:px-10 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_420px_at_22%_30%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_70%),radial-gradient(560px_380px_at_78%_70%,color-mix(in_oklch,var(--success)_14%,transparent),transparent_70%)]" />
      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 md:grid-cols-[minmax(0,600px)_minmax(0,420px)] md:justify-between md:gap-16">
        <div>
          <h1 className="max-w-[600px] text-[32px] font-bold leading-[1.18] sm:text-4xl lg:text-[54px]">
            {lang === "zh" ? <>所有记账都在讲过去，<br />只有它在讲<span className="text-primary">未来</span>。</>
              : <>Every money app talks about the past.<br />This one talks about <span className="text-primary">when you can stop</span>.</>}
          </h1>
          <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-muted-foreground">
            {t("Coast 把「今天花了多少」和「哪一年可以不上班」连起来。记账是输入，输出是一个日期。",
              "Coast connects what you spent today to the year you can stop working. Tracking is the input. The output is a date.")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <DownloadButton size="lg" full />
            <span className="text-xs text-muted-foreground">{t("iOS 18+ · 无账号 · 无服务器", "iOS 18+ · No account · No server")}</span>
          </div>
        </div>
        <Device src={asset("screen-fire.webp")} alt="Coast FIRE" />
      </div>
    </section>
  )
}

/* ---------- 功能四格（Tabs 驱动右侧手机截图） ---------- */
const FEATURES = [
  { id: "fire", icon: Timer, img: "screen-fire.webp", zh: ["自由倒计时", "首页最大的数字不是余额，是「还有 8 年 7 个月」。"], en: ["Freedom countdown", "The biggest number isn't a balance. It's \"8 years, 7 months to go.\""] },
  { id: "ledger", icon: Receipt, img: "screen-ledger.webp", zh: ["复杂的钱也记得清", "AA、报销、分次退款、组合支付、分期、周期账单。"], en: ["The messy stuff, handled", "Splits, reimbursements, partial refunds, installments, recurring bills."] },
  { id: "assets", icon: BarChart3, img: "screen-assets.webp", zh: ["资产看趋势", "现金、投资、不动产、负债分开算，校准一次自动往上叠。"], en: ["Net worth as a trend", "Cash, investments, property, debt. Reconcile once, it stacks from there."] },
  { id: "budget", icon: Gauge, img: "screen-budget.webp", zh: ["预算看节奏", "月中就知道会不会超，建议额度按你真实花过的来。"], en: ["Budget by pace", "Know mid-month if you'll go over. Limits from what you actually spent."] },
]
function Features() {
  const { t, lang } = useLang()
  const [active, setActive] = React.useState("fire")
  const cur = FEATURES.find((f) => f.id === active)!
  React.useEffect(() => { FEATURES.forEach((f) => { new Image().src = asset(f.img) }) }, [])
  return (
    <Section id="features" className="pt-20">
      <div className="grid border-b border-border md:min-h-[380px] md:grid-cols-2">
        <div className="px-6 pb-10 md:px-10">
          <Eyebrow>{t("四件事，一个 App", "Four things, one app")}</Eyebrow>
          <H2>{t("多数记账停在「这个月花了 3200」。Coast 多答一句。", "Most trackers stop at \"you spent $480 this month.\" Coast answers one more.")}</H2>
          <Lead>{t("这 3200 让自由日往后推了几天。储蓄率、净资产、预算节奏、FI 倒计时，全部从同一本账里算出来。",
            "How many days that pushed back your freedom date. Savings rate, net worth, budget pace and the FI countdown all come from one ledger.")}</Lead>
        </div>
        <div className="flex h-[400px] items-start justify-center overflow-hidden md:h-[520px]">
          <Device key={cur.img} src={asset(cur.img)} className="animate-in fade-in duration-300" />
        </div>
      </div>
      <Tabs value={active} onValueChange={(v) => setActive(String(v))}>
        <TabsList className="grid h-auto w-full grid-cols-1 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const [title, body] = lang === "zh" ? f.zh : f.en
            return (
              <TabsTrigger key={f.id} value={f.id}
                className={`flex h-auto flex-row items-start gap-4 rounded-none border-0 px-6 py-6 text-left whitespace-normal data-active:bg-muted data-active:shadow-none sm:min-h-[200px] sm:flex-col sm:justify-between sm:gap-6 sm:px-7 ${i < 3 ? "lg:border-r lg:border-border" : ""} ${i % 2 === 0 ? "sm:border-r sm:border-border lg:border-r" : ""} border-b border-border lg:border-b-0`}>
                <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${active === f.id ? "bg-primary text-primary-foreground" : "bg-primary/12 text-primary"}`}><f.icon className="size-5" /></div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </Section>
  )
}

/* ---------- 试算器：和 MetricsEngine.forecast 同一套逐月迭代 ---------- */
const NET = 576000, EXP = 10063, INC = 26850, WR = 0.04
function monthsToFI(n0: number, s: number, annual: number, fi: number): number | null {
  if (n0 >= fi) return 0
  const m = annual / 12
  if (!(s > 0 || (n0 > 0 && m > 0))) return null
  let n = n0
  for (let t = 0; t < 1200; t++) { n = n * (1 + m) + s; if (n >= fi) return t + 1 }
  return null
}
function plan(cut: number, raise: number) {
  const exp = EXP * (1 - cut), inc = INC * (1 + raise), fi = (exp * 12) / WR, s = inc - exp
  return { exp, inc, s, mid: monthsToFI(NET, s, 0.05, fi), opt: monthsToFI(NET, s, 0.07, fi), pes: monthsToFI(NET, s, 0.03, fi) }
}
const BASELINE = plan(0, 0)
const fmt = (n: number) => "¥" + Math.round(n).toLocaleString("en-US")
function Simulator() {
  const { t, lang } = useLang()
  const [cut, setCut] = React.useState(0)
  const [raise, setRaise] = React.useState(0)
  const p = plan(cut / 100, raise / 100)
  const ym = (m: number) => lang === "zh" ? <>{Math.floor(m / 12)}<small className="mx-1 font-sans text-lg text-muted-foreground">年</small>{m % 12}<small className="ml-1 font-sans text-lg text-muted-foreground">个月</small></>
    : <>{Math.floor(m / 12)}<small className="mx-1 font-sans text-lg text-muted-foreground">yr</small>{m % 12}<small className="ml-1 font-sans text-lg text-muted-foreground">mo</small></>
  const d = p.mid === null ? null : BASELINE.mid! - p.mid
  const now = new Date()
  const year = (m: number | null) => now.getFullYear() + Math.floor((now.getMonth() + (m ?? 0)) / 12)
  const pct = (v: number) => <span className="ml-1.5 font-medium text-muted-foreground">{v > 0 ? "+" : v < 0 ? "−" : ""}{Math.abs(v)}%</span>
  return (
    <Section id="try" className="grid md:grid-cols-[5fr_7fr]">
      <div className="px-6 pb-6 pt-16 md:border-r md:border-border md:px-10 md:py-24">
        <Eyebrow>{t("试一试", "Try it")}</Eyebrow>
        <H2>{t("少花多少，自由提前多久？", "Spend less, retire sooner. By how much?")}</H2>
        <Lead>{t("这就是 App 里那两条滑杆。减支双重生效：存得多，要攒的目标也变小；增收只增加储蓄。数字是演示账本的。",
          "These are the two sliders from the app. Cutting spending works twice: you save more and the target shrinks. Earning more only adds savings. Numbers are from the demo ledger.")}</Lead>
      </div>
      <div className="flex items-center px-4 pb-10 md:p-10">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">{t("距离标准 FI", "Time to standard FI")}</div>
            <div className="mt-2 font-heading text-5xl leading-none md:text-6xl">
              {p.mid === null ? <small className="text-2xl">{t("储蓄率为负", "Negative savings")}</small> : ym(p.mid)}
            </div>
            <div className={`mt-3 min-h-6 text-sm font-semibold ${d === null || d < 0 ? "text-destructive" : d > 0 ? "text-success" : "text-muted-foreground"}`}>
              {d === null ? t("当前收支无法达到 FI", "Can't reach FI at this rate")
                : d === 0 ? t("拖动滑杆试试", "Drag a slider")
                : lang === "zh" ? `${d > 0 ? "自由日提前" : "自由日推迟"} ${Math.floor(Math.abs(d) / 12)} 年 ${Math.abs(d) % 12} 个月`
                : `Freedom ${d > 0 ? "" : "delayed "}${Math.floor(Math.abs(d) / 12)}y ${Math.abs(d) % 12}m${d > 0 ? " sooner" : ""}`}
            </div>
            {p.mid !== null && <div className="text-xs text-muted-foreground">{t(`预计 ${year(p.opt)}–${year(p.pes)} 年间达成（乐观 7% / 悲观 3%）`, `Expected ${year(p.opt)}–${year(p.pes)} (7% optimistic / 3% pessimistic)`)}</div>}
            <div className="mt-7 grid gap-6">
              <div>
                <div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{t("每月花费", "Monthly spending")}</span><b className="tabular-nums">{fmt(p.exp)}{pct(-cut)}</b></div>
                <Slider min={-30} max={30} step={1} value={cut} onValueChange={(v) => setCut(Array.isArray(v) ? v[0] : v)} aria-label="expense" />
              </div>
              <div>
                <div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{t("每月收入", "Monthly income")}</span><b className="tabular-nums">{fmt(p.inc)}{pct(raise)}</b></div>
                <Slider min={-20} max={30} step={1} value={raise} onValueChange={(v) => setRaise(Array.isArray(v) ? v[0] : v)} aria-label="income" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{t("净资产 ¥57.6 万 · 年化收益 5% · 提取率 4%", "Net worth ¥576k · 5% return · 4% withdrawal")}</span>
              <Button variant="outline" size="xs" onClick={() => { setCut(0); setRaise(0) }}>{t("重置", "Reset")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}

/* ---------- 分类 = FI 角色 ---------- */
type Cat = { id: string; e: string; zh: string; en: string; income?: boolean; f: string[]; tone: "primary" | "success" | "muted"; role: [string, string]; d: [string, string] }
const CATS: Cat[] = [
  { id: "fixed", e: "🏠", zh: "固定支出", en: "Fixed", f: ["lean", "std", "cover"], tone: "primary", role: ["Lean FI 基数", "Lean FI base"], d: ["房租、保险、订阅。不花不行的那部分，决定你「最低能活」的自由线。", "Rent, insurance, subscriptions. The part you can't skip; it sets your bare-bones freedom line."] },
  { id: "essential", e: "🛒", zh: "必要支出", en: "Essential", f: ["lean", "std", "cover"], tone: "primary", role: ["Lean FI 基数", "Lean FI base"], d: ["吃饭、通勤、水电。生活运转的成本，和固定支出一起构成 Lean FI。", "Food, commute, utilities. With fixed costs it forms Lean FI."] },
  { id: "flexible", e: "🎉", zh: "弹性支出", en: "Flexible", f: ["std"], tone: "primary", role: ["标准 FI 基数", "Standard FI base"], d: ["外食、购物、旅行。优化的主战场：试算滑杆减的就是这一块。", "Dining out, shopping, travel. Where optimizing happens; the what-if slider cuts here."] },
  { id: "other", e: "📦", zh: "其他支出", en: "Other", f: ["out"], tone: "muted", role: ["默认剔除", "Excluded by default"], d: ["买房首付、婚礼这类一次性的大事。不该被年化成「你每年都会这么花」。", "Down payments, weddings. One-offs that shouldn't be annualized."] },
  { id: "salary", e: "💼", zh: "固定收入", en: "Salary", income: true, f: ["rate"], tone: "success", role: ["储蓄率分母", "Savings-rate denominator"], d: ["工资。储蓄率 = 1 − 支出 ÷ 收入，这是倒计时的引擎。", "Wages. Savings rate = 1 − spend ÷ income. The engine of the countdown."] },
  { id: "passive", e: "🌱", zh: "被动收入", en: "Passive", income: true, f: ["cover", "rate"], tone: "success", role: ["覆盖率分子", "Coverage numerator"], d: ["利息、分红、租金。覆盖率到 100%，就是 Lean FIRE 达成。", "Interest, dividends, rent. At 100% coverage, that's Lean FIRE."] },
  { id: "otherIncome", e: "🧧", zh: "其他收入", en: "Other income", income: true, f: ["out"], tone: "muted", role: ["默认剔除", "Excluded by default"], d: ["红包、二手、偶然所得。不稳定的钱不该撑起自由日。", "Gifts, resale, windfalls. Unreliable money shouldn't hold up your freedom date."] },
]
function Tok({ id, active }: { id: string; active: string }) {
  const { lang } = useLang()
  const c = CATS.find((x) => x.id === id)!
  const hot = id === active
  return <span className={`rounded-md px-2 py-0.5 transition-colors ${hot ? (c.income ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground") : "bg-muted"}`}>{lang === "zh" ? c.zh.replace("支出", "") : c.en}</span>
}
function Categories() {
  const { t, lang } = useLang()
  const [active, setActive] = React.useState("fixed")
  const c = CATS.find((x) => x.id === active)!
  const Line = ({ k, id, children }: { k: string; id: string; children: React.ReactNode }) => (
    <div className={`flex flex-wrap items-center gap-2 rounded-xl border border-border px-3.5 py-3 font-heading text-[15px] transition-opacity ${c.f.includes(id) ? "" : "opacity-40"}`}>
      <span className="min-w-[78px] font-sans text-xs font-bold tracking-wider text-muted-foreground">{k}</span>{children}
    </div>
  )
  const toneCls = c.tone === "success" ? "bg-success/12 text-success" : c.tone === "primary" ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
  return (
    <Section className="px-6 py-16 md:px-10 md:py-24">
      <Eyebrow>{t("分类体系", "Categories")}</Eyebrow>
      <H2>{t("分类不是为了统计好看，是为了算自由。", "Categories aren't for pretty charts. They're for the math.")}</H2>
      <Lead>{t("七个一级分类，每一类在 FIRE 公式里有一个位置。点一个看看它算什么。", "Seven top-level categories, each with a seat in the FIRE formula. Tap one to see where it goes.")}</Lead>
      <ToggleGroup value={[active]} onValueChange={(v) => { const n = (v as string[])[0]; if (n) setActive(n) }} variant="outline" spacing={2} className="mt-9 flex-wrap justify-start">
        {CATS.map((x) => (
          <ToggleGroupItem key={x.id} value={x.id} className="h-11 rounded-full px-4 text-[15px] aria-pressed:bg-foreground aria-pressed:text-background data-[state=on]:bg-foreground data-[state=on]:text-background">
            <span className="text-xl leading-none">{x.e}</span>{lang === "zh" ? x.zh : x.en}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Separator className="mt-7" />
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <Badge className={`w-fit border-0 ${toneCls}`}>{lang === "zh" ? c.role[0] : c.role[1]}</Badge>
          <h3 className="text-2xl font-semibold">{c.e} {lang === "zh" ? c.zh : c.en}</h3>
          <p className="max-w-[460px] text-muted-foreground">{lang === "zh" ? c.d[0] : c.d[1]}</p>
        </div>
        <div className="grid content-start gap-2.5">
          <Line k="Lean FI" id="lean">= 25 × (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />)</Line>
          <Line k={t("标准 FI", "Standard")} id="std">= 25 × (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />+<Tok id="flexible" active={active} />)</Line>
          <Line k={t("覆盖率", "Coverage")} id="cover">= <Tok id="passive" active={active} /> ÷ (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />)</Line>
          <Line k={t("储蓄率", "Savings")} id="rate">= 1 − {t("支出", "spend")} ÷ (<Tok id="salary" active={active} />+<Tok id="passive" active={active} />)</Line>
          <Line k={t("不进公式", "Excluded")} id="out"><Tok id="other" active={active} /><Tok id="otherIncome" active={active} /></Line>
        </div>
      </div>
    </Section>
  )
}

/* ---------- 更多亮点 ---------- */
const MORE = [
  { icon: Camera, zh: ["截图记账", "账单截图丢进来，金额商家在手机上识别，不发网。"], en: ["Receipt scan", "Drop in a screenshot; amount and merchant are read on device."] },
  { icon: Split, zh: ["分次退款", "1000 先退 500 到信用卡，再退 200 到储蓄卡，都记得住。"], en: ["Partial refunds", "¥500 back to the card, ¥200 to savings, later. It keeps track."] },
  { icon: Scale, zh: ["余额校准", "核对一次真实余额，之后流水自动往上叠。"], en: ["Reconcile once", "Check your real balance once; entries stack on top."] },
  { icon: Repeat, zh: ["周期账单识别", "同名、金额 ±15%、出现 3 次以上，才叫周期。"], en: ["Recurring detection", "Same name, ±15% amount, seen 3+ times. Then it counts."] },
  { icon: Wand2, zh: ["分类规则学习", "改一次分类，问你要不要记住，之后自动归类。"], en: ["Rules that learn", "Change a category once, it offers to remember."] },
  { icon: FileText, pro: true, zh: ["月度回顾", "输出结论不是数字堆，按重要性把数字翻译成人话。"], en: ["Month in review", "Conclusions, not a pile of numbers, ranked by what matters."] },
  { icon: ShoppingCart, pro: true, zh: ["复购洞察", "哪家店去了多少次、花了多少，一年下来是什么数。"], en: ["Repeat-buy insights", "Which places you keep going back to, and what a year of that costs."] },
  { icon: GitBranch, pro: true, zh: ["场景模拟", "换城市、涨薪、买房，几条路存下来并排比。"], en: ["Scenarios", "Move cities, get a raise, buy a home. Save paths, compare."] },
  { icon: LayoutGrid, zh: ["桌面小组件", "本月还能花、净资产、自由倒计时，不用打开 App。"], en: ["Widgets", "Left to spend, net worth, countdown. No app needed."] },
  { icon: Globe, pro: true, zh: ["多币种", "每日汇率自动拉，账户账单报销全程折算。"], en: ["Multi-currency", "Daily rates; accounts, entries and reimbursements all convert."] },
  { icon: Palette, pro: true, zh: ["主题与图标", "6 套主题、20 多个 App 图标，分类图标四种来源一键换套。"], en: ["Themes & icons", "6 themes, 20+ app icons, category icons from four sources."] },
  { icon: EyeOff, zh: ["隐私模式", "一个眼睛开关，全 App 金额一键打码。"], en: ["Privacy mode", "One toggle blurs every amount in the app."] },
]
function More() {
  const { t, lang } = useLang()
  return (
    <Section className="px-6 pb-6 pt-10 md:px-10">
      <Eyebrow>{t("还有这些", "And then some")}</Eyebrow>
      <H2>{t("为一年只用两次的场景，也认真做了。", "Built carefully, even for things you'll do twice a year.")}</H2>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MORE.map((m) => {
          const [title, body] = lang === "zh" ? m.zh : m.en
          return (
            <Card key={title} size="sm" className="gap-3 transition-transform hover:-translate-y-0.5">
              <CardContent className="flex flex-col gap-3.5">
                <IconTile icon={m.icon} />
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-base font-semibold tracking-normal">{title}{m.pro && <Badge variant="secondary" className="px-1.5 text-[10px] text-primary">PRO</Badge>}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------- 截图横滑带 ---------- */
const SHOTS = [
  ["screen-fire-pro.webp", "FIRE 页 · Coast FIRE 线", "FIRE · Coast FIRE line"],
  ["screen-budget.webp", "预算 · 消费节奏", "Budget · pace"],
  ["screen-recurring.webp", "周期账单识别", "Recurring detection"],
  ["screen-ledger.webp", "账单首页", "Ledger"],
  ["screen-templates.webp", "记账模板", "Templates"],
  ["screen-assets.webp", "资产组成", "Asset composition"],
]
function Shots() {
  const { lang } = useLang()
  return (
    <Section className="overflow-hidden pb-20 pt-4">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-6 md:px-10">
        {SHOTS.map(([img, zh, en]) => (
          <figure key={img} className="w-[224px] shrink-0 snap-start">
            <Device src={asset(img)} width={200} />
            <figcaption className="mt-3 text-center text-xs text-muted-foreground">{lang === "zh" ? zh : en}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

/* ---------- 数据 ---------- */
const PRIV = [
  { icon: Cloud, zh: ["iCloud 私有库同步", "同一 Apple 账户多设备同步，开发者也看不到。"], en: ["Private iCloud sync", "Your devices sync; the developer can't see it."] },
  { icon: CalendarDays, zh: ["每日快照备份", "JSON 存进 iCloud Drive，可恢复到任意一天。"], en: ["Daily snapshots", "JSON into iCloud Drive, restorable to any day."] },
  { icon: Upload, zh: ["导入导出不设墙", "CSV / Excel 随时导出，想走就走。"], en: ["Export never paywalled", "CSV / Excel anytime. Leave when you like."] },
  { icon: Smartphone, zh: ["识别在手机上完成", "账单截图不离开手机。"], en: ["On-device recognition", "Receipt images never leave your phone."] },
]
function Privacy() {
  const { t, lang } = useLang()
  return (
    <Section className="px-6 py-16 md:px-10 md:py-24">
      <Eyebrow>{t("数据", "Your data")}</Eyebrow>
      <H2>{t("没有账号，没有服务器，没有地方能看。", "No account. No server. Nowhere for us to look.")}</H2>
      <Lead>{t("唯一的联网请求是拉汇率，不上传任何东西。", "The only network request fetches exchange rates. Nothing is uploaded.")}</Lead>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRIV.map((m) => {
          const [title, body] = lang === "zh" ? m.zh : m.en
          return (
            <Card key={title} size="sm" className="bg-transparent shadow-none">
              <CardContent className="flex flex-col gap-3.5">
                <IconTile icon={m.icon} tone="success" />
                <div><h3 className="font-sans text-base font-semibold tracking-normal">{title}</h3><p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p></div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <Button variant="link" className="mt-6 px-0" render={<a href="privacy.html" />}>{t("隐私政策 →", "Privacy policy →")}</Button>
    </Section>
  )
}

/* ---------- 定价 ---------- */
const FREE = [["不限量记账，不按笔数收费", "Unlimited entries"], ["全部账户与账本工具", "Every account and ledger tool"], ["CSV / Excel 导入导出", "CSV / Excel import and export"], ["FI 进度与倒计时、总预算、小组件", "FI countdown, total budget, widgets"]]
const PRO = [["达成区间（悲观到乐观）", "Achievement range"], ["收支试算滑杆", "What-if sliders"], ["场景模拟器", "Scenario simulator"], ["Coast FIRE 与 Barista FIRE", "Coast FIRE and Barista FIRE"], ["高级 FI 参数", "Advanced FI parameters"], ["完整月报与复购洞察", "Full monthly report, repeat-buy insights"], ["分类预算与配速图", "Category budgets with pace"], ["多币种记账与每日汇率", "Multi-currency, daily rates"], ["配色主题与 App 图标", "Themes and app icons"]]
function Pricing() {
  const { t, lang } = useLang()
  const pick = (p: string[]) => (lang === "zh" ? p[0] : p[1])
  return (
    <Section id="pricing" className="grid md:grid-cols-[5fr_7fr]">
      <div className="px-6 pb-6 pt-16 md:border-r md:border-border md:px-10 md:py-24">
        <Eyebrow>{t("定价", "Pricing")}</Eyebrow>
        <H2>{t("记录永久免费。会员解锁的是推演未来。", "Recording is free forever. Pro unlocks the future.")}</H2>
        <div className="mt-7">
          <h4 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground">{t("免费版包含", "FREE INCLUDES")}</h4>
          <ul>{FREE.map((f) => <li key={f[0]} className="flex items-center gap-2.5 border-t border-border py-2 text-[15px] text-muted-foreground"><Check className="size-4 text-success" />{pick(f)}</li>)}</ul>
        </div>
      </div>
      <div className="flex items-center p-4 md:p-7">
        <div className="relative grid w-full gap-8 overflow-hidden rounded-2xl bg-foreground p-6 text-background md:grid-cols-2 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_320px_at_90%_0%,rgba(0,122,255,.35),transparent_70%),radial-gradient(420px_280px_at_10%_100%,rgba(52,199,150,.25),transparent_70%)] mix-blend-screen" />
          <div className="relative">
            <div className="text-xs font-bold tracking-wider opacity-60">{t("包年", "YEARLY")}</div>
            <div className="mt-1 font-heading text-[44px] leading-[1.1]">¥30<small className="ml-1 font-sans text-lg opacity-70">{t("/ 年", "/ year")}</small></div>
            <div className="text-[13.5px] opacity-70">{t("前 7 天免费试用，可随时取消", "7-day free trial. Cancel anytime.")}</div>
            <Separator className="my-6 bg-background/15" />
            <div className="text-xs font-bold tracking-wider opacity-60">{t("永久", "LIFETIME")}</div>
            <div className="mt-1 font-heading text-[44px] leading-[1.1]">¥60</div>
            <div className="text-[13.5px] opacity-70">{t("一次付费，不转订阅", "One-time. Never a subscription.")}</div>
            <Button className="mt-6 w-full bg-background text-foreground hover:bg-background/90" render={<a href={APP_STORE} rel="noopener" />}>{t("免费下载，在 App 内升级", "Download free, upgrade in app")}</Button>
          </div>
          <div className="relative">
            <h4 className="mb-3 text-xs font-bold tracking-wider opacity-60">{t("会员解锁", "PRO UNLOCKS")}</h4>
            <ul>{PRO.map((f) => <li key={f[0]} className="flex items-start gap-2.5 py-1 text-[14.5px]"><Check className="mt-1 size-3.5 opacity-80" />{pick(f)}</li>)}</ul>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------- FAQ ---------- */
const FAQ = [
  ["我的数据存在哪里？", "只在你的设备和你自己的 iCloud 私有数据库里。Coast 没有服务器，开发者看不到你的任何数据。", "Where is my data stored?", "Only on your device and in your own iCloud private database. Coast has no servers; the developer cannot see any of your data."],
  ["如何在多台设备间同步？", "登录同一个 Apple 账户并开启 iCloud，数据会自动同步。", "How do I sync across devices?", "Sign in with the same Apple account with iCloud enabled, and your data syncs automatically."],
  ["能导入以前的账单吗？", "可以。支持 CSV / XLSX，UTF-8 和 GB18030 编码自动识别，常见记账 App 导出的文件可以直接导入。账户名会模糊匹配，自动去重，整批可撤销。", "Can I import my old records?", "Yes. CSV / XLSX with automatic UTF-8 and GB18030 detection; exports from most expense apps import directly. Account names are fuzzy-matched, duplicates skipped, and the whole batch can be undone."],
  ["免费版能用多久？", "永久。记账不限量，账户、预算、导入导出和 FI 倒计时都不收费。会员解锁的是达成区间、场景模拟这类「推演未来」的功能。", "How long does the free version last?", "Forever. Unlimited entries, accounts, budgets, import/export and the FI countdown are all free. Pro unlocks projection features like achievement range and scenarios."],
  ["会员是订阅吗？", "两种都有。包年 ¥30，前 7 天免费试用；永久 ¥60 一次买断，不转订阅。订阅可随时在 App Store 账户设置里取消。", "Is Pro a subscription?", "Your choice. Yearly is ¥30 with a 7-day free trial; Lifetime is ¥60 once and never converts to a subscription. Cancel anytime in your App Store settings."],
  ["如何恢复购买？", "在 Coast 会员页面底部点「恢复购买」。续费扣款遇到问题时，请在 App Store 账户里更新支付方式，期间功能不受影响。", "How do I restore purchases?", "Tap \"Restore Purchases\" at the bottom of the Coast Pro page. If a renewal fails, update your payment method in your App Store account; features stay on in the meantime."],
]
function Faq() {
  const { t, lang } = useLang()
  return (
    <Section id="faq" className="grid gap-6 px-6 py-16 md:grid-cols-[5fr_7fr] md:gap-10 md:px-10 md:py-24">
      <div>
        <Eyebrow>FAQ</Eyebrow>
        <H2>{t("常见问题", "Questions")}</H2>
        <p className="mt-4"><a href={`mailto:${MAIL}`} className="text-sm text-primary hover:underline">{t("没找到答案？写信给我们 →", "Not answered? Email us →")}</a></p>
      </div>
      <Accordion className="border-t border-border">
        {FAQ.map((q, i) => (
          <AccordionItem key={i} value={String(i)}>
            <AccordionTrigger className="py-4 text-base font-semibold">{lang === "zh" ? q[0] : q[2]}</AccordionTrigger>
            <AccordionContent className="max-w-[600px] text-[15px] leading-relaxed text-muted-foreground">{lang === "zh" ? q[1] : q[3]}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}

/* ---------- 收尾 ---------- */
function Closing() {
  const { t } = useLang()
  return (
    <Section className="relative grid justify-items-center gap-6 overflow-hidden px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_360px_at_50%_60%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_70%)]" />
      <div className="relative font-heading text-5xl leading-[.6] text-muted-foreground">“</div>
      <p className="relative max-w-[760px] font-heading text-2xl leading-snug text-balance md:text-[34px]">{t("一个 App 让你怎么分类，就是在告诉你它认为钱是什么。", "How an app asks you to categorize money is how it tells you what it thinks money is.")}</p>
      <div className="relative text-sm text-muted-foreground">{t("Coast 的设计原则", "A Coast design principle")}</div>
      <div className="relative"><DownloadButton size="lg" full /></div>
    </Section>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1280px]">
        <Hero />
        <Features />
        <Simulator />
        <Categories />
        <More />
        <Shots />
        <Privacy />
        <Pricing />
        <Faq />
        <Closing />
        <Footer />
      </main>
    </>
  )
}

// 避免未用到的导入被 lint 报错（Apple/Banknote 留给以后的图标扩展）
void Banknote
