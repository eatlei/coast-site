import * as React from "react"
import { Check, Cloud, CalendarDays, Smartphone, Upload } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Device, DownloadButton, Footer, Header } from "@/components/site/Shell"
import { APP_STORE, MAIL, screen, useLang } from "@/lib/i18n"
import { EASE, REDUCED, ScrollTrigger, SplitText, gsap, useGSAP } from "@/lib/gsap"

/* ---------- 版式原语：整站只用这几样，不用卡片 ---------- */
function Tag({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="tag">{n} <span className="mx-1">/</span> <b>{children}</b></div>
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

/* ---------- Hero：横格纸 + 画出来的复利曲线 + 逐行揭示 ---------- */
function Hero() {
  const { t, lang } = useLang()
  const root = React.useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: REDUCED }, (ctx) => {
      if (ctx.conditions?.reduced) return
      const split = SplitText.create(".hero-h1", { type: "lines", mask: "lines", autoSplit: true })
      const tl = gsap.timeline({ defaults: { ease: EASE } })
      tl.from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.1)
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(".hero-phone", { y: 48, opacity: 0, duration: 1.2 }, "-=1")
        .fromTo(".hero-curve", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, ease: "power2.inOut" }, 0.3)
        .from(".hero-dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2)" }, "-=0.2")
      gsap.to(".hero-phone", { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
      return () => split.revert()
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  return (
    <section ref={root} className="ruled relative overflow-hidden px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <path className="hero-curve" d="M0 585 C 320 575, 640 540, 860 420 S 1120 130, 1200 40" fill="none" stroke="var(--primary)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity=".55" />
      </svg>
      <svg className="pointer-events-none absolute right-6 top-[36%] md:right-10" width="10" height="10" aria-hidden="true"><circle className="hero-dot" cx="5" cy="5" r="4" fill="var(--primary)" /></svg>
      <div className="relative mx-auto grid w-full max-w-[1200px] items-end gap-12 md:grid-cols-[minmax(0,1fr)_320px] md:gap-20">
        <div>
          <div className="tag mb-8"><b>Coast</b> <span className="mx-1">/</span> {t("为自由记账", "Budget & FIRE")}</div>
          <h1 className="hero-h1 max-w-[720px] text-[34px] font-semibold leading-[1.12] sm:text-[44px] md:text-[60px]">
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
  { img: "fire", zh: ["自由倒计时", "首页最大的数字不是余额，是「还有 8 年 7 个月」。拖动试算滑杆，它实时重算。"], en: ["Freedom countdown", "The biggest number isn't a balance. It's \"9 years, 5 months to go,\" and it moves as you drag the sliders."] },
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
          <Tag n="01">{t("四件事", "Four things")}</Tag>
          <H2>{t("多数记账停在「这个月花了 3200」。Coast 多答一句。", "Most trackers stop at \"you spent $480 this month.\" Coast answers one more.")}</H2>
          <Lead>{t("这 3200 让自由日往后推了几天。储蓄率、净资产、预算节奏、FI 倒计时，全部从同一本账里算出来。", "How many days that pushed back your freedom date. Savings rate, net worth, budget pace and the FI countdown all come from one ledger.")}</Lead>
          <ol className="mt-10 max-w-[560px]">
            {FEATURES.map((f, i) => {
              const [title, body] = lang === "zh" ? f.zh : f.en
              return (
                <li key={f.img} className="feature-row rule grid cursor-pointer grid-cols-[44px_1fr] gap-3 py-5" data-active={i === active} onClick={() => setActive(i)}>
                  <span className="tag pt-1.5">{String(i + 1).padStart(2, "0")}</span>
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
  const [shown, setShown] = React.useState(p.mid ?? 0)
  const shownRef = React.useRef(shown)
  shownRef.current = shown
  React.useEffect(() => {
    const o = { v: shownRef.current }
    const tween = gsap.to(o, { v: p.mid ?? 0, duration: 0.45, ease: "power2.out", onUpdate: () => setShown(Math.round(o.v)) })
    return () => { tween.kill() }
  }, [p.mid])
  const d = p.mid === null ? null : BASELINE.mid! - p.mid
  const now = new Date()
  const year = (m: number | null) => now.getFullYear() + Math.floor((now.getMonth() + (m ?? 0)) / 12)
  const pct = (v: number) => <span className="tag ml-2">{v > 0 ? "+" : v < 0 ? "−" : ""}{Math.abs(v)}%</span>
  const unit = (zh: string, en: string) => <span className="mx-1 font-sans text-base text-muted-foreground md:text-lg">{t(zh, en)}</span>
  return (
    <Section id="try">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag n="02">{t("试一试", "Try it")}</Tag>
          <H2>{t("少花多少，自由提前多久？", "Spend less, retire sooner. By how much?")}</H2>
          <Lead>{t("这就是 App 里那两条滑杆。减支双重生效：存得多，要攒的目标也变小；增收只增加储蓄。数字是演示账本的。", "The two sliders from the app. Cutting spending works twice: you save more and the target shrinks. Earning more only adds savings. Numbers are from the demo ledger.")}</Lead>
        </div>
        <div className="rule pt-6 md:border-t-0 md:pt-0">
          <div className="tag">{t("距离标准 FI", "Time to standard FI")}</div>
          <div className="big-num mt-3 text-[56px] md:text-[72px]">
            {p.mid === null ? <span className="text-[28px]">{t("储蓄率为负", "Negative savings")}</span>
              : <>{Math.floor(shown / 12)}{unit("年", "yr")}{shown % 12}{unit("个月", "mo")}</>}
          </div>
          <div className={`mt-3 min-h-6 text-sm font-medium ${d === null || d < 0 ? "text-destructive" : d > 0 ? "text-success" : "text-muted-foreground"}`}>
            {d === null ? t("当前收支无法达到 FI", "Can't reach FI at this rate")
              : d === 0 ? t("拖动下面的滑杆", "Drag a slider below")
              : lang === "zh" ? `${d > 0 ? "自由日提前" : "自由日推迟"} ${Math.floor(Math.abs(d) / 12)} 年 ${Math.abs(d) % 12} 个月`
              : `Freedom ${d > 0 ? "" : "delayed "}${Math.floor(Math.abs(d) / 12)}y ${Math.abs(d) % 12}m${d > 0 ? " sooner" : ""}`}
          </div>
          {p.mid !== null && <div className="tag mt-1">{t(`预计 ${year(p.opt)}–${year(p.pes)} 年间达成 · 乐观 7% / 悲观 3%`, `Expected ${year(p.opt)}–${year(p.pes)} · 7% optimistic / 3% pessimistic`)}</div>}
          <div className="mt-10 grid gap-8">
            <div className="rule pt-5">
              <div className="mb-4 flex items-baseline justify-between text-sm"><span className="text-muted-foreground">{t("每月花费", "Monthly spending")}</span><b className="num font-medium">{fmt(p.exp)}{pct(-cut)}</b></div>
              <Slider min={-30} max={30} step={1} value={cut} onValueChange={(v) => setCut(Array.isArray(v) ? v[0] : v)} aria-label="expense" />
            </div>
            <div className="rule pt-5">
              <div className="mb-4 flex items-baseline justify-between text-sm"><span className="text-muted-foreground">{t("每月收入", "Monthly income")}</span><b className="num font-medium">{fmt(p.inc)}{pct(raise)}</b></div>
              <Slider min={-20} max={30} step={1} value={raise} onValueChange={(v) => setRaise(Array.isArray(v) ? v[0] : v)} aria-label="income" />
            </div>
          </div>
          <div className="rule mt-8 flex flex-wrap items-center justify-between gap-3 pt-4">
            <span className="tag">{t("净资产 ¥57.6 万 · 年化 5% · 提取率 4%", "Net worth ¥576k · 5% return · 4% withdrawal")}</span>
            <Button variant="ghost" size="xs" onClick={() => { setCut(0); setRaise(0) }}>{t("重置", "Reset")}</Button>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------- 分类 = FI 角色 ---------- */
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
  const [active, setActive] = React.useState("fixed")
  const c = CATS.find((x) => x.id === active)!
  const dim = (id: string) => !c.f.includes(id)
  return (
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag n="03">{t("分类体系", "Categories")}</Tag>
        <H2>{t("分类不是为了统计好看，是为了算自由。", "Categories aren't for pretty charts. They're for the math.")}</H2>
        <Lead>{t("七个一级分类，每一类在 FIRE 公式里有一个位置。点一个看看它算什么。", "Seven top-level categories, each with a seat in the FIRE formula. Tap one to see where it goes.")}</Lead>
        <div className="mt-9 flex flex-wrap gap-2">
          {CATS.map((x) => (
            <button key={x.id} type="button" className="stamp" data-on={x.id === active} onClick={() => setActive(x.id)}>
              <span className="text-base leading-none">{x.e}</span>{lang === "zh" ? x.zh : x.en}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <div>
            <div className="tag">{lang === "zh" ? c.role[0] : c.role[1]}</div>
            <h3 className="mt-3 text-[26px]">{c.e} {lang === "zh" ? c.zh : c.en}</h3>
            <p className="mt-3 max-w-[440px] leading-relaxed text-muted-foreground">{lang === "zh" ? c.d[0] : c.d[1]}</p>
          </div>
          <div className="rule border-b border-rule">
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

/* ---------- 更多亮点：三栏索引，不用卡片 ---------- */
const MORE = [
  { zh: ["截图记账", "账单截图丢进来，金额商家在手机上识别，不发网。"], en: ["Receipt scan", "Drop in a screenshot; amount and merchant are read on device."] },
  { zh: ["分次退款", "1000 先退 500 到信用卡，再退 200 到储蓄卡，都记得住。"], en: ["Partial refunds", "¥500 back to the card, ¥200 to savings, later. It keeps track."] },
  { zh: ["余额校准", "核对一次真实余额，之后流水自动往上叠。"], en: ["Reconcile once", "Check your real balance once; entries stack on top."] },
  { zh: ["周期账单识别", "同名、金额 ±15%、出现 3 次以上，才叫周期。"], en: ["Recurring detection", "Same name, ±15% amount, seen 3+ times. Then it counts."] },
  { zh: ["分类规则学习", "改一次分类，问你要不要记住，之后自动归类。"], en: ["Rules that learn", "Change a category once, it offers to remember."] },
  { pro: true, zh: ["月度回顾", "输出结论不是数字堆，按重要性把数字翻译成人话。"], en: ["Month in review", "Conclusions, not a pile of numbers, ranked by what matters."] },
  { pro: true, zh: ["复购洞察", "哪家店去了多少次、花了多少，一年下来是什么数。"], en: ["Repeat-buy insights", "Which places you keep going back to, and what a year of that costs."] },
  { pro: true, zh: ["场景模拟", "换城市、涨薪、买房，几条路存下来并排比。"], en: ["Scenarios", "Move cities, get a raise, buy a home. Save paths, compare."] },
  { zh: ["桌面小组件", "本月还能花、净资产、自由倒计时，不用打开 App。"], en: ["Widgets", "Left to spend, net worth, countdown. No app needed."] },
  { pro: true, zh: ["多币种", "每日汇率自动拉，账户账单报销全程折算。"], en: ["Multi-currency", "Daily rates; accounts, entries and reimbursements all convert."] },
  { pro: true, zh: ["主题与图标", "6 套主题、20 多个 App 图标，分类图标四种来源一键换套。"], en: ["Themes & icons", "6 themes, 20+ app icons, category icons from four sources."] },
  { zh: ["隐私模式", "一个眼睛开关，全 App 金额一键打码。"], en: ["Privacy mode", "One toggle blurs every amount in the app."] },
]
function More() {
  const { t, lang } = useLang()
  return (
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag n="04">{t("还有这些", "And then some")}</Tag>
        <H2>{t("为一年只用两次的场景，也认真做了。", "Built carefully, even for things you'll do twice a year.")}</H2>
        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {MORE.map((m, i) => {
            const [title, body] = lang === "zh" ? m.zh : m.en
            return (
              <div key={title} data-reveal className="rule py-5">
                <div className="flex items-baseline gap-3">
                  <span className="tag">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-sans text-[16px] font-semibold tracking-normal">{title}</h3>
                  {m.pro && <span className="tag text-primary">Pro</span>}
                </div>
                <p className="mt-1.5 pl-[36px] text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>
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
      const dist = () => Math.max(0, track.current!.scrollWidth - root.current!.clientWidth + 80)
      gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 1, start: "top 64px", end: () => "+=" + dist(), invalidateOnRefresh: true },
      })
    })
  }, { scope: root })
  return (
    <section ref={root} className="rule overflow-hidden py-16 md:h-[calc(100vh-64px)] md:py-0">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col justify-center">
        <div className="tag px-6 md:px-10">05 <span className="mx-1">/</span> <b>{t("界面", "Screens")}</b></div>
        <div ref={track} className="no-scrollbar mt-8 flex gap-8 overflow-x-auto px-6 pb-4 md:overflow-visible md:px-10">
          {SHOTS.map(([img, zh, en]) => (
            <figure key={img} className="w-[220px] shrink-0">
              <Device src={screen(img, lang)} width={200} />
              <figcaption className="tag mt-4 text-center normal-case tracking-normal">{lang === "zh" ? zh : en}</figcaption>
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
        <Tag n="06">{t("数据", "Your data")}</Tag>
        <H2>{t("没有账号，没有服务器，没有地方能看。", "No account. No server. Nowhere for us to look.")}</H2>
        <Lead>{t("唯一的联网请求是拉汇率，不上传任何东西。", "The only network request fetches exchange rates. Nothing is uploaded.")}</Lead>
        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRIV.map((m) => {
            const [title, body] = lang === "zh" ? m.zh : m.en
            return (
              <div key={title} data-reveal className="rule py-5">
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

/* ---------- 定价：一张收据 ---------- */
const FREE = [["不限量记账，不按笔数收费", "Unlimited entries"], ["全部账户与账本工具", "Every account and ledger tool"], ["CSV / Excel 导入导出", "CSV / Excel import and export"], ["FI 进度与倒计时、总预算、小组件", "FI countdown, total budget, widgets"]]
const PRO = [["达成区间", "Achievement range"], ["收支试算滑杆", "What-if sliders"], ["场景模拟器", "Scenario simulator"], ["Coast FIRE 与 Barista FIRE", "Coast & Barista FIRE"], ["高级 FI 参数", "Advanced FI parameters"], ["完整月报与复购洞察", "Full monthly report, repeat-buy"], ["分类预算与配速图", "Category budgets with pace"], ["多币种记账与每日汇率", "Multi-currency, daily rates"], ["配色主题与 App 图标", "Themes and app icons"]]
function Pricing() {
  const { t, lang } = useLang()
  const pick = (p: string[]) => (lang === "zh" ? p[0] : p[1])
  return (
    <Section id="pricing">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[minmax(0,1fr)_400px] md:gap-24">
        <div>
          <Tag n="07">{t("定价", "Pricing")}</Tag>
          <H2>{t("记录永久免费。会员解锁的是推演未来。", "Recording is free forever. Pro unlocks the future.")}</H2>
          <div className="mt-10 max-w-[480px]">
            <div className="tag mb-2">{t("免费版包含", "Free includes")}</div>
            {FREE.map((f) => <div key={f[0]} className="rule flex items-center gap-3 py-3 text-[15px]"><Check className="size-4 text-success" />{pick(f)}</div>)}
          </div>
        </div>
        <div className="receipt font-mono text-[13px]">
          <div className="row"><span className="tag">Coast Pro</span><span className="tag">{t("会员", "Membership")}</span></div>
          <div className="mt-6 space-y-3">
            <div className="row"><span>{t("包年", "Yearly")}</span><span className="text-[15px]">¥30 <span className="text-muted-foreground">/ {t("年", "yr")}</span></span></div>
            <div className="text-[12px] text-muted-foreground">{t("前 7 天免费试用，可随时取消", "7-day free trial, cancel anytime")}</div>
            <div className="row"><span>{t("永久", "Lifetime")}</span><span className="text-[15px]">¥60</span></div>
            <div className="text-[12px] text-muted-foreground">{t("一次付费，不转订阅", "One-time, never a subscription")}</div>
          </div>
          <div className="dash my-5" />
          <div className="tag mb-3">{t("解锁", "Unlocks")}</div>
          <ul className="space-y-1.5">{PRO.map((f) => <li key={f[0]} className="row"><span>{pick(f)}</span><span className="text-muted-foreground">✓</span></li>)}</ul>
          <div className="dash my-5" />
          <div className="row text-[12px] text-muted-foreground"><span>{t("App 内购买 · Apple 处理支付", "In-app purchase · Apple handles payment")}</span><span>#0001</span></div>
          <div className="mt-5 h-8 w-full opacity-80" style={{ background: "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 9px, currentColor 9px 12px, transparent 12px 14px)" }} aria-hidden="true" />
          <Button className="mt-6 w-full" nativeButton={false} render={<a href={APP_STORE} rel="noopener" />}>{t("免费下载，在 App 内升级", "Download free, upgrade in app")}</Button>
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
          <Tag n="08">FAQ</Tag>
          <H2>{t("常见问题", "Questions")}</H2>
          <a href={`mailto:${MAIL}`} className="tag mt-5 inline-block text-primary hover:underline">{t("没找到答案？写信给我们 →", "Not answered? Email us →")}</a>
        </div>
        <Accordion className="rule">
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

/* ---------- 收尾：金句随滚动逐字浮现 ---------- */
function Closing() {
  const { t, lang } = useLang()
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
        <div className="tag">09 <span className="mx-1">/</span> <b>{t("设计原则", "Principle")}</b></div>
        <p className="closing-q mt-6 max-w-[900px] font-heading text-[28px] leading-[1.3] md:text-[44px]">{t("一个 App 让你怎么分类，就是在告诉你它认为钱是什么。", "How an app asks you to categorize money is how it tells you what it thinks money is.")}</p>
        <div className="mt-10"><DownloadButton size="lg" full /></div>
      </div>
    </section>
  )
}

export default function Home() {
  const root = React.useRef<HTMLElement>(null)
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
    <>
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
    </>
  )
}
