import * as React from "react"
import { Check, Cloud, CalendarDays, Smartphone, Upload } from "lucide-react"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APP_STORE_REVIEWS, APP_STORE_REVIEW_SOURCE, APP_STORE_RATING, APP_STORE_RATING_SOURCE } from "@/content/reviews"
import { captureBook, turnBookPage, type BookSnapshot } from "@/components/site/bookTurn"
import { CoastExplainer } from "@/components/site/CoastExplainer"
import { ConventionalSketch } from "@/components/site/ConventionalSketch"
import { BookletExperience } from "@/components/site/BookletExperience"
import { Device, DownloadButton, Footer, Header } from "@/components/site/Shell"
import { H2, Lead, Section, Tag } from "@/components/site/Blocks"
import { Contact, Faq } from "@/components/site/FaqContact"
import { FREE_FEATURES as FREE, PRO_FEATURES as PRO } from "@/content/product"
import { APP_STORE, screen, useLang } from "@/lib/i18n"
import { EASE, REDUCED, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap"

/* ---------- 财务模型：和 App 内 MetricsEngine.forecast 同一套逐月迭代 ---------- */
function monthsToFI(n0: number, s: number, annual: number, fi: number): number | null {
  if (n0 >= fi) return 0
  const m = annual / 12
  if (!(s > 0 || (n0 > 0 && m > 0))) return null
  let n = n0
  for (let t = 0; t < 1200; t++) { n = n * (1 + m) + s; if (n >= fi) return t + 1 }
  return null
}
/* ---------- 首屏：核心价值、下载与真实产品界面 ---------- */
function Hero() {
  const { t, lang } = useLang()
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    if (matchMedia(REDUCED).matches) return
    gsap.from(".hero-copy, .hero-preview", { y: 20, opacity: 0, duration: 0.8, stagger: 0.12, ease: EASE })
  }, { scope: root })
  return (
    <section ref={root} className="home-hero">
      <div className="hero-surface">
        <div className="hero-copy">
          <h1 className="hero-h1">
            {lang === "zh" ? <>记下今天，<br /><span className="text-primary">看见自由的那一天。</span></>
              : <>Track today.<br /><span className="text-primary">See your freedom day.</span></>}
          </h1>
          <p className="hero-sub">{t("记清收支与资产，看见距离财务自由还有多久。", "Track spending and net worth. See how far you are from financial freedom.")}</p>
          <div className="hero-actions">
            <DownloadButton size="lg" full />
          </div>
          <p className="hero-note">{t("iOS 18+ · 无需注册", "iOS 18+ · No account needed")}</p>
        </div>
        <div className="hero-preview" aria-label={t("Coast 的自由倒计时与日常账单界面", "Coast freedom countdown and everyday ledger")}>
          <div className="hero-phone hero-phone-main"><Device src={screen("fire", lang)} alt={t("Coast 自由倒计时", "Coast freedom countdown")} width={280} priority /></div>
          <div className="hero-phone hero-phone-secondary"><Device src={screen("ledger", lang)} alt={t("Coast 日常账单", "Coast everyday ledger")} width={280} priority /></div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 两本产品小册：功能与差异，按章节原地翻阅 ---------- */
const FEATURES = [
  { img: "fire-pro", zh: ["自由倒计时", "FIRE 页直接显示距离财务自由还有多久。展开试算，调整收入与支出，倒计时实时重算。"], en: ["Freedom countdown", "The FIRE tab shows how long until financial freedom. Expand What-If and adjust income or spending to recalculate the countdown."] },
  { img: "ledger", zh: ["复杂的钱也记得清", "AA、报销、分次退款、组合支付、分期、周期账单，都有自己的位置。"], en: ["The messy stuff, handled", "Splits, reimbursements, partial refunds, installments, recurring bills. Each has a place."] },
  { img: "assets", zh: ["资产看趋势", "现金、投资、不动产、负债分开算。新增资产晴雨表，结合持仓、组合付款与余额校准，看清财务状况。"], en: ["Net worth as a trend", "Cash, investments, property and debt, with asset weather, holdings, combined payments and balance reconciliation."] },
  { img: "budget", zh: ["预算跟着周期走", "月中就知道会不会超。建议额度按你真实花过的来，不是拍脑袋。"], en: ["Budgets for your cycle", "Know mid-month if you'll go over. Limits from what you actually spent, not a guess."] },
  { img: "capture", zh: ["少输入，也能记完整", ""], en: ["Less typing, complete entries", ""] },
  { img: "data", zh: ["从流水里，看见习惯", ""], en: ["Find the habits in your entries", ""] },
  { img: "currency", zh: ["换设备、换币种，都接得上", ""], en: ["Across devices and currencies", ""] },
  { img: "appearance", zh: ["把记账调成顺手的样子", ""], en: ["Make tracking feel like yours", ""] },
]
const DIFFERENCES = [
  { title: ["算出距离自由还有多久", "Calculate the time to freedom"], question: ["这个月花了多少钱？", "How much did I spend this month?"], answer: ["把收支、储蓄率和净资产连起来，看距离财务自由还有多久。调整收入与支出，还能试算自由日的变化。", "Connect spending, savings rate and net worth to a freedom countdown. Adjust income and spending to see how that date changes."], href: "countdown" },
  { title: ["按生活角色分类", "Classify by each expense’s role"], question: ["这笔钱该放在哪个分类？", "Which category does this entry belong in?"], answer: ["同样是餐饮，吃饭归必要，聚餐归弹性。先看清能调整的开销，再把不同角色带入自由计算。", "Meals can be essential while dining out is flexible. See which spending can change, and how each role enters your FI calculation."], href: "diff-categories" },
  { title: ["以真实余额为起点", "Start from a real balance"], question: ["账户余额现在是多少？", "What is my account balance?"], answer: ["核对当下余额，校准差额单独留痕；未来账单不混进当前对账。资产与负债、余额与净资产趋势，都有自己的依据。", "Reconcile the balance now and keep adjustments traceable, without mixing future bills into current reconciliation. Account and net-worth trends have a clear basis."], href: "diff-assets" },
  { title: ["回款后，只算实际支出", "Count spending after money returns"], question: ["退款、报销、AA 该怎么算？", "How do refunds, claims and splits count?"], answer: ["退款、报销和 AA 按净额计算，转账不当成收入或支出。一次性大额可单独设置统计范围，让日常消费与自由计算更贴近真实生活。", "Refunds, reimbursements and splits count at their net amount; transfers are not income or spending. Set the scope of one-off expenses separately for calculations that reflect everyday life."], href: "diff-numbers" },
  { title: ["买之前，看看要工作多久", "See the working time before buying"], question: ["这件东西多少钱？", "How much does it cost?"], answer: ["工资换算成时薪，每笔消费也能看成工时。消费模拟区分一次买入和每月支出，先看自由日的变化；Pro 再加完整分析、冷静期和忍住了 / 入手了清单。", "Translate your recorded pay into an hourly rate and purchases into work hours. Model one-off or recurring purchases and their freedom-date impact; Pro adds full analysis, a cooling-off period and Skipped / Bought lists."], href: "spending" },
  { title: ["把不同的生活，放在一起算", "Compare the lives you could choose"], question: ["按现在的生活继续走？", "Keep following the same path?"], answer: ["换城市、涨薪或买房，用具体的收支和资产变化试算。Pro 可保存方案并排比较，也能探索 Coast FIRE、Barista FIRE 与自己的 FI 参数。", "Model a move, pay rise or home purchase using actual changes to income, spending and assets. Pro saves scenarios for side-by-side comparison and adds Coast FIRE, Barista FIRE and advanced FI assumptions."], href: "scenarios" },
]
const FEATURE_POINTS = [
  {
    "zh": [
      "打开 FIRE 页，就能看到自由倒计时",
      "调整收入与支出，试算自由日的变化",
      "FI 进度、储蓄率与被动收入覆盖率；Pro 含三档区间、Coast / Barista FIRE"
    ],
    "en": [
      "Open FIRE to see your freedom countdown",
      "Adjust income and spending to explore your freedom date",
      "FI progress, savings rate and passive-income coverage; Pro adds ranges and Coast / Barista FIRE"
    ]
  },
  {
    "zh": [
      "AA、报销、分次退款与组合支付，按实际承担的金额看账",
      "独立的账单笔记，给每笔钱留下文字和照片",
      "账单按月、季、半年或年查看，月视图可用日历",
      "贷款、分期、周期账单，到期后在首页核对确认"
    ],
    "en": [
      "See your net cost across splits, claims, partial refunds and combined payments",
      "Keep richer text and photos in separate bill notes",
      "Browse month, quarter, half-year or year; use Calendar in Month view",
      "Review due loan, installment and recurring entries on Home"
    ]
  },
  {
    "zh": [
      "现金、投资、不动产与负债，分开看清",
      "账户内直接记账、转账或还款，大账本按天逐步加载",
      "对账核对当下余额，校准差额单独留痕",
      "免费管理信用卡；Pro 查看持仓、本金与收益"
    ],
    "en": [
      "Separate cash, investments, property and debt",
      "Add entries, transfer or repay from an account; large ledgers load progressively by day",
      "Reconcile the real balance now and keep adjustments traceable",
      "Free credit-card tools; Pro holdings, contributions and returns"
    ]
  },
  {
    "zh": [
      "月、季、年分别设预算，支持单期调整与结转",
      "参考过去三个已结束周期，比较平均、中位数等建议",
      "到期计划先预留，入账后移除对应预留",
      "总预算免费；分类与配速、自定义每月起始日属于 Pro"
    ],
    "en": [
      "Set independent monthly, quarterly and yearly limits, exceptions and carryover",
      "Compare average, median and other suggestions from three completed periods",
      "Reserve due plans, then remove the corresponding reserve when booked",
      "Free total budgets; categories, pace and a custom start day require Pro"
    ]
  },
  {
    "zh": [
      "截图、付款通知与快捷指令，减少手动录入；识别在本机完成",
      "识别待办关闭后保留草稿，打开核对后再保存",
      "模板与周期计划处理重复账单，支持自动入账或手动确认",
      "批量修改、CSV / Excel 导入，以及全部账单导出"
    ],
    "en": [
      "Capture screenshots, payment notifications and Shortcuts on device",
      "Keep captured drafts in the inbox and review them before saving",
      "Templates and recurring plans support automatic booking or manual confirmation",
      "Batch edit, import CSV / Excel and export the full ledger"
    ]
  },
  {
    "zh": [
      "按分类、标签、账户看收支，统计跟随当前记账周期",
      "免费查看月报摘要；Pro 展开完整回顾与自由日变化",
      "Pro 复购洞察，看常去的商户、次数与累计花费"
    ],
    "en": [
      "Explore income and spending by category, tag and account in your accounting cycle",
      "Free monthly summaries; Pro full reviews and freedom-date changes",
      "Pro repeat-buy insights show frequent merchants and cumulative costs"
    ]
  },
  {
    "zh": [
      "iCloud 私有库同步，iPhone、iPad 与 Mac 接着记",
      "每日快照保留最近 10 份，可恢复；导入导出免费",
      "多币种、每日汇率与跨币种实际到账；缺汇率时提醒补充"
    ],
    "en": [
      "Private iCloud sync across iPhone, iPad and Mac",
      "Restore from the latest 10 daily snapshots; free import and export",
      "Multiple currencies, daily rates and actual cross-currency receipts; missing rates flagged"
    ]
  },
  {
    "zh": [
      "桌面和锁屏小组件：预算、资产晴雨表、应急金与记一笔",
      "调整字号、导航和配色，选择 789 / 123 金额键盘",
      "切回 App 保留未完成的金额草稿，历史备注按分类找",
      "导入分类图标、搜索账户图标；Pro 含自定义一级分类与主题"
    ],
    "en": [
      "Home and Lock Screen widgets for budgets, asset weather, runway and quick entry",
      "Adjust text size, tabs and colors; choose a 789 or 123 keypad",
      "Keep unfinished amount drafts and find previous notes by category",
      "Import category icons and find account icons; Pro custom categories and themes"
    ]
  }
]
const BOOK_CHAPTERS = {
  features: { zh: ["自由倒计时", "日常记账", "资产全景", "周期预算", "快捷录入", "数据回顾", "同步与币种", "顺手好用"], en: ["Freedom date", "Daily tracking", "Net worth", "Period budgets", "Quick capture", "Insights", "Sync & currencies", "Make it yours"] },
  difference: { zh: ["自由目标", "分类思路", "真实余额", "净额统计", "消费与时间", "人生方案"], en: ["Your goal", "Categories", "Real balances", "Net spending", "Spending & time", "Life scenarios"] },
}
const COMPARISON_BEFORE = [
  { title: ["知道钱花在哪", "Know where the money went"], body: ["账单、分类与图表，回顾已经发生的收支。", "Entries, categories and charts describe spending that has already happened."] },
  { title: ["按消费用途分类", "Group spending by purchase type"], body: ["餐饮、交通、购物，再细分每一种用途。", "Food, transport and shopping, broken down into finer purchase types."] },
  { title: ["看账户当前有多少钱", "See the current account balance"], body: ["记录余额，或从已有流水累加。", "Record a balance, or add up the entries you have logged."] },
  { title: ["分别记录支出与回款", "Record spending and money returned"], body: ["买外套花 599 元，后来收到退款 200 元。", "Spend ¥599 on a coat, then receive ¥200 back."] },
  { title: ["只看商品的标价", "See the price tag"], body: ["一副耳机 1,200 元，记下支出金额。", "A pair of headphones costs ¥1,200. Record the purchase amount."] },
  { title: ["回顾已经发生的变化", "Review changes after they happen"], body: ["用过去的收支，了解现在的生活。", "Use past entries to understand your life today."] },
]
type BookTopic = "features" | "difference"
function CoastBooklet({ topic, onNextBook }: { topic: BookTopic; onNextBook: () => void }) {
  const { t, lang } = useLang()
  const [page, setPage] = React.useState(0)
  const content = React.useRef<HTMLDivElement>(null)
  const detailTrigger = React.useRef<HTMLButtonElement>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [detailPage, setDetailPage] = React.useState(0)
  const openDetails = () => { setDetailPage(page); setDetailsOpen(true) }
  const cleanupTurn = React.useRef<(() => void) | null>(null)
  const snapshot = React.useRef<BookSnapshot | null>(null)
  const busy = React.useRef(false)
  const pending = React.useRef<{ next: number; animate: boolean } | null>(null)
  const turn = React.useRef({ direction: 1, animate: false })
  const touch = React.useRef<{ x: number; y: number } | null>(null)
  const chapters = BOOK_CHAPTERS[topic][lang]
  const feature = FEATURES[page]
  const difference = DIFFERENCES[page]
  const [title] = lang === "zh" ? feature.zh : feature.en
  const go = (next: number, animate = true) => {
    if (next < 0 || next >= chapters.length || next === page) return
    if (busy.current) { pending.current = { next, animate }; return }
    snapshot.current = animate && !matchMedia(REDUCED).matches && content.current ? captureBook(content.current) : null
    turn.current = { direction: next > page ? 1 : -1, animate }
    setPage(next)
  }
  React.useLayoutEffect(() => {
    const old = snapshot.current
    snapshot.current = null
    if (old && content.current) {
      busy.current = true
      cleanupTurn.current = turnBookPage(content.current, old, turn.current.direction, () => {
        busy.current = false
        const queued = pending.current
        pending.current = null
        if (queued) go(queued.next, queued.animate)
      })
    }
    return () => { cleanupTurn.current?.(); busy.current = false }
  }, [page])
  return (
    <div className="coast-booklet" data-topic={topic} role="region" aria-label={t("Coast 小册子，可用左右方向键翻页", "Coast booklet. Use the left and right arrow keys to turn pages.")} tabIndex={0}
      onKeyDown={event => { if ((event.target as HTMLElement).closest('[role="dialog"]')) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(page + (event.key === "ArrowRight" ? 1 : -1), false) } }}>
      <nav className="booklet-contents" aria-label={t("小册目录", "Booklet contents")}>
        {chapters.map((chapter, i) => <button type="button" key={chapter} aria-current={page === i ? "page" : undefined} onClick={event => go(i, event.detail !== 0)}><span>0{i + 1}</span>{chapter}</button>)}
      </nav>
      <div className="booklet-stage"><div className="booklet-paper" ref={content}
        onTouchStart={event => { touch.current = event.touches.length !== 1 || (event.target as HTMLElement).closest("a,button") ? null : { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
        onTouchCancel={() => { touch.current = null }}
        onTouchEnd={event => { const start = touch.current; touch.current = null; if (!start) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(page + (dx < 0 ? 1 : -1)) }}>
        {topic === "features" ? <>
          <article className="booklet-leaf booklet-copy" aria-labelledby={`book-${topic}-${page}`}>
            <h3 id={`book-${topic}-${page}`}>{title}</h3>
            <ul className="booklet-points">{FEATURE_POINTS[page][lang].map(point => <li key={point}><Check size={15} aria-hidden="true" />{point}</li>)}</ul>
            <button type="button" ref={detailTrigger} className="story-link" aria-haspopup="dialog" onClick={openDetails}>{t("查看功能与用法", "Features & usage")} <ArrowRight size={15} aria-hidden="true" /></button>
            <span className="booklet-folio" aria-hidden="true">{String(page * 2 + 1).padStart(2, "0")}</span>
          </article>
          <div className="booklet-leaf booklet-visual"><Device src={screen(feature.img, lang)} alt={title} width={208} /><span className="booklet-folio" aria-hidden="true">{String(page * 2 + 2).padStart(2, "0")}</span></div>
        </> : <>
          <article className="booklet-leaf comparison-leaf comparison-before">
            <span className="comparison-label">{t("收支记录", "Recording entries")}</span>
            <h3>{t(...COMPARISON_BEFORE[page].title as [string, string])}</h3>
            <ConventionalSketch page={page} />
            <p className="comparison-description">{t(...COMPARISON_BEFORE[page].body as [string, string])}</p>
            <span className="booklet-folio" aria-hidden="true">{String(page * 2 + 1).padStart(2, "0")}</span>
          </article>
          <article className="booklet-leaf booklet-copy booklet-answer comparison-leaf comparison-coast">
            <span className="comparison-label">Coast</span>
            <h3>{t(...difference.title as [string, string])}</h3>
            <img className="comparison-art" src={`${import.meta.env.BASE_URL}assets/${["difference-freedom-line.png", "difference-categories-line.png", "difference-balances-line.png", "difference-net-spending-line.png", "difference-hours-line.png", "difference-scenarios-line.png"][page]}`} alt="" aria-hidden="true" />
            <CoastExplainer page={page} freedomMonths={monthsToFI(500000, 12000, .05, 2400000)} />
            <p className="comparison-description">{t(...difference.answer as [string, string])}</p>
            <button type="button" ref={detailTrigger} className="story-link" aria-haspopup="dialog" onClick={openDetails}>{t("查看详情", "Explore the details")} <ArrowRight size={15} aria-hidden="true" /></button>
            <span className="booklet-folio" aria-hidden="true">{String(page * 2 + 2).padStart(2, "0")}</span>
          </article>
        </>}
      </div></div>
      <div className="booklet-controls">
        <button type="button" className="booklet-prev" disabled={page === 0} onClick={event => go(page - 1, event.detail !== 0)}><ArrowLeft size={17} aria-hidden="true" />{t("上一页", "Previous")}</button>
        <div className="booklet-position" role="status" aria-live="polite" aria-atomic="true"><strong>{String(page + 1).padStart(2, "0")} <span>/ {String(chapters.length).padStart(2, "0")}</span></strong><span className="sr-only">{chapters[page]}</span></div>
        <button type="button" className="booklet-next" onClick={event => page === chapters.length - 1 ? onNextBook() : go(page + 1, event.detail !== 0)}>{page === chapters.length - 1 ? (topic === "features" ? t("读读有何不同", "Read what is different") : t("回看记账功能", "Explore tracking")) : t("下一页", "Next page")}<ArrowRight size={17} aria-hidden="true" /></button>
      </div>
      <BookletExperience topic={topic} page={detailPage} open={detailsOpen} onOpenChange={setDetailsOpen} returnFocus={detailTrigger} forecast={(spend, income, net, annual, withdrawal) => monthsToFI(net, income - spend, annual, spend * 12 / withdrawal)} />
    </div>
  )
}
function Features() {
  const { t } = useLang()
  const [topic, setTopic] = React.useState<BookTopic>("features")
  const openBook = (next: BookTopic) => {
    setTopic(next)
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#features [role="tab"][aria-selected="true"]')?.focus({ preventScroll: true })
      document.querySelector<HTMLElement>('#features .explore-tablist')?.scrollIntoView({ block: "start", behavior: "instant" })
    })
  }
  return (
    <Section id="features" className="home-features">
      <svg width="0" height="0" className="illustration-filter-defs" aria-hidden="true" focusable="false">
        <defs><filter id="coast-dark-illustration" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="-0.37 0 0 0 0.45  -0.58 0 0 0 0.68  -0.86 0 0 0 1  0 0 0 1.8 0" result="nightInk" />
          <feMorphology in="nightInk" operator="dilate" radius="0.4" />
        </filter></defs>
      </svg>
      <div className="mx-auto w-full max-w-[1120px]">
        <h2 className="sr-only">{t("认识 Coast", "Explore Coast")}</h2>
        <Tabs value={topic} onValueChange={value => { setTopic(value as BookTopic); requestAnimationFrame(() => ScrollTrigger.refresh()) }} className="home-explore-tabs">
          <TabsList className="explore-tablist" aria-label={t("选择小册子", "Choose a booklet")}>
            <TabsTrigger value="features">{t("记账功能", "Everyday tracking")}</TabsTrigger>
            <TabsTrigger value="difference">{t("Coast 有何不同", "What makes Coast different")}</TabsTrigger>
          </TabsList>
          <p className="version-status text-center">{t("v1.1.1 · 未更新 · 测试中", "v1.1.1 · Not released · In testing")}</p>
          <TabsContent value="features"><CoastBooklet topic="features" onNextBook={() => openBook("difference")} /></TabsContent>
          <TabsContent value="difference"><CoastBooklet topic="difference" onNextBook={() => openBook("features")} /></TabsContent>
        </Tabs>
      </div>
    </Section>
  )
}

function RatingLaurel({ side }: { side: "left" | "right" }) {
  const leaves = [[36, 86], [27, 73], [21, 58], [20, 43], [24, 28], [30, 16]]
  return (
    <svg className={`rating-laurel rating-laurel-${side}`} viewBox="0 0 56 104" fill="none" aria-hidden="true">
      <path d="M44 98C14 78 12 37 35 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {leaves.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`} fill="currentColor">
        <path d="M0 0C-10-1-17-9-16-18C-7-17-1-9 0 0Z" />
        <path d="M0 0C8-2 13-10 11-18C4-15 0-8 0 0Z" opacity=".75" />
      </g>)}
    </svg>
  )
}

function Reviews() {
  const { t, lang } = useLang()
  return (
    <Section id="reviews" className="home-reviews">
      <div className="mx-auto w-full max-w-[1120px]">
        <h2 className="sr-only">{t("用户口碑", "User reviews")}</h2>
        <a href={APP_STORE_RATING_SOURCE} className="rating-summary" aria-label={t(`App Store 全球评分 ${APP_STORE_RATING.average.toFixed(1)} 分，满分 5 分，共 ${APP_STORE_RATING.count} 个评分`, `Worldwide App Store: ${APP_STORE_RATING.average.toFixed(1)} out of 5, from ${APP_STORE_RATING.count} ratings`)}>
          <RatingLaurel side="left" />
          <div className="rating-content">
            <div className="rating-score"><span>{APP_STORE_RATING.average.toFixed(1)}</span><small>/ 5</small></div>
            <div className="rating-details">
              <span>{t("用户口碑", "User reviews")}</span>
              <div className="review-stars rating-stars" aria-hidden="true">{Array.from({length:5},(_,i)=><Star key={i} size={12} fill={i < Math.round(APP_STORE_RATING.average) ? "currentColor" : "none"} />)}</div>
              <span>{t(`${APP_STORE_RATING.count} 个评分`, `${APP_STORE_RATING.count} ratings`)}</span>
            </div>
          </div>
          <RatingLaurel side="right" />
        </a>
        <div className="review-grid">
          {APP_STORE_REVIEWS.map(review => (
            <figure className="user-review" key={review.id}>
              <div className="review-stars" role="img" aria-label={t(`${review.rating} 星，满分 5 星`, `${review.rating} out of 5 stars`)}>{Array.from({length:review.rating},(_,i)=><Star key={i} aria-hidden="true" size={14} fill="currentColor" />)}</div>
              <blockquote>{lang === "zh" ? review.quote : review.en}</blockquote>
              <figcaption><div className="review-author"><span className="review-name" title={review.author}>{review.author}</span><span className="review-region">{t("· 中国区", "· China")}</span></div><time dateTime={review.date}>{new Date(review.date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US",{year:"numeric",month:"short",day:"numeric",timeZone:"Asia/Shanghai"})}</time></figcaption>
            </figure>
          ))}
        </div>
        <div className="reviews-source"><a href={APP_STORE_REVIEW_SOURCE} className="story-link">{t("在 App Store 阅读完整评价", "Read the full reviews on the App Store")} <span aria-hidden="true">↗</span></a></div>
      </div>
    </Section>
  )
}

/* ---------- 试算器：曲线 + 两条滑杆 + 一杯咖啡 ---------- */
/* ---------- 数据 ---------- */
const PRIV = [
  { icon: Cloud, zh: ["iCloud 私有库同步", "同一 Apple 账户多设备同步，开发者也看不到。"], en: ["Private iCloud sync", "Your devices sync; the developer can't see it."] },
  { icon: CalendarDays, zh: ["每日快照备份", "JSON 存进 iCloud Drive，可从保留的最近 10 份备份恢复。"], en: ["Daily snapshots", "JSON backups in iCloud Drive; restore from the latest 10 kept."] },
  { icon: Upload, zh: ["导入导出不设墙", "CSV / Excel 随时导出，想走就走。"], en: ["Export never paywalled", "CSV / Excel anytime. Leave when you like."] },
  { icon: Smartphone, zh: ["识别在手机上完成", "账单截图不离开手机。"], en: ["On-device recognition", "Receipt images never leave your phone."] },
]
function Privacy() {
  const { t, lang } = useLang()
  return (
    <Section>
      <div className="mx-auto w-full max-w-[1200px]">
        <Tag>{t("数据", "Your data")}</Tag>
        <H2>{t("账本在你的设备和私人 iCloud 中。", "Your ledger stays on device and in private iCloud.")}</H2>
        <Lead>{t("账单不发送给开发者。开启 iCloud 可同步账本；汇率、主动查询的行情和图标，以及购买验证与匿名购买统计会联网。", "Entries are not sent to the developer. Enable iCloud to sync your ledger. Rates, requested price and icon lookups, purchase validation and anonymous purchase statistics use the network.")}</Lead>
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
          <H2>{t("日常记账免费，进阶分析与个性化用 Pro。", "Everyday tracking is free. Pro adds deeper analysis and personalization.")}</H2>
          <div className="mt-10 max-w-[480px]">
            <div className="tag mb-2">{t("免费版包含", "Free includes")}</div>
            {FREE.map((f) => <div key={f[0]} className="flex items-start gap-3 py-2 text-[15px]"><Check className="mt-1 size-4 shrink-0 text-success" />{pick(f)}</div>)}
            <a href={`guide.html?lang=${lang}#pro`} className="mt-5 inline-block text-sm font-medium text-primary">{t("查看完整免费 / Pro 对比 →", "Full Free / Pro comparison →")}</a>
          </div>
        </div>
        <div className="receipt-slot">
          <div className="receipt font-mono text-[13px]">
            <div className="row"><span className="tag">Coast Pro</span><span className="tag">{t("会员", "Membership")}</span></div>
            <div className="row mt-6"><span>{t("包年", "Yearly")}</span><span className="text-[15px]">$4.99 <span className="text-muted-foreground">/ {t("年（约 ¥36）", "yr")}</span></span></div>
            <div className="mt-2 text-[12px] text-muted-foreground">{t("符合条件可试用 7 天；订阅可在 App Store 取消", "7-day trial if eligible; cancel in App Store")}</div>
            <div className="row mt-3"><span>{t("永久", "Lifetime")}</span><span className="text-[15px]">$9.99{lang === "zh" && <span className="text-muted-foreground">（约 ¥71）</span>}</span></div>
            <div className="mt-2 text-[12px] text-muted-foreground">{t("一次付费，不转订阅", "One-time, never a subscription")}</div>
            <div className="dash my-5" />
            <div className="tag mb-3">{t("解锁", "Unlocks")}</div>
            {PRO.map((f) => <div key={f[0]} className="row items-start gap-3 py-[3px]"><span>{pick(f)}</span><span className="text-muted-foreground">✓</span></div>)}
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t("标示美元参考价；各地区价格及试用资格以 App Store 购买页为准。", "USD reference prices; regional prices and trial eligibility are shown in the App Store purchase sheet.")}</p>
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

/* ---------- 收尾：倒计时 + 自由日凭证 + FI 进度标尺 + footer ---------- */
function Closing() {
  const { t } = useLang()
  return <section className="home-closing"><div className="mx-auto max-w-[1120px] px-6 py-20 text-center"><H2 className="mx-auto">{t("每一笔，都是通往自由的一步。", "Every entry is a step toward freedom.")}</H2><div className="mt-8"><DownloadButton size="lg" full /></div><div className="mt-20"><Footer /><p className="review-source-note">{t("用户评价节选自中国区 App Store；全球评分按各地区评分人数加权汇总，更新于 2026 年 11 月 3 日。", "Reviews excerpted from the China App Store; worldwide ratings weighted by storefront rating counts. Updated November 3, 2026.")}</p></div></div></section>
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
      <main ref={root} className="coast-home">
        <Hero />
        <Reviews />
        <Features />
        <Privacy />
        <Pricing />
        <Faq />
        <Contact />
        <Closing />
      </main>
    </>
  )
}
