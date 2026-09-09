import * as React from "react"
import { Check, Cloud, CalendarDays, EyeOff, FileText, GitBranch, Globe, LayoutGrid, Palette, Repeat, Scale, ScanLine, ShoppingBag, Smartphone, Undo2, Upload, Wand2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Device, DownloadButton, Footer, Header } from "@/components/site/Shell"
import { Sketch, type SketchId } from "@/components/site/Sketches"
import { APP_STORE, MAIL, screen, useLang } from "@/lib/i18n"
import { EASE, REDUCED, ScrollTrigger, SplitText, gsap, useGSAP } from "@/lib/gsap"

/* ---------- 版式原语：整站只用这几样，不用卡片 ---------- */
function Tag({ children }: { children: React.ReactNode }) {
  return <div className="tag">{children}</div>
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-5 max-w-[620px] text-[30px] leading-[1.15] md:text-[42px] ${className}`}>{children}</h2>
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted-foreground">{children}</p>
}
function Section({ id, className = "", children, innerRef }: { id?: string; className?: string; children: React.ReactNode; innerRef?: React.Ref<HTMLElement> }) {
  return <section id={id} ref={innerRef} className={`rule px-6 py-20 md:px-10 md:py-28 ${className}`}>{children}</section>
}

/* ---------- 财务模型：和 App 内 MetricsEngine.forecast 同一套逐月迭代 ---------- */
const NET = 576000, EXP = 10063, INC = 26850, WR = 0.04, RULER = 300 // 25 年标尺
function monthsToFI(n0: number, s: number, annual: number, fi: number): number | null {
  if (n0 >= fi) return 0
  const m = annual / 12
  if (!(s > 0 || (n0 > 0 && m > 0))) return null
  let n = n0
  for (let t = 0; t < 1200; t++) { n = n * (1 + m) + s; if (n >= fi) return t + 1 }
  return null
}
function plan(cut: number, raise: number, extraMonthly = 0) {
  const exp = EXP * (1 - cut) + extraMonthly, inc = INC * (1 + raise), fi = (exp * 12) / WR, s = inc - exp
  return { exp, inc, fi, s, mid: monthsToFI(NET, s, 0.05, fi), opt: monthsToFI(NET, s, 0.07, fi), pes: monthsToFI(NET, s, 0.03, fi) }
}
const BASELINE = plan(0, 0)
const fmt = (n: number) => "¥" + Math.round(n).toLocaleString("en-US")
const fiYear = (m: number | null) => { const now = new Date(); return now.getFullYear() + Math.floor((now.getMonth() + (m ?? 0)) / 12) }

/** 净资产轨迹，固定 N 个采样点（点数固定才能用 GSAP 把两条 path 的 d 平滑过渡） */
function trajectory(p: ReturnType<typeof plan>, N = 60) {
  const months = p.mid ?? RULER, m = 0.05 / 12
  const series = [NET]; let n = NET
  for (let t = 0; t < months; t++) { n = n * (1 + m) + p.s; series.push(n) }
  const pts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const idx = Math.min(series.length - 1, Math.round((i / N) * months))
    pts.push([(i / N) * months, Math.max(0, Math.min(1, (series[idx] - NET) / (p.fi - NET)))])
  }
  return pts
}
/** x 轴：normalized 时终点铺满宽度（首屏装饰）；absolute 时按 25 年标尺（试算器，能看到终点左右移动） */
function pathD(pts: [number, number][], box: { x0: number; w: number; yTop: number; yBot: number }, axis: "normalized" | "absolute") {
  const last = pts[pts.length - 1][0] || 1
  return pts.map(([t, y], i) => {
    const x = box.x0 + box.w * (axis === "normalized" ? t / last : Math.min(1, t / RULER))
    return `${i ? "L" : "M"}${x.toFixed(1)} ${(box.yBot - (box.yBot - box.yTop) * y).toFixed(1)}`
  }).join(" ")
}

/* 滑杆值全页共享：首屏曲线和试算器画的是同一条线 */
const SimContext = React.createContext<{ cut: number; raise: number; setCut: (v: number) => void; setRaise: (v: number) => void }>({ cut: 0, raise: 0, setCut: () => {}, setRaise: () => {} })

/* ---------- Hero：复利曲线（真算的）+ 逐行揭示 ---------- */
const HERO_BOX = { x0: 0, w: 1150, yTop: 120, yBot: 975 }
function Hero() {
  const { t, lang } = useLang()
  const { cut, raise } = React.useContext(SimContext)
  const root = React.useRef<HTMLDivElement>(null)
  const pathRef = React.useRef<SVGPathElement>(null)
  const p = plan(cut / 100, raise / 100)
  const d = pathD(trajectory(p), HERO_BOX, "normalized")
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: REDUCED }, (ctx) => {
      if (ctx.conditions?.reduced) return
      const split = SplitText.create(".hero-h1", { type: "lines", mask: "lines", linesClass: "hl", autoSplit: true })
      const tl = gsap.timeline({ defaults: { ease: EASE } })
      tl.addLabel("curve", 0.3)
      tl.from(split.lines, { yPercent: 120, duration: 1.1, stagger: 0.12 }, 0.1)
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(".hero-phone", { y: 48, opacity: 0, duration: 1.2 }, "-=1")
        .fromTo(".hero-curve", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, ease: "power2.inOut" }, "curve")
        .from(".hero-dot", { scale: 0, duration: 0.45, ease: "back.out(2.5)" }, "curve+=1.75")
        .from(".hero-year", { opacity: 0, x: -6, duration: 0.5 }, "curve+=1.9")
      gsap.to(".hero-phone", { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
      return () => split.revert()
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })
  // 滑杆变了：曲线平滑过渡到新形状。只在 d 真变了才 tween，且不能 overwrite:true——
  // 那会把同一条 path 上的 DrawSVG 绘制动画一起杀掉（StrictMode 下 effect 跑两次就会触发）
  React.useEffect(() => {
    const el = pathRef.current
    if (!el || el.getAttribute("d") === d) return
    gsap.to(el, { attr: { d }, duration: 0.6, ease: "power2.out", overwrite: "auto" })
  }, [d])

  return (
    <section ref={root} className="relative overflow-hidden px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
      {/* 曲线按容器拉伸，圆点不能画在 SVG 里（会被拉成椭圆），用同一套坐标换算成百分比定位：
          SVG 铺满整段，终点 (1150, 120) → left 95.8%，top 12%。终点放得高，是为了在 1280 宽时也露在手机上方 */}
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1200 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} className="hero-curve" d={d} fill="none" stroke="var(--primary)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" opacity=".38" />
      </svg>
      <span className="hero-dot pointer-events-none absolute hidden size-2.5 md:block -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ left: "95.83%", top: "12%" }} aria-hidden="true" />
      <span className="hero-year tag pointer-events-none absolute hidden -translate-y-1/2 md:block font-mono text-primary" style={{ left: "calc(95.83% - 12px)", top: "calc(12% + 18px)", transform: "translateX(-100%)" }} aria-hidden="true">{fiYear(p.mid)}</span>
      <div className="relative mx-auto grid w-full max-w-[1200px] items-end gap-12 md:grid-cols-[minmax(0,1fr)_320px] md:gap-20">
        <div>
          <h1 key={lang} className="hero-h1 max-w-[720px] text-[34px] font-semibold leading-[1.12] sm:text-[44px] md:text-[60px]">
            {lang === "zh" ? <>所有记账都在讲过去，<br />只有它在讲<span className="text-primary">未来</span>。</>
              : <>Every money app talks about the past.<br />This one talks about <span className="text-primary">when you can stop</span>.</>}
          </h1>
          <p className="hero-sub mt-7 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground md:text-lg">
            {t("Coast 把「今天花了多少」和「哪一年可以不上班」连起来。记账是输入，输出是一个日期。",
              "Coast connects what you spent today to the year you can stop working. Tracking is the input. The output is a date.")}
          </p>
          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5">
            <DownloadButton size="lg" full />
            <span className="tag">{t("iOS 18+ · 无账号 · 无服务器", "iOS 18+ · No account · No server")}</span>
          </div>
        </div>
        <div className="hero-phone"><Device src={screen("fire", lang)} alt="Coast FIRE" width={280} /></div>
      </div>
    </section>
  )
}

/* ---------- 功能四屏：桌面端 pin 住整段，滚动切屏 ---------- */
const FEATURES = [
  { img: "fire-pro", zh: ["自由倒计时", "首页最大的数字不是余额，是「还有 8 年 7 个月」。拖动试算滑杆，它实时重算。"], en: ["Freedom countdown", "The biggest number isn't a balance. It's \"9 years, 5 months to go,\" and it moves as you drag the sliders."] },
  { img: "ledger", zh: ["复杂的钱也记得清", "AA、报销、分次退款、组合支付、分期、周期账单，都有自己的位置。"], en: ["The messy stuff, handled", "Splits, reimbursements, partial refunds, installments, recurring bills. Each has a place."] },
  { img: "assets", zh: ["资产看趋势", "现金、投资、不动产、负债分开算。校准一次，之后的流水自动往上叠。"], en: ["Net worth as a trend", "Cash, investments, property, debt. Reconcile once; everything after stacks on top."] },
  { img: "budget", zh: ["预算看节奏", "月中就知道会不会超。建议额度按你真实花过的来，不是拍脑袋。"], en: ["Budget by pace", "Know mid-month if you'll go over. Limits from what you actually spent, not a guess."] },
]
function Features() {
  const { t, lang } = useLang()
  const root = React.useRef<HTMLElement>(null)
  const [active, setActive] = React.useState(0)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: root.current, start: "top 64px", end: () => "+=" + FEATURES.length * 60 + "%", pin: true, scrub: true,
        onUpdate: (self) => setActive(Math.min(FEATURES.length - 1, Math.floor(self.progress * FEATURES.length))),
      })
    })
  }, { scope: root })
  return (
    <Section id="features" innerRef={root} className="md:min-h-[calc(100vh-64px)] md:py-20">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[minmax(0,1fr)_360px] md:gap-20">
        <div>
          <Tag>{t("四件事", "Four things")}</Tag>
          <H2>{t("多数记账停在「这个月花了 3200」。Coast 多答一句。", "Most trackers stop at \"you spent $480 this month.\" Coast answers one more.")}</H2>
          <Lead>{t("这 3200 让自由日往后推了几天。储蓄率、净资产、预算节奏、FI 倒计时，全部从同一本账里算出来。", "How many days that pushed back your freedom date. Savings rate, net worth, budget pace and the FI countdown all come from one ledger.")}</Lead>
          <ol className="mt-10 max-w-[560px]">
            {FEATURES.map((f, i) => {
              const [title, body] = lang === "zh" ? f.zh : f.en
              return (
                <li key={f.img} className="feature-row grid cursor-pointer grid-cols-[20px_1fr] gap-3 py-4" data-active={i === active} onClick={() => setActive(i)}>
                  <span className="dot mt-[9px]" />
                  <div>
                    <h3 className="font-sans text-[18px] font-semibold tracking-normal">{title}</h3>
                    <p className="mt-1.5 max-w-[460px] text-[14.5px] leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="relative mx-auto h-[600px] w-[304px]">
          {FEATURES.map((f, i) => (
            <div key={f.img} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: i === active ? 1 : 0 }} aria-hidden={i !== active}>
              <Device src={screen(f.img, lang)} width={280} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ---------- 试算器：曲线 + 两条滑杆 + 一杯咖啡 ---------- */
const CHART_BOX = { x0: 0, w: 600, yTop: 14, yBot: 140 }
function SimChart({ p }: { p: ReturnType<typeof plan> }) {
  const { t } = useLang()
  const ref = React.useRef<SVGPathElement>(null)
  const dotRef = React.useRef<SVGGElement>(null)
  const dCur = pathD(trajectory(p), CHART_BOX, "absolute")
  const dBase = React.useMemo(() => pathD(trajectory(BASELINE), CHART_BOX, "absolute"), [])
  const endX = CHART_BOX.w * Math.min(1, (p.mid ?? RULER) / RULER)
  React.useEffect(() => {
    if (!ref.current || !dotRef.current || ref.current.getAttribute("d") === dCur) return
    gsap.to(ref.current, { attr: { d: dCur }, duration: 0.5, ease: "power2.out", overwrite: "auto" })
    gsap.to(dotRef.current, { x: endX, duration: 0.5, ease: "power2.out", overwrite: "auto" })
  }, [dCur, endX])
  return (
    <svg className="sim-chart" viewBox="0 0 600 170" preserveAspectRatio="none" aria-hidden="true">
      <line className="axis" x1="0" y1="140" x2="600" y2="140" strokeWidth="1" />
      {[0, 5, 10, 15, 20, 25].map((y) => <text key={y} x={(y / 25) * 600} y="160" textAnchor={y === 0 ? "start" : y === 25 ? "end" : "middle"}>{y}{t("年", "y")}</text>)}
      <path className="base" d={dBase} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path ref={ref} className="cur" d={dCur} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <g ref={dotRef} transform={`translate(${endX} 0)`}><circle cx="0" cy={CHART_BOX.yTop} r="4" fill="var(--primary)" /></g>
    </svg>
  )
}

function Simulator() {
  const { t, lang } = useLang()
  const { cut, raise, setCut, setRaise } = React.useContext(SimContext)
  const p = plan(cut / 100, raise / 100)
  const [shown, setShown] = React.useState(p.mid ?? 0)
  const shownRef = React.useRef(shown)
  React.useEffect(() => { shownRef.current = shown }, [shown])
  React.useEffect(() => {
    const o = { v: shownRef.current }
    const tween = gsap.to(o, { v: p.mid ?? 0, duration: 0.45, ease: "power2.out", onUpdate: () => setShown(Math.round(o.v)) })
    return () => { tween.kill() }
  }, [p.mid])
  const d = p.mid === null ? null : BASELINE.mid! - p.mid
  const pct = (v: number) => <span className="tag ml-2">{v > 0 ? "+" : v < 0 ? "−" : ""}{Math.abs(v)}%</span>
  const unit = (zh: string, en: string) => <span className="mx-1.5 font-sans text-base font-normal text-muted-foreground md:text-lg">{t(zh, en)}</span>

  // 一杯咖啡：每天多花 X → 自由日推迟几天。基于当前滑杆状态算，不是基线
  const [coffee, setCoffee] = React.useState(30)
  const withCoffee = plan(cut / 100, raise / 100, coffee * 30.4)
  const delayDays = p.mid !== null && withCoffee.mid !== null ? Math.round((withCoffee.mid - p.mid) * 30.4) : null

  return (
    <Section id="try">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag>{t("试一试", "Try it")}</Tag>
          <H2>{t("少花多少，自由提前多久？", "Spend less, retire sooner. By how much?")}</H2>
          <Lead>{t("这就是 App 里那两条滑杆。减支双重生效：存得多，要攒的目标也变小；增收只增加储蓄。数字是演示账本的。", "The two sliders from the app. Cutting spending works twice: you save more and the target shrinks. Earning more only adds savings. Numbers are from the demo ledger.")}</Lead>
          <div className="mt-10 max-w-[420px]">
            <div className="tag">{t("顺便算一笔", "One more thing")}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[15px]">
              <span>{t("每天一笔", "A daily")}</span>
              <span className="relative"><span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">¥</span>
                <Input type="number" inputMode="decimal" min={0} max={999} value={coffee} onChange={(e) => setCoffee(Math.max(0, Math.min(999, Number(e.target.value) || 0)))} className="h-9 w-24 pl-6 font-mono" aria-label={t("每天多花", "Daily spend")} /></span>
              <span>{t("的咖啡，", "coffee")}</span>
            </div>
            <div className="mt-3 text-[15px]">
              {delayDays === null ? <span className="text-muted-foreground">{t("当前收支算不出自由日。", "No freedom date at this rate.")}</span>
                : lang === "zh" ? <>自由日推迟 <b className="font-mono text-primary">{delayDays}</b> 天。</>
                : <>pushes your freedom date back <b className="font-mono text-primary">{delayDays}</b> days.</>}
            </div>
          </div>
        </div>
        <div>
          <div className="tag">{t("距离标准 FI", "Time to standard FI")}</div>
          <div className="big-num mt-3 text-[52px] md:text-[68px]">
            {p.mid === null ? <span className="text-[28px]">{t("储蓄率为负", "Negative savings")}</span>
              : <>{Math.floor(shown / 12)}{unit("年", "yr")}{shown % 12}{unit("个月", "mo")}</>}
          </div>
          <div className={`mt-3 min-h-6 text-sm font-medium ${d === null || d < 0 ? "text-destructive" : d > 0 ? "text-success" : "text-muted-foreground"}`}>
            {d === null ? t("当前收支无法达到 FI", "Can't reach FI at this rate")
              : d === 0 ? t("拖动下面的滑杆", "Drag a slider below")
              : lang === "zh" ? `${d > 0 ? "自由日提前" : "自由日推迟"} ${Math.floor(Math.abs(d) / 12)} 年 ${Math.abs(d) % 12} 个月`
              : `Freedom ${d > 0 ? "" : "delayed "}${Math.floor(Math.abs(d) / 12)}y ${Math.abs(d) % 12}m${d > 0 ? " sooner" : ""}`}
          </div>
          {p.mid !== null && <div className="tag mt-1">{t(`预计 ${fiYear(p.opt)}–${fiYear(p.pes)} 年间达成 · 乐观 7% / 悲观 3%`, `Expected ${fiYear(p.opt)}–${fiYear(p.pes)} · 7% optimistic / 3% pessimistic`)}</div>}
          <div className="mt-6"><SimChart p={p} /></div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground"><span><span className="mr-1.5 inline-block h-px w-4 border-t border-dashed border-rule align-middle" />{t("现在的账", "As is")}</span><span><span className="mr-1.5 inline-block h-0.5 w-4 bg-primary align-middle" />{t("调整后", "Adjusted")}</span></div>
          <div className="mt-8 grid gap-7">
            <div>
              <div className="mb-4 flex items-baseline justify-between text-sm"><span className="text-muted-foreground">{t("每月花费", "Monthly spending")}</span><b className="num font-medium">{fmt(p.exp)}{pct(-cut)}</b></div>
              <Slider min={-30} max={30} step={1} value={cut} onValueChange={(v) => setCut(Array.isArray(v) ? v[0] : v)} aria-label="expense" />
            </div>
            <div>
              <div className="mb-4 flex items-baseline justify-between text-sm"><span className="text-muted-foreground">{t("每月收入", "Monthly income")}</span><b className="num font-medium">{fmt(p.inc)}{pct(raise)}</b></div>
              <Slider min={-20} max={30} step={1} value={raise} onValueChange={(v) => setRaise(Array.isArray(v) ? v[0] : v)} aria-label="income" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="tag">{t("净资产 ¥57.6 万 · 年化 5% · 提取率 4%", "Net worth ¥576k · 5% return · 4% withdrawal")}</span>
            <Button variant="ghost" size="xs" onClick={() => { setCut(0); setRaise(0) }}>{t("重置", "Reset")}</Button>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------- 分类：把三笔钱归类 ---------- */
type Cat = { id: string; e: string; zh: string; en: string; income?: boolean; f: string[]; role: [string, string]; d: [string, string] }
const CATS: Cat[] = [
  { id: "fixed", e: "🏠", zh: "固定支出", en: "Fixed", f: ["lean", "std", "cover"], role: ["Lean FI 基数", "Lean FI base"], d: ["房租、保险、订阅。不花不行的那部分，决定你「最低能活」的自由线。", "Rent, insurance, subscriptions. The part you can't skip; it sets your bare-bones freedom line."] },
  { id: "essential", e: "🛒", zh: "必要支出", en: "Essential", f: ["lean", "std", "cover"], role: ["Lean FI 基数", "Lean FI base"], d: ["吃饭、通勤、水电。生活运转的成本，和固定支出一起构成 Lean FI。", "Food, commute, utilities. With fixed costs it forms Lean FI."] },
  { id: "flexible", e: "🎉", zh: "弹性支出", en: "Flexible", f: ["std"], role: ["标准 FI 基数", "Standard FI base"], d: ["外食、购物、旅行。优化的主战场：试算滑杆减的就是这一块。", "Dining out, shopping, travel. Where optimizing happens; the what-if slider cuts here."] },
  { id: "other", e: "📦", zh: "其他支出", en: "Other", f: ["out"], role: ["默认剔除", "Excluded by default"], d: ["买房首付、婚礼这类一次性的大事。不该被年化成「你每年都会这么花」。", "Down payments, weddings. One-offs that shouldn't be annualized."] },
  { id: "salary", e: "💼", zh: "固定收入", en: "Salary", income: true, f: ["rate"], role: ["储蓄率分母", "Savings-rate denominator"], d: ["工资。储蓄率 = 1 − 支出 ÷ 收入，这是倒计时的引擎。", "Wages. Savings rate = 1 − spend ÷ income. The engine of the countdown."] },
  { id: "passive", e: "🌱", zh: "被动收入", en: "Passive", income: true, f: ["cover", "rate"], role: ["覆盖率分子", "Coverage numerator"], d: ["利息、分红、租金。覆盖率到 100%，就是 Lean FIRE 达成。", "Interest, dividends, rent. At 100% coverage, that's Lean FIRE."] },
  { id: "otherIncome", e: "🧧", zh: "其他收入", en: "Other income", income: true, f: ["out"], role: ["默认剔除", "Excluded by default"], d: ["红包、二手、偶然所得。不稳定的钱不该撑起自由日。", "Gifts, resale, windfalls. Unreliable money shouldn't hold up your freedom date."] },
]
const QUIZ = [
  { e: "🏠", zh: "房租", en: "Rent", amt: "¥4,500", ans: "fixed", hintZh: "每个月都得交，金额不变。", hintEn: "Due every month, same amount." },
  { e: "🍲", zh: "周末火锅", en: "Weekend hotpot", amt: "¥260", ans: "flexible", hintZh: "不吃也行，这是最容易省下来的那类。", hintEn: "Optional, and the easiest kind to cut." },
  { e: "📈", zh: "基金分红", en: "Fund dividend", amt: "¥1,200", ans: "passive", hintZh: "钱自己生的钱。", hintEn: "Money your money made." },
]
function Tok({ id, active }: { id: string; active: string }) {
  const { lang } = useLang()
  const c = CATS.find((x) => x.id === id)!
  return <span className="t" data-hot={id === active} data-in={!!c.income}>{lang === "zh" ? c.zh.replace("支出", "") : c.en}</span>
}
function Line({ k, dim, children }: { k: string; dim: boolean; children: React.ReactNode }) {
  return <div className="formula" data-dim={dim}><span className="k">{k}</span>{children}</div>
}
function Categories() {
  const { t, lang } = useLang()
  const [step, setStep] = React.useState(0)                // 0..2 三道题，3 = 完成
  const [picked, setPicked] = React.useState<string | null>(null)
  const [wrong, setWrong] = React.useState<string | null>(null)
  const q = QUIZ[Math.min(step, QUIZ.length - 1)]
  const done = step >= QUIZ.length
  const active = picked ?? (done ? "fixed" : "")
  const c = CATS.find((x) => x.id === active)
  const dim = (id: string) => !c || !c.f.includes(id)
  const choose = (id: string) => {
    if (done || picked) return
    if (id === q.ans) { setPicked(id); setWrong(null) }
    else { setWrong(id); setTimeout(() => setWrong(null), 400) }
  }
  const next = () => { setPicked(null); setWrong(null); setStep((s) => s + 1) }
  const restart = () => { setPicked(null); setWrong(null); setStep(0) }
  return (
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag>{t("分类体系", "Categories")}</Tag>
        <H2>{t("分类不是为了统计好看，是为了算自由。", "Categories aren't for pretty charts. They're for the math.")}</H2>
        <Lead>{t("七个一级分类，每一类在 FIRE 公式里有一个位置。来，给这三笔钱归个类。", "Seven top-level categories, each with a seat in the FIRE formula. Try filing these three.")}</Lead>
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <div>
            {!done ? (
              <>
                <div className="tag">{t(`第 ${step + 1} 笔 / 共 3 笔`, `Entry ${step + 1} of 3`)}</div>
                <div key={step} className="quiz-card mt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3"><span className="text-3xl">{q.e}</span><span className="text-[22px] font-semibold">{lang === "zh" ? q.zh : q.en}</span></div>
                  <span className="font-mono text-xl">{q.amt}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {CATS.map((x) => (
                    <button key={x.id} type="button" className="stamp" data-on={x.id === picked} data-right={x.id === picked} data-wrong={x.id === wrong} onClick={() => choose(x.id)} disabled={!!picked}>
                      <span className="text-base leading-none">{x.e}</span>{lang === "zh" ? x.zh : x.en}
                    </button>
                  ))}
                </div>
                <div className="mt-6 min-h-[72px] text-[15px] leading-relaxed">
                  {picked && c ? (
                    <>
                      <div className="text-success">{t("对。", "Right.")} <b>{lang === "zh" ? c.role[0] : c.role[1]}</b></div>
                      <p className="mt-1 text-muted-foreground">{lang === "zh" ? c.d[0] : c.d[1]}</p>
                      <Button size="sm" className="mt-4" onClick={next}>{step < QUIZ.length - 1 ? t("下一笔", "Next") : t("看结论", "See why")}</Button>
                    </>
                  ) : wrong ? <span className="text-destructive">{t("不是这类。", "Not that one.")} <span className="text-muted-foreground">{lang === "zh" ? q.hintZh : q.hintEn}</span></span>
                  : <span className="text-muted-foreground">{t("点一个分类。", "Pick a category.")}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="tag">{t("三笔都对", "All three filed")}</div>
                <p className="mt-3 text-[17px] leading-relaxed">{t("房租进 Lean FI 的分母，火锅只进标准 FI，分红进覆盖率的分子。分类不是给饼图用的，是在告诉公式：哪些钱决定你最低能活，哪些钱决定你现在这样活，哪些钱在替你上班。", "Rent goes into Lean FI, hotpot only into Standard FI, the dividend into coverage. Categories aren't for a pie chart. They tell the formula which money keeps you alive, which keeps you living like this, and which is already working for you.")}</p>
                <Button variant="outline" size="sm" className="mt-5" onClick={restart}>{t("再来一遍", "Play again")}</Button>
              </>
            )}
          </div>
          <div>
            <Line k="Lean FI" dim={dim("lean")}>= 25 × (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />)</Line>
            <Line k={t("标准 FI", "Standard")} dim={dim("std")}>= 25 × (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />+<Tok id="flexible" active={active} />)</Line>
            <Line k={t("覆盖率", "Coverage")} dim={dim("cover")}>= <Tok id="passive" active={active} /> ÷ (<Tok id="fixed" active={active} />+<Tok id="essential" active={active} />)</Line>
            <Line k={t("储蓄率", "Savings")} dim={dim("rate")}>= 1 − {t("支出", "spend")} ÷ (<Tok id="salary" active={active} />+<Tok id="passive" active={active} />)</Line>
            <Line k={t("不进公式", "Excluded")} dim={dim("out")}><Tok id="other" active={active} /><Tok id="otherIncome" active={active} /></Line>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------- 更多亮点：三栏索引 + 小动画 ---------- */
const ICONS: Record<SketchId, React.ComponentType<{ className?: string }>> = { scan: ScanLine, refund: Undo2, reconcile: Scale, recurring: Repeat, rules: Wand2, review: FileText, repeat: ShoppingBag, scenarios: GitBranch, widgets: LayoutGrid, currency: Globe, themes: Palette, privacy: EyeOff }
const MORE: { id: SketchId; pro?: boolean; zh: [string, string]; en: [string, string] }[] = [
  { id: "scan", zh: ["截图记账", "账单截图丢进来，金额商家在手机上识别，不发网。"], en: ["Receipt scan", "Drop in a screenshot; amount and merchant are read on device."] },
  { id: "refund", zh: ["分次退款", "1000 先退 500 到信用卡，再退 200 到储蓄卡，都记得住。"], en: ["Partial refunds", "¥500 back to the card, ¥200 to savings, later. It keeps track."] },
  { id: "reconcile", zh: ["余额校准", "核对一次真实余额，之后流水自动往上叠。"], en: ["Reconcile once", "Check your real balance once; entries stack on top."] },
  { id: "recurring", zh: ["周期账单识别", "同名、金额 ±15%、出现 3 次以上，才叫周期。"], en: ["Recurring detection", "Same name, ±15% amount, seen 3+ times. Then it counts."] },
  { id: "rules", zh: ["分类规则学习", "改一次分类，问你要不要记住，之后自动归类。"], en: ["Rules that learn", "Change a category once, it offers to remember."] },
  { id: "review", pro: true, zh: ["月度回顾", "输出结论不是数字堆，按重要性把数字翻译成人话。"], en: ["Month in review", "Conclusions, not a pile of numbers, ranked by what matters."] },
  { id: "repeat", pro: true, zh: ["复购洞察", "哪家店去了多少次、花了多少，一年下来是什么数。"], en: ["Repeat-buy insights", "Which places you keep going back to, and what a year of that costs."] },
  { id: "scenarios", pro: true, zh: ["场景模拟", "换城市、涨薪、买房，几条路存下来并排比。"], en: ["Scenarios", "Move cities, get a raise, buy a home. Save paths, compare."] },
  { id: "widgets", zh: ["桌面小组件", "本月还能花、净资产、自由倒计时，不用打开 App。"], en: ["Widgets", "Left to spend, net worth, countdown. No app needed."] },
  { id: "currency", pro: true, zh: ["多币种", "每日汇率自动拉，账户账单报销全程折算。"], en: ["Multi-currency", "Daily rates; accounts, entries and reimbursements all convert."] },
  { id: "themes", pro: true, zh: ["主题与图标", "6 套主题、20 多个 App 图标，分类图标四种来源一键换套。"], en: ["Themes & icons", "6 themes, 20+ app icons, category icons from four sources."] },
  { id: "privacy", zh: ["隐私模式", "一个眼睛开关，全 App 金额一键打码。"], en: ["Privacy mode", "One toggle blurs every amount in the app."] },
]
function More() {
  const { t, lang } = useLang()
  return (
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag>{t("还有这些", "And then some")}</Tag>
        <H2>{t("为一年只用两次的场景，也认真做了。", "Built carefully, even for things you'll do twice a year.")}</H2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MORE.map((m) => {
            const [title, body] = lang === "zh" ? m.zh : m.en
            const Icon = ICONS[m.id]
            return (
              <div key={m.id} data-reveal data-card className="feature-card group">
                <div className="flex h-6 items-center justify-between">
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  {m.pro && <span className="tag rounded-full border border-rule px-2 py-0.5 text-[11px] text-primary">Pro</span>}
                </div>
                <h3 className="mt-5 font-sans text-[17px] font-semibold tracking-normal">{title}</h3>
                <p className="mt-2 min-h-[44px] text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                <div className="stage mt-6">
                  <span className="stage-hint">{t("移上来看看", "Hover to see it")}</span>
                  <div className="stage-body"><Sketch id={m.id} /></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

/* ---------- 截图带：桌面端竖向滚动驱动横向平移 ---------- */
const SHOTS = [
  ["fire-pro", "FIRE 页 · Coast FIRE 线", "FIRE · Coast FIRE line"],
  ["budget", "预算 · 消费节奏", "Budget · pace"],
  ["recurring", "周期账单识别", "Recurring detection"],
  ["ledger", "账单首页", "Ledger"],
  ["templates", "记账模板", "Templates"],
  ["assets", "资产组成", "Asset composition"],
]
function Shots() {
  const { lang, t } = useLang()
  const root = React.useRef<HTMLElement>(null)
  const track = React.useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // 距离按轨道自己的可见宽度算（它在 max-w 1200 的容器里），不能拿整个 section 的宽度
      const dist = () => Math.max(0, track.current!.scrollWidth - track.current!.clientWidth)
      if (dist() <= 0) return
      gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 1, start: "top 64px", end: () => "+=" + dist(), invalidateOnRefresh: true },
      })
    })
  }, { scope: root })
  return (
    <section ref={root} className="rule overflow-hidden py-16 md:h-[calc(100vh-64px)] md:py-0">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col justify-center">
        <div className="tag px-6 md:px-10">{t("界面", "Screens")}</div>
        <div ref={track} className="no-scrollbar mt-8 flex gap-8 overflow-x-auto px-6 pb-4 md:overflow-visible md:px-10">
          {SHOTS.map(([img, zh, en]) => (
            <figure key={img} className="w-[220px] shrink-0">
              <Device src={screen(img, lang)} width={200} />
              <figcaption className="tag mt-4 text-center">{lang === "zh" ? zh : en}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
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
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag>{t("数据", "Your data")}</Tag>
        <H2>{t("没有账号，没有服务器，没有地方能看。", "No account. No server. Nowhere for us to look.")}</H2>
        <Lead>{t("唯一的联网请求是拉汇率，不上传任何东西。", "The only network request fetches exchange rates. Nothing is uploaded.")}</Lead>
        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRIV.map((m) => {
            const [title, body] = lang === "zh" ? m.zh : m.en
            return (
              <div key={title} data-reveal className="py-4">
                <m.icon className="size-4 text-muted-foreground" />
                <h3 className="mt-4 font-sans text-[16px] font-semibold tracking-normal">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            )
          })}
        </div>
        <a href="privacy.html" className="tag mt-8 inline-block text-primary hover:underline">{t("隐私政策 →", "Privacy policy →")}</a>
      </div>
    </Section>
  )
}

/* ---------- 定价：一张会打印出来的收据 ---------- */
const FREE = [["不限量记账，不按笔数收费", "Unlimited entries"], ["全部账户与账本工具", "Every account and ledger tool"], ["CSV / Excel 导入导出", "CSV / Excel import and export"], ["FI 进度与倒计时、总预算、小组件", "FI countdown, total budget, widgets"]]
const PRO = [["达成区间", "Achievement range"], ["收支试算滑杆", "What-if sliders"], ["场景模拟器", "Scenario simulator"], ["Coast FIRE 与 Barista FIRE", "Coast & Barista FIRE"], ["高级 FI 参数", "Advanced FI parameters"], ["完整月报与复购洞察", "Full monthly report, repeat-buy"], ["分类预算与配速图", "Category budgets with pace"], ["多币种记账与每日汇率", "Multi-currency, daily rates"], ["配色主题与 App 图标", "Themes and app icons"]]
function Pricing() {
  const { t, lang } = useLang()
  const pick = (p: string[]) => (lang === "zh" ? p[0] : p[1])
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 收据从出纸口逐行打印出来，最后条形码闪一下
      const rows = gsap.utils.toArray<HTMLElement>(".receipt > *")
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".receipt-slot", start: "top 80%", once: true } })
      tl.from(".receipt", { y: -28, duration: 0.6, ease: "power2.out" })
        .from(rows, { opacity: 0, y: -6, duration: 0.35, stagger: 0.07, ease: "none" }, 0.1)
        .fromTo(".barcode", { opacity: 0.2 }, { opacity: 0.8, duration: 0.15, repeat: 3, yoyo: true }, "-=0.2")
    })
  }, { scope: root })
  return (
    <Section id="pricing" innerRef={root}>
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[minmax(0,1fr)_400px] md:gap-24">
        <div>
          <Tag>{t("定价", "Pricing")}</Tag>
          <H2>{t("记录永久免费。会员解锁的是推演未来。", "Recording is free forever. Pro unlocks the future.")}</H2>
          <div className="mt-10 max-w-[480px]">
            <div className="tag mb-2">{t("免费版包含", "Free includes")}</div>
            {FREE.map((f) => <div key={f[0]} className="flex items-center gap-3 py-2 text-[15px]"><Check className="size-4 text-success" />{pick(f)}</div>)}
          </div>
        </div>
        <div className="receipt-slot">
          <div className="receipt font-mono text-[13px]">
            <div className="row"><span className="tag">Coast Pro</span><span className="tag">{t("会员", "Membership")}</span></div>
            <div className="row mt-6"><span>{t("包年", "Yearly")}</span><span className="text-[15px]">¥30 <span className="text-muted-foreground">/ {t("年", "yr")}</span></span></div>
            <div className="mt-2 text-[12px] text-muted-foreground">{t("前 7 天免费试用，可随时取消", "7-day free trial, cancel anytime")}</div>
            <div className="row mt-3"><span>{t("永久", "Lifetime")}</span><span className="text-[15px]">¥60</span></div>
            <div className="mt-2 text-[12px] text-muted-foreground">{t("一次付费，不转订阅", "One-time, never a subscription")}</div>
            <div className="dash my-5" />
            <div className="tag mb-3">{t("解锁", "Unlocks")}</div>
            {PRO.map((f) => <div key={f[0]} className="row py-[3px]"><span>{pick(f)}</span><span className="text-muted-foreground">✓</span></div>)}
            <div className="dash my-5" />
            <div className="row text-[12px] text-muted-foreground"><span>{t("App 内购买 · Apple 处理支付", "In-app purchase · Apple handles payment")}</span></div>
            <div className="barcode mt-5 h-8 w-full opacity-80" style={{ background: "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 9px, currentColor 9px 12px, transparent 12px 14px)" }} aria-hidden="true" />
            <Button className="mt-6 w-full" nativeButton={false} render={<a href={APP_STORE} rel="noopener" />}>{t("免费下载，在 App 内升级", "Download free, upgrade in app")}</Button>
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
    <Section id="faq">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag>FAQ</Tag>
          <H2>{t("常见问题", "Questions")}</H2>
          <a href={`mailto:${MAIL}`} className="tag mt-5 inline-block text-primary hover:underline">{t("没找到答案？写信给我们 →", "Not answered? Email us →")}</a>
        </div>
        <Accordion>
          {FAQ.map((q, i) => (
            <AccordionItem key={i} value={String(i)} className="border-rule">
              <AccordionTrigger className="py-4 text-[15px] font-medium">{lang === "zh" ? q[0] : q[2]}</AccordionTrigger>
              <AccordionContent className="max-w-[600px] text-[14.5px] leading-relaxed text-muted-foreground">{lang === "zh" ? q[1] : q[3]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}

/* ---------- 收尾：真的倒计时 ---------- */
function Closing() {
  const { t, lang } = useLang()
  const { cut, raise } = React.useContext(SimContext)
  const p = plan(cut / 100, raise / 100)
  // 目标日 = 现在 + 剩余月数，按当前滑杆状态算；秒在跳
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const target = React.useMemo(() => { if (p.mid === null) return null; const d = new Date(); d.setMonth(d.getMonth() + p.mid); d.setHours(9, 0, 0, 0); return d.getTime() }, [p.mid])
  let parts: { v: string; zh: string; en: string }[] = []
  if (target) {
    const diff = Math.max(0, target - now)
    const days = Math.floor(diff / 86400000), y = Math.floor(days / 365), mo = Math.floor((days % 365) / 30.4), dd = Math.floor((days % 365) % 30.4)
    const h = Math.floor((diff % 86400000) / 3600000), mi = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000)
    parts = [{ v: String(y), zh: "年", en: "yrs" }, { v: String(mo), zh: "个月", en: "mos" }, { v: String(dd), zh: "天", en: "days" }, { v: `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}`, zh: "", en: "" }]
  }
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".closing-q", { type: lang === "zh" ? "chars" : "words", autoSplit: true })
      gsap.from(split.chars.length ? split.chars : split.words, { opacity: 0.12, stagger: 0.02, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 30%", scrub: true } })
      return () => split.revert()
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })
  return (
    <section ref={root} className="rule px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="tag">{t("按演示账本，距离自由日", "On the demo ledger, freedom is")}</div>
        {target ? (
          <div className="countdown mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[40px] leading-none md:text-[72px]">
            {parts.map((x, i) => <span key={i}>{x.v}<span className="ml-1.5 font-sans text-base text-muted-foreground md:text-xl">{lang === "zh" ? x.zh : x.en}</span></span>)}
          </div>
        ) : <div className="mt-4 text-[28px] text-muted-foreground">{t("当前收支算不出自由日。", "No freedom date at this rate.")}</div>}
        <p className="closing-q mt-14 max-w-[760px] font-heading text-[22px] leading-[1.35] text-muted-foreground md:text-[30px]">{t("一个 App 让你怎么分类，就是在告诉你它认为钱是什么。", "How an app asks you to categorize money is how it tells you what it thinks money is.")}</p>
        <div className="mt-10"><DownloadButton size="lg" full /></div>
      </div>
    </section>
  )
}

export default function Home() {
  const root = React.useRef<HTMLElement>(null)
  const [cut, setCut] = React.useState(0)
  const [raise, setRaise] = React.useState(0)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: REDUCED }, (ctx) => {
      if (ctx.conditions?.reduced) return
      gsap.set("[data-reveal]", { opacity: 0, y: 18 })
      ScrollTrigger.batch("[data-reveal]", { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: EASE, overwrite: true }) })
    })
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener("load", onLoad)
    document.fonts?.ready.then(onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, { scope: root })
  return (
    <SimContext.Provider value={{ cut, raise, setCut, setRaise }}>
      <Header />
      <main ref={root}>
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
    </SimContext.Provider>
  )
}
