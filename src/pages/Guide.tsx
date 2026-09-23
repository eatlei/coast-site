import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ListTree, MapPin } from "lucide-react"
import { Device, Footer, Header } from "@/components/site/Shell"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MAIL, screen, useLang } from "@/lib/i18n"
import * as F from "@/components/guide/figures"

/**
 * 使用手册：左侧按大类分组、可展开收起的目录，右侧一次只显示一篇（分页，`#slug` 可直接分享）。
 * 思路取自少数派长文《记了 10 年账，我还是决定自己 Vibe Coding 一款记账 App》：
 * 先讲记账的终点（FIRE），再是「概念词典」（一个概念一篇：定义 / 怎么算 / App 里在哪 / 相关概念），
 * 然后是和常见记账 App 的区别、记账方法、各页面功能。
 * 语气是引导式的；能画成图的尽量画（components/guide/figures.tsx），文字只讲「为什么」。
 * 功能名、路径、公式、免费 / Pro 划分都按 FIRE 仓库里的 App 文案、MetricExplainer 和 Entitlement 核对过，
 * App 改了这里跟着改。
 */

type L = [string, string]
type Block =
  | { p: L }
  | { tip: L }
  | { list: L[] }
  | { img: string; cap: L }
  | { fig: React.ComponentType }
  | { def: L }
  | { formula: L }
  | { where: [L, L][] }
  | { related: string[] }
  | { index: true }
  | { cardmap: [L, L, string][] }
/** short / loc 只有概念页有：给「概念索引」那张表用 */
type Page = { slug: string; title: L; lead: L; blocks: Block[]; short?: L; loc?: L }
type Group = { id: string; title: L; pages: Page[] }

const MORE_INFO: L = ["FIRE 页每张卡片标题旁都有一个 ⓘ，点开是这个指标的完整解释：它是什么、为什么重要、怎么改善。", "Every card on the FIRE tab has an ⓘ next to its title — tap it for the full explanation: what it is, why it matters, how to improve it."]

const GROUPS: Group[] = [
  {
    id: "idea",
    title: ["理念", "The idea"],
    pages: [
      {
        slug: "fire",
        title: ["记账的终点：FIRE", "Where tracking leads: FIRE"],
        lead: ["很多人记账记了好几年，最后只剩一句「这个月又花了这么多」。不是记得不够细，是记账缺一个终点。", "Plenty of people track spending for years and end up with one sentence: \"I spent a lot again this month.\" The problem isn't detail. Tracking has no destination."],
        blocks: [
          { p: ["Coast 给的终点是 FIRE：攒到一笔钱，它产生的收益足够覆盖开销，工作就从「必须」变成「可选」。多少钱才够？一年的开销 ÷ 4%，也就是年支出的 25 倍。", "Coast's destination is FIRE: enough savings that the returns cover your spending, so work becomes optional. How much is enough? A year of spending ÷ 4%, or 25× your annual spending."] },
          { fig: F.FiFormula },
          { p: ["这个公式里只有两样东西是你能动的：攒下的钱和花掉的钱。少花一点，既多攒了，要攒的目标也变小了——所以储蓄率对「还有多久」的影响，比大多数人想的要大得多。", "Only two things in that formula are yours to move: what you save and what you spend. Spending less saves more and shrinks the target at the same time — which is why your savings rate matters far more than most people expect."] },
          { fig: F.SavingsRateYears },
          { tip: ["这里出现的每个词——FI 数字、4% 提取率、储蓄率——在「概念词典」里都有单独一篇，讲清楚怎么算、在 App 哪里能看到。", "Every term here — FI number, 4% withdrawal rate, savings rate — has its own page in the Glossary, with how it's calculated and where to find it in the app."] },
          { related: ["c-index", "c-fi-number", "c-savings-rate"] },
        ],
      },
      {
        slug: "fire-types",
        title: ["几条不同的自由线", "Several freedom lines"],
        lead: ["「财务自由」不是一个点，而是几条由近到远的线。越过第一条，你就已经换了一种活法。", "Financial freedom isn't one point but several lines, near to far. Crossing the first already changes how you can live."],
        blocks: [
          { fig: F.FireLadder },
          { p: ["四条线各有一篇详细的解释，点下面的链接直接跳过去。它们在 App 里都在 FIRE 页，各是一张卡片。", "Each line has its own page — follow the links below. In the app, each is a card on the FIRE tab."] },
          { related: ["c-coast", "c-lean", "c-barista", "c-standard"] },
        ],
      },
    ],
  },
  {
    id: "glossary",
    title: ["概念词典", "Glossary"],
    pages: [
      {
        slug: "c-index",
        title: ["概念索引", "Index of terms"],
        lead: ["每个概念一句话，以及它在 App 里的位置。点名字进去看详细的：定义、怎么算、配图和相关概念。", "One line per term, plus where it lives in the app. Tap a name for the full page: definition, formula, a chart and related terms."],
        blocks: [{ index: true }, { tip: MORE_INFO }],
      },
      {
        slug: "c-fire",
        title: ["FIRE", "FIRE"],
        short: ["财务独立、提前退休：资产收益覆盖开销，工作变成可选", "Financial independence, retire early: returns cover spending; work becomes optional"],
        loc: ["FIRE 页", "FIRE tab"],
        lead: ["Financial Independence, Retire Early——财务独立、提前退休。", "Financial Independence, Retire Early."],
        blocks: [
          { def: ["攒到一笔钱，它每年产生的收益足够覆盖你的开销。到那时工作就从「必须」变成「可选」——可以继续做，也可以不做。", "Enough savings that the yearly returns cover your spending. From then on work is optional — you can keep going, or not."] },
          { p: ["「退休」在这里不是躺平，而是选择权：换一份喜欢但钱少的工作、休一年、只做兼职，都算。所以 FIRE 有好几个层级，见「几条不同的自由线」。", "\"Retire\" here means having the choice, not doing nothing: a lower-paid job you love, a year off, part-time only. That's why there are several levels — see Several freedom lines."] },
          { where: [[["FIRE 页", "FIRE tab"], ["整页都在回答「离 FIRE 还有多远」", "The whole tab answers \"how far from FIRE?\""]], [["账单页顶部卡片左滑", "Swipe the top card on Entries"], ["「财富自由目标」，记账时随手看一眼", "Your freedom goal, visible while you log"]]] },
          { related: ["c-fi-number", "c-countdown", "fire-types"] },
        ],
      },
      {
        slug: "c-countdown",
        title: ["自由倒计时", "Freedom countdown"],
        short: ["照现在的收支，还要多久到标准 FI", "How long until Standard FI at your current pace"],
        loc: ["FIRE 页顶部 · 账单页顶部卡片", "Top of FIRE · top card on Entries"],
        lead: ["FIRE 页最大的那个数字：还有几年几个月。", "The biggest number on the FIRE tab: years and months to go."],
        blocks: [
          { def: ["按你现在的净资产、月均储蓄和一个中性的收益假设往后推，净资产涨到标准 FI 数字那天，就是你的自由日。", "Project your net worth forward with your average monthly savings and a neutral return; the day it reaches your Standard FI number is your freedom date."] },
          { formula: ["净资产 × (1 + 中性收益) + 每月储蓄 → 逐月推到 ≥ 标准 FI", "net worth × (1 + neutral return) + monthly savings → month by month until ≥ Standard FI"] },
          { fig: F.WhatIf },
          { where: [[["FIRE 页顶部", "Top of the FIRE tab"], ["倒计时本身，下面一行是悲观到乐观的年份区间（Pro）", "The countdown; below it, the pessimistic-to-optimistic range (Pro)"]], [["FIRE 页 · 试算", "FIRE tab · What-If"], ["拖动每月花费、每月收入，倒计时实时变化", "Drag monthly spending and income; the countdown updates live"]], [["账单页顶部卡片左滑", "Swipe the top card on Entries"], ["记完一笔回来看它动了多少", "See how much it moved after you log"]]] },
          { related: ["c-standard", "c-return", "c-savings-rate"] },
        ],
      },
      {
        slug: "c-fi-number",
        title: ["FI 数字", "FI number"],
        short: ["够你「不上班也能活」的那笔钱：年支出 ÷ 提取率", "The amount that lets you stop working: annual spending ÷ withdrawal rate"],
        loc: ["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"],
        lead: ["要攒到多少才算够？就是这个数。", "How much is enough? This number."],
        blocks: [
          { def: ["年化支出 ÷ 提取率。提取率默认 4%，所以 FI 数字就是年支出的 25 倍。", "Annual spending ÷ withdrawal rate. At the default 4%, it's 25× your annual spending."] },
          { formula: ["FI 数字 = 年化支出 ÷ 提取率", "FI number = annual spending ÷ withdrawal rate"] },
          { fig: F.FiFormula },
          { list: [
            ["年化支出取近 12 个自然月里有账单的月份的平均值 × 12。记账不足 12 个月时按已有月份算，不会拿 0 去凑。", "Annual spending is the average of months with entries over the last 12, × 12. With less than a year of data it uses what you have — no zeros padding it out."],
            ["只算哪些支出，决定了是哪条线：只算固定 + 必要是 Lean FI，算全部（默认不含「其他」）是标准 FI。", "Which spending counts decides the line: fixed + essential only is Lean FI; everything (excluding Other by default) is Standard FI."],
            ["降支出比涨收入更快：4% 提取率下，年支出每少 1 万，FI 数字就少 25 万。", "Cutting spending moves it fastest: at 4%, every ¥10k less a year lowers the number by ¥250k."],
          ] },
          { where: [[["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"], ["右上角「FI 本金」和两条线各自的目标金额", "\"FI principal\" and each line's target"]], [["设置 → FI 参数", "Settings → FI Parameters"], ["有一张「年支出 ÷ 提取率」的公式示意", "Shows the annual spending ÷ withdrawal rate formula"]]] },
          { related: ["c-withdrawal", "c-lean", "c-standard"] },
        ],
      },
      {
        slug: "c-withdrawal",
        title: ["提取率（4% 法则）", "Withdrawal rate (the 4% rule)"],
        short: ["退休后每年从资产里取出多少比例来生活", "The share of your assets you draw each year in retirement"],
        loc: ["设置 → FI 参数", "Settings → FI Parameters"],
        lead: ["FI 数字里那个「÷ 4%」，就是它。", "The \"÷ 4%\" in the FI number."],
        blocks: [
          { def: ["退休后每年从资产中取出多少比例生活。4% 来自对历史市场的研究（常被称为 Trinity 研究）：按这个比例取，30 年的退休期里本金大概率花不完。", "How much of your assets you draw each year once retired. 4% comes from research on historical markets (often called the Trinity study): at that rate, savings very likely last a 30-year retirement."] },
          { fig: F.WithdrawalMultiples },
          { tip: ["打算 40 岁前退休？退休期可能有 50 年，比 30 年长得多。在「设置 → FI 参数」里把提取率调到 3.5% 左右，结果更稳妥（FI 数字会涨约 14%）。", "Planning to stop before 40? Retirement could last 50 years, not 30. Lower the rate to about 3.5% in Settings → FI Parameters for a safer estimate (the FI number rises about 14%)."] },
          { where: [[["设置 → FI 参数", "Settings → FI Parameters"], ["调提取率，旁边有公式示意", "Change the rate; a formula preview sits alongside"]]] },
          { related: ["c-fi-number", "c-return"] },
        ],
      },
      {
        slug: "c-return",
        title: ["年化收益假设", "Return assumption"],
        short: ["对资产未来增长速度的假设，分悲观 / 中性 / 乐观三档", "What you assume your assets grow by: pessimistic, neutral, optimistic"],
        loc: ["设置 → FI 参数", "Settings → FI Parameters"],
        lead: ["倒计时要往后推，就得假设钱每年能长多少。Coast 给了三档。", "Projecting forward means assuming a growth rate. Coast uses three."],
        blocks: [
          { def: ["对净资产未来增长的假设。倒计时用中性档；FIRE 页数字下面那行年份区间，由悲观档和乐观档围成。", "An assumption about how your net worth grows. The countdown uses Neutral; the year range under it spans Pessimistic to Optimistic."] },
          { fig: F.ReturnTiers },
          { p: ["它只是假设，不是承诺。设得太乐观，倒计时会好看但不可信；拿不准时，就参考你实际持有的资产长期大概能拿到多少。", "It's an assumption, not a promise. Too optimistic and the countdown looks great but means little; when unsure, go with what your actual holdings have returned over the long run."] },
          { where: [[["设置 → FI 参数 → 年化收益率三档", "Settings → FI Parameters → three return rates"], ["三档分别可调", "Each tier is adjustable"]], [["FIRE 页倒计时下方", "Under the FIRE countdown"], ["悲观～乐观的达成年份区间（Pro）", "The pessimistic–optimistic range (Pro)"]]] },
          { related: ["c-countdown", "c-coast"] },
        ],
      },
      {
        slug: "c-savings-rate",
        title: ["储蓄率", "Savings rate"],
        short: ["收入里留下来的比例；唯一「这个月就能改」的指标", "The share of income you keep — the one number you can change this month"],
        loc: ["FIRE 页 · 本月储蓄率卡", "FIRE tab · Savings Rate"],
        lead: ["对「还有多久」影响最大的一个数。", "The number that moves \"how long\" the most."],
        blocks: [
          { def: ["（收入 − 支出）÷ 收入。它同时动 FI 的两头：省下的钱进净资产，少花的钱让目标变小。", "(Income − spending) ÷ income. It moves both sides at once: what you save grows net worth, what you don't spend shrinks the target."] },
          { formula: ["储蓄率 = (本月总收入 − 本月总支出) ÷ 本月总收入", "Savings rate = (income − spending) ÷ income"] },
          { fig: F.SavingsRateYears },
          { list: [
            ["转账不算收支；支出按退款和报销之后的净额算。", "Transfers aren't counted; spending is net of refunds and reimbursements."],
            ["「12 月均」是近 12 个月合计收入减合计支出、再除以合计收入，不是 12 个月的储蓄率取平均——年终奖那种大月不会被稀释。", "The 12-month figure is total income minus total spending over total income — not an average of monthly rates — so a bonus month isn't diluted."],
            ["50% 是 FIRE 社区的常用参照，从零开始大约十六七年到 FI。", "50% is the community's common benchmark — roughly 16–17 years to FI from zero."],
          ] },
          { where: [[["FIRE 页 · 本月储蓄率卡", "FIRE tab · Savings Rate"], ["本月的数、12 月均和每月的柱子", "This month, the 12-month figure and monthly bars"]], [["数据页 · 月度回顾", "Data tab · Monthly Review"], ["每月总结里会写这个月的储蓄率", "The monthly summary includes it"]]] },
          { related: ["c-fi-number", "c-countdown", "c-roles"] },
        ],
      },
      {
        slug: "c-lean",
        title: ["Lean FI", "Lean FI"],
        short: ["只算停不下来的开销（固定 + 必要）的 FI 数字", "The FI number counting only spending you can't stop (fixed + essential)"],
        loc: ["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"],
        lead: ["「活下去」的那条线，通常比你想的近。", "The \"I'd be fine\" line — usually closer than you think."],
        blocks: [
          { def: ["只拿固定和必要两类支出算出来的 FI 数字：房租、水电、吃饭、通勤这些停不下来的开销。到了这条线，即使不再工作，基本生活也有保障。", "The FI number using only fixed and essential spending — rent, utilities, meals, commute. Reach it and the basics are covered even without a paycheck."] },
          { formula: ["Lean FI = (固定 + 必要) 年化支出 ÷ 提取率", "Lean FI = (fixed + essential) annual spending ÷ withdrawal rate"] },
          { fig: F.FireLadder },
          { tip: ["把真停不下来的开销记成「弹性」，会让这条线偏低、看起来更近。分类归属直接决定这条线的位置，值得偶尔回头核一遍。", "Logging unavoidable costs as Flexible makes this line look closer than it is. Category roles set its position, so check them now and then."] },
          { where: [[["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"], ["「Lean FI」那一行：目标金额和进度百分比", "The Lean FI row: target and progress"]]] },
          { related: ["c-standard", "c-roles", "c-passive"] },
        ],
      },
      {
        slug: "c-standard",
        title: ["标准 FI", "Standard FI"],
        short: ["按现在的生活方式算全部开销的 FI 数字", "The FI number for your current lifestyle, all spending included"],
        loc: ["FIRE 页 · FI 进度卡 · 倒计时", "FIRE tab · FI Progress · countdown"],
        lead: ["「照现在这样活」的那条线，也是倒计时的终点。", "The \"live like I do now\" line — and where the countdown ends."],
        blocks: [
          { def: ["用全部支出算出来的 FI 数字；「其他」这类一次性大额默认不算（在 FI 参数里可以打开）。它和 Lean FI 之间的差额，就是你现在这种生活方式的价钱。", "The FI number from all your spending; one-off Other spending is excluded by default (you can include it in FI Parameters). The gap between it and Lean FI is the price of your lifestyle."] },
          { formula: ["标准 FI = 全部年化支出（默认不含「其他」）÷ 提取率", "Standard FI = all annual spending (excluding Other by default) ÷ withdrawal rate"] },
          { where: [[["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"], ["「标准 FI」那一行", "The Standard FI row"]], [["FIRE 页顶部倒计时", "The FIRE countdown"], ["倒计时算的就是到这条线的时间", "The countdown measures time to this line"]]] },
          { related: ["c-lean", "c-countdown", "c-coast"] },
        ],
      },
      {
        slug: "c-coast",
        title: ["Coast FIRE", "Coast FIRE"],
        short: ["不再存一分钱、靠复利也能在退休时达到标准 FI 的那个数", "The amount that compounds into Standard FI by retirement with no more saving"],
        loc: ["FIRE 页 · Coast FIRE 线卡（Pro）", "FIRE tab · Coast FIRE line (Pro)"],
        lead: ["App 的名字就来自它：越过这条线，就可以「滑行」到退休。", "The app is named after it: past this line, you can coast to retirement."],
        blocks: [
          { def: ["已有的资产光靠复利增长，到你设定的退休那年正好长到标准 FI。越过它，就不必再为退休额外存钱，工作只要覆盖当期开销就行。", "What your assets need to be today to compound into Standard FI by your chosen retirement year. Past it, you no longer need to save for retirement — work only has to cover today's spending."] },
          { formula: ["Coast 线 = 标准 FI ÷ (1 + 年化收益)^距退休年数", "Coast line = Standard FI ÷ (1 + return)^years to retirement"] },
          { fig: F.CoastCurve },
          { tip: ["在卡片上动一动「距目标退休」的年数：晚退两年，这条线能降不少——时间是它最大的杠杆。卡片里的进度条是净资产对这条线的比值，不是对标准 FI 的。", "Nudge Until Target Retirement on the card: two more years lowers the line a lot — time is its biggest lever. The card's bar is net worth against this line, not against Standard FI."] },
          { where: [[["FIRE 页 · Coast FIRE 线卡", "FIRE tab · Coast FIRE line"], ["线的金额、进度，以及「距目标退休」的加减按钮（Pro）", "The line, your progress and the Until Target Retirement stepper (Pro)"]]] },
          { related: ["c-standard", "c-return", "c-barista"] },
        ],
      },
      {
        slug: "c-barista",
        title: ["Barista FIRE", "Barista FIRE"],
        short: ["有一份兼职托底时，还需要多少资产", "How much you need if a part-time job covers some spending"],
        loc: ["FIRE 页 · Barista FIRE 目标卡（Pro）", "FIRE tab · Barista FIRE Goal (Pro)"],
        lead: ["半退休：不当全职上班族，最少要攒到多少？", "Semi-retirement: how much do you need to stop working full-time?"],
        blocks: [
          { def: ["一份愿意长期做的兼职把开销托住一部分，资产只需要覆盖剩下那截。兼职收入能全覆盖支出时，所需资产就是 0。", "A part-time job you'd keep covers part of your spending, so assets only cover the rest. If it covers everything, you need nothing more."] },
          { formula: ["Barista 目标 = (年化支出 − 兼职年收入) ÷ 提取率", "Barista goal = (annual spending − part-time income) ÷ withdrawal rate"] },
          { fig: F.BaristaBars },
          { tip: ["填一个现实的兼职收入——你真愿意干十年的那种，别拿理想值骗自己。", "Enter a realistic part-time income — one you'd actually keep for ten years."] },
          { where: [[["FIRE 页 · Barista FIRE 目标卡", "FIRE tab · Barista FIRE Goal"], ["输入兼职月收入，目标金额和进度跟着变（Pro）", "Enter part-time income; the target and progress update (Pro)"]]] },
          { related: ["c-coast", "c-standard"] },
        ],
      },
      {
        slug: "c-passive",
        title: ["被动收入覆盖率", "Passive income coverage"],
        short: ["被动收入能覆盖多少停不下来的开销", "How much of your unavoidable spending passive income already covers"],
        loc: ["FIRE 页 · 被动收入覆盖率卡", "FIRE tab · Passive Income Coverage"],
        lead: ["唯一一个「已经发生」的自由证据：钱不靠你上班也在进来。", "The one piece of freedom that's already real: money arriving without a paycheck."],
        blocks: [
          { def: ["近 12 个月的被动收入（股息、利息、租金、分红）÷ 近 12 个月的固定 + 必要支出。到 100%，就是不上班也付得起停不下来的开销，也就是 Lean FIRE。", "Passive income over the last 12 months (dividends, interest, rent) ÷ fixed + essential spending over the same period. At 100%, the unavoidable costs are covered without a paycheck — that's Lean FIRE."] },
          { formula: ["覆盖率 = 近 12 月被动收入 ÷ 近 12 月（固定 + 必要）支出", "Coverage = 12-month passive income ÷ 12-month (fixed + essential) spending"] },
          { fig: F.PassiveGauge },
          { tip: ["先把已有的收益如实记下来：股息留在券商账户里不记，这个数会一直是 0，而资产其实早就在生息了。", "Record the returns you already get: dividends left unrecorded in a brokerage account keep this at 0 even though your assets are earning."] },
          { where: [[["FIRE 页 · 被动收入覆盖率卡", "FIRE tab · Passive Income Coverage"], ["百分比、历史曲线和还差多少生息资产", "The percentage, its history and how much income-producing assets you still need"]]] },
          { related: ["c-lean", "c-roles"] },
        ],
      },
      {
        slug: "c-net-worth",
        title: ["净资产与校准", "Net worth and calibration"],
        short: ["总资产减总负债；以对账为锚、叠加之后的流水", "Assets minus liabilities, anchored by reconciling plus later entries"],
        loc: ["资产页顶部 · FIRE 页 FI 本金", "Top of Assets · FI principal on FIRE"],
        lead: ["所有 FIRE 数字的分子。它准不准，决定了倒计时可不可信。", "The numerator of every FIRE number. Its accuracy decides whether the countdown means anything."],
        blocks: [
          { def: ["各账户余额加起来减去负债，再加上借出未收回、减去借入未还。余额以你最近一次对账为锚，叠加之后的全部流水；对账时的差额自动记为一笔「校准」。", "Account balances minus liabilities, plus money lent and not yet repaid, minus money borrowed. Balances start from your last reconcile and add every entry after it; any gap at reconcile time is recorded as a calibration."] },
          { fig: F.ReconcileFlow },
          { where: [[["资产页顶部", "Top of the Assets tab"], ["净资产、资产变化、资产组成三种看法", "Net worth, changes and breakdown"]], [["资产 → ＋ → 批量对账", "Assets → + → Batch Reconcile"], ["一次填完所有账户的真实余额", "Enter all real balances at once"]], [["FIRE 页 · FI 进度卡", "FIRE tab · FI Progress"], ["「FI 本金」就是这个数，两页同源", "\"FI principal\" is the same number"]]] },
          { related: ["diff-assets", "assets", "c-countdown"] },
        ],
      },
      {
        slug: "c-roles",
        title: ["支出的四个角色", "The four spending roles"],
        short: ["固定、必要、弹性、其他：每个分类在 FIRE 计算里算什么", "Fixed, essential, flexible, other: what each category counts as"],
        loc: ["设置 → 分类与标签", "Settings → Categories & Tags"],
        lead: ["分类的名字你随便起，角色决定它在自由计算里的位置。", "Name categories however you like; the role decides where they sit in the math."],
        blocks: [
          { def: ["每个一级支出分类都属于四个角色之一：固定（房租、订阅）、必要（吃饭、通勤）、弹性（聚餐、打车、购物）、其他（一次性大事）。", "Every top-level expense category has one of four roles: Fixed (rent, subscriptions), Essential (meals, commute), Flexible (eating out, taxis, shopping) and Other (one-offs)."] },
          { fig: F.RolesMap },
          { where: [[["设置 → 分类与标签", "Settings → Categories & Tags"], ["新建或修改一级分类时选角色", "Pick a role when you create or edit a top-level category"]]] },
          { related: ["categories", "c-lean", "c-standard"] },
        ],
      },
    ],
  },
  {
    id: "diff",
    title: ["和常见记账 App 的不同", "How Coast is different"],
    pages: [
      {
        slug: "diff-overview",
        title: ["一张表看区别", "The differences at a glance"],
        lead: ["大多数记账 App 回答的是「钱花在哪了」。Coast 想回答的是下一个问题：「照这样下去，我还要工作多久」。出发点不一样，分类、资产、口径就都跟着不一样。", "Most budgeting apps answer \"where did the money go?\" Coast is after the next question: \"at this rate, how long do I keep working?\" A different starting point changes categories, assets and the math."],
        blocks: [
          { fig: F.DiffOverview },
          { tip: ["如果你已经在用别的 App，不用急着换掉习惯：先把旧账导进来（见「从其他 App 搬过来」），再按下面三篇把分类和账户理一遍。", "Already using another app? Import your history first (see Move in from another app), then tidy categories and accounts using the next three pages."] },
        ],
      },
      {
        slug: "diff-categories",
        title: ["分类：不只是「花在哪」", "Categories: more than \"where\""],
        lead: ["常见 App 的分类树按消费类型长：餐饮下面早中晚，交通下面地铁公交打车。分得越细，越说不清哪一块能省。", "Typical category trees grow by type of purchase: meals under food, rides under transport. The finer they get, the less they say about what you could cut."],
        blocks: [
          { fig: F.DiffCategories },
          { p: ["在 Coast 里，一级分类的名字你随便起，但它必须回答一个问题：这类钱在你的自由计算里算什么？", "In Coast you name top-level categories however you like, but each must answer one question: what does this money count as in your freedom math?"] },
          { related: ["c-roles", "categories"] },
        ],
      },
      {
        slug: "diff-assets",
        title: ["资产：对账定锚", "Assets: anchored by reconciling"],
        lead: ["资产余额怎么来，决定了净资产曲线可不可信——而 FIRE 倒计时就是建在这条曲线上的。", "How balances are computed decides whether the net worth curve can be trusted — and the FIRE countdown is built on that curve."],
        blocks: [{ fig: F.DiffAssets }, { related: ["c-net-worth", "assets"] }],
      },
      {
        slug: "diff-numbers",
        title: ["统计口径：按真实的钱算", "The math: real money, net"],
        lead: ["同样几笔账，不同的算法会得出完全不同的储蓄率。Coast 的原则只有一条：只算真正离开你口袋、不会回来的钱。", "The same entries can produce very different savings rates. Coast has one rule: count only money that truly left your pocket and isn't coming back."],
        blocks: [{ fig: F.DiffNumbers }, { related: ["c-savings-rate", "split"] }],
      },
    ],
  },
  {
    id: "habits",
    title: ["记账方法", "How to record"],
    pages: [
      {
        slug: "accounts",
        title: ["少建几个账户", "Keep accounts few"],
        lead: ["事无巨细地记，数据看着完整，复盘时却特别琐碎。与其记得多，不如记得有用——先从账户做减法。", "Recording everything looks thorough but makes reviews tedious. Useful beats complete — and accounts are the first place to cut."],
        blocks: [
          { fig: F.AccountsMerge },
          { p: ["每张信用卡单独建账，往往永远对不上银行，而最终的还款额反正以银行 App 为准。可以把几张信用卡合成一个，把常用的支付钱包合成一个，日常只在三四个账户之间选。", "A separate account per credit card rarely matches the bank, and the bank's number wins anyway. Merge the cards into one and your payment wallets into one, so day to day you pick from three or four."] },
          { tip: ["已经有一堆碎账户？在资产页长按某个账户，把它合并到另一个账户，流水会一起搬过去。", "Already have scattered accounts? Long-press one on the Assets tab and merge it into another — its entries move with it."] },
        ],
      },
      {
        slug: "merge",
        title: ["能合并的合成一笔", "Merge what you can"],
        lead: ["你关心的是一件事花了多少，而不是每一杯多少。", "What matters is what the thing cost, not every cup along the way."],
        blocks: [
          { fig: F.MergeEntries },
          { list: [
            ["交通卡充值记一笔，而不是每次刷卡。", "Log the transit top-up, not every ride."],
            ["咖啡店、食堂能储值的就储值，之后天天消费都不用再记。", "Prepay the coffee shop or canteen, then stop logging every visit."],
            ["旅行里零零碎碎的花费，最后合成一笔「旅行」；要 AA 的部分单独算。", "Roll the small stuff on a trip into one Travel entry; handle the shared parts as splits."],
            ["春节红包来来往往不逐笔记，过完年对一下余额，就知道今年是赚了还是亏了。", "Holiday red envelopes? Don't log each one — reconcile afterwards and see whether you came out ahead."],
          ] },
          { tip: ["合并记之后，余额和实际对不上很正常。每月对一次账就好。", "Merged entries mean balances drift a little — that's fine. Reconcile once a month."] },
          { related: ["c-net-worth", "assets"] },
        ],
      },
      {
        slug: "categories",
        title: ["按性质分类", "Categorize by nature"],
        lead: ["分类方式决定了复盘时你能回答什么问题。真正想知道的只有一个：如果要省钱，哪些能砍？", "How you categorize decides what questions your data can answer. The one that matters: if I had to cut back, what could go?"],
        blocks: [
          { fig: F.CategoryEvolution },
          { p: ["所以「吃饭」和「聚餐」要分开，「交通」和「打车」要分开，因为后一个是可以选择不花的。在 Coast 里，这体现为每个分类的「角色」。", "So keep meals apart from eating out and transit apart from taxis — the second of each is optional. In Coast, that's each category's role."] },
          { tip: ["某一块花得多、想单独盯着（比如旅行、学习），就拆成独立的一级分类，角色仍然选「弹性」。", "If one area deserves its own trend line (travel, learning), make it a top-level category and keep its role as Flexible."] },
          { related: ["c-roles", "diff-categories"] },
        ],
      },
    ],
  },
  {
    id: "record",
    title: ["记账", "Logging"],
    pages: [
      {
        slug: "entry",
        title: ["记一笔", "Log an entry"],
        lead: ["越常见的账，越该用越快的方式记。", "The more often you log something, the faster the method should be."],
        blocks: [
          { fig: F.EntryWays },
          { img: "templates", cap: ["模板：把常记的条目存下来，长按「＋」一步选用", "Templates: save frequent entries and long-press + to use one"] },
          { list: [
            ["记账面板的金额一上来是 0，你按多少就显示多少，键盘自带加减乘除。", "The amount starts at 0 and shows exactly what you type; the keypad does arithmetic."],
            ["截图记账（识别支付宝、微信、云闪付的支付结果页）正在施工中，入口暂时关闭，回来时会在更新日志里说。", "Screenshot Capture (reading Alipay, WeChat Pay and UnionPay result pages) is under construction; the entry is temporarily off and will return with a changelog note."],
            ["一笔钱里有别人的份，用「快速 AA」就地拆开；要报销的标成「待报销」，钱回来之后核销，净支出自动变小。不报了也能在报销中心一键「不报销」，几秒内可撤销。", "Part of it someone else's? Split it in place with Quick Split. Work expense? Mark it To Claim and settle it when the money comes back — or mark it Don't Reimburse in the Reimbursement Center, with a few seconds to undo."],
          ] },
          { fig: F.ExtrasLabel },
        ],
      },
      {
        slug: "import",
        title: ["从其他 App 搬过来", "Move in from another app"],
        lead: ["多年的旧账不用丢。三步搬过来，之后就在 Coast 里接着记。", "Keep your years of history. Three steps and you're recording in Coast."],
        blocks: [
          { fig: F.ImportFlow },
          { tip: ["导入后顺手把碎账户合并一下，再把分类归到四个角色里，FIRE 页的数字就准了。", "After importing, merge scattered accounts and give categories their roles — then the FIRE numbers are right."] },
          { related: ["accounts", "c-roles"] },
        ],
      },
      {
        slug: "split",
        title: ["AA 分账", "Split Bills"],
        lead: ["和朋友吃饭、合租、一起旅行——人情账也能算得清清楚楚，还不影响你的预算和自由日。", "Dinners, shared flats, group trips — keep track of who owes whom without muddying your budget or freedom date."],
        blocks: [
          { fig: F.SplitDiagram },
          { list: [
            ["长按「＋」选「AA 分账」：平均分、按金额、按比例都行；你付了等别人还，或别人付了你来还，两个方向都能记。", "Long-press + and choose Split Bill: evenly, by amount or by percentage, whether you paid or someone else did."],
            ["分账中心按人列出谁欠你、你欠谁，钱到了点一下结清，或一键全部结算，账户余额跟着变。", "The split center lists who owes you and whom you owe, by person. Settle one or Settle All; balances follow."],
            ["常一起分账的人会被记住，下次直接选。", "People you split with are remembered for next time."],
          ] },
        ],
      },
    ],
  },
  {
    id: "review",
    title: ["看账", "Reviewing"],
    pages: [
      {
        slug: "home",
        title: ["首页：每一笔都有代价", "Home: every entry has a price"],
        lead: ["钱已经花了，但换算成「晚自由几天」，下一次花钱之前你会多想一秒。", "The money's spent, but seen as days of freedom, the next purchase gets a second thought."],
        blocks: [
          { fig: F.EntryPrice },
          { img: "ledger", cap: ["账单页顶部的卡片左右滑：本月支出 ⇄ 财务自由目标", "Swipe the top card on Entries: spent this month ⇄ Financial Freedom Goal"] },
          { p: ["卡片下面的快速入口是「有就看一眼」的地方：待报销、AA 分账、计划、转账、退款，显示哪些、用卡片还是胶囊样式，都能在设置里改。", "Below it are shortcuts worth a glance: To Claim, Split Bills, Plans, Transfers, Refunds. Pick which show, and card or chip style, in Settings."] },
          { related: ["c-countdown"] },
        ],
      },
      {
        slug: "budget",
        title: ["预算：让过去的你帮你算", "Budgets from your own history"],
        lead: ["拉表格手动算预算，大多坚持不了几个月。Coast 直接从你的历史里算，你只需要决定要不要再收紧一点。", "Budget spreadsheets rarely survive a few months. Coast works it out from your history; you just decide how much tighter to go."],
        blocks: [
          { p: ["在预算页打开「智能预算」，「重新生成」会按最近 3 个月给出额度——用的是中位数，不是平均数：", "Open Smart Budget on the budget page. Regenerate proposes limits from the last three months — using the median, not the average:"] },
          { fig: F.MedianVsAverage },
          { p: ["在这个基础上可以拖动滑块再收紧。预算的意义往往是「比过去花得少」，照搬历史等于把旧习惯合理化。「铺满全年」则优先参考去年同月：", "Then drag the slider to tighten it — a budget is usually about spending less than before, not making old habits official. Fill Year looks at the same month last year first:"] },
          { fig: F.SeasonalBudget },
          { p: ["总额合适、但分类之间分得不对时，用「再平衡」把额度从花不完的分类挪到真正在花的分类。", "If the total is right but the split isn't, Rebalance moves room from categories you never use up to the ones you do."] },
          { fig: F.PaceChart },
          { tip: ["预算就是个参考，超了也不用有负担。月中展开本月支出卡看一眼消费节奏：曲线跑到虚线上面，剩下的日子收一收就好。", "A budget is a reference; going over isn't failure. Mid-month, expand the monthly card and check the pace: above the dashed line, ease off for the rest of the month."] },
        ],
      },
      {
        slug: "data",
        title: ["数据页：回头看", "Data: looking back"],
        lead: ["按月、年、全部三个维度看收支。每个月初花一分钟，比年底一次性复盘有用得多。", "Income and spending by month, year or all time. A minute at the start of each month beats one big review at year's end."],
        blocks: [
          { list: [
            ["「月度回顾」用几句话告诉你：这个月结余多少、比上个月多花还是少花、变化最大的是哪一类、最大的一笔是什么。", "The Monthly Review sums it up in a few lines: what you saved, more or less than last month, which category moved most, the biggest single expense."],
            ["「分类构成」可以一路点进二级分类，看钱具体去了哪里。", "Category Breakdown drills into subcategories to show where the money actually went."],
          ] },
          { p: ["「常买」会把同一样东西的历次价格收在一起：买了几次、通常多少钱、最低最高多少。", "Repeat Buys gathers every price you've paid for the same thing: how often, the usual price, the lowest and highest."] },
          { fig: F.RepeatBuyDots },
        ],
      },
      {
        slug: "assets",
        title: ["资产页：每月对一次账", "Assets: reconcile monthly"],
        lead: ["FIRE 页的倒计时准不准，取决于净资产准不准。好在只需要每月一分钟。", "The countdown is only as good as your net worth. Luckily that takes a minute a month."],
        blocks: [
          { img: "assets", cap: ["资产页：净资产、资产变化、资产组成三种看法", "Assets: net worth, changes and breakdown"] },
          { fig: F.ReconcileFlow },
          { tip: ["对账入口在「资产 → ＋ → 批量对账」。合并记账、漏记几笔都没关系，填一遍真实余额，差额自动记为校准。", "Reconcile from Assets → + → Batch Reconcile. Merged or missed entries don't matter — enter real balances and the gap is recorded as a calibration."] },
          { related: ["c-net-worth", "diff-assets"] },
        ],
      },
    ],
  },
  {
    id: "fire-tab",
    title: ["FIRE 页", "The FIRE tab"],
    pages: [
      {
        slug: "fire-cards",
        title: ["FIRE 页上的每张卡", "Every card on the FIRE tab"],
        lead: ["FIRE 页从上到下是一叠卡片，每张回答一个问题。下面按顺序列出来，点名字就能跳到对应概念的详细解释。", "The FIRE tab is a stack of cards, each answering one question. Here they are in order — tap a name for the full explanation."],
        blocks: [
          { img: "fire", cap: ["FIRE 页：距离财务自由（标准 FI）", "The FIRE tab: time to financial independence (standard FI)"] },
          { cardmap: [
            [["自由倒计时", "Freedom countdown"], ["还要多久？下面一行是悲观到乐观的区间", "How long? The range sits underneath"], "c-countdown"],
            [["试算", "What-If"], ["少花多少、多赚多少，自由日怎么动", "What if you spent less or earned more?"], "countdown"],
            [["FI 进度", "FI Progress"], ["Lean FI 和标准 FI 两条线，已经走了多远", "How far along the Lean and Standard lines"], "c-lean"],
            [["Coast FIRE 线", "Coast FIRE line"], ["还需不需要为退休继续存钱（Pro）", "Do you still need to save for retirement? (Pro)"], "c-coast"],
            [["Barista FIRE 目标", "Barista FIRE Goal"], ["有兼职托底时要攒多少（Pro）", "How much with a part-time job (Pro)"], "c-barista"],
            [["场景模拟", "Scenarios"], ["大决定并排比一比（Pro）", "Compare big decisions side by side (Pro)"], "scenarios"],
            [["本月储蓄率", "Savings Rate"], ["这个月留下了多少", "How much you kept this month"], "c-savings-rate"],
            [["被动收入覆盖率", "Passive Income Coverage"], ["不上班，钱还在不在进来", "Is money coming in without work?"], "c-passive"],
          ] },
          { tip: ["卡片的顺序和显示与否可以在「设置 → FIRE 页模块」里调；每张卡标题旁的 ⓘ 是它的完整解释。", "Reorder or hide cards in Settings → FIRE Tab Modules; the ⓘ next to each title has the full explanation."] },
        ],
      },
      {
        slug: "countdown",
        title: ["倒计时与试算", "Countdown and What-If"],
        lead: ["最大的数字不是余额，是「还有几年几个月」。更好玩的是：它会跟着你的手指动。", "The biggest number isn't a balance; it's years and months to go. Better still, it moves under your finger."],
        blocks: [
          { p: ["拖一拖「试算」的两个滑块：每月少花 1000 能提前多久？收入涨两成呢？", "Drag the two What-If sliders: how much sooner if you spend ¥1,000 less a month? What about a 20% raise?"] },
          { fig: F.WhatIf },
          { tip: ["同样拖 10%，试试「少花」和「多赚」哪个让自由日提前得更多。", "Drag both by 10% and see which moves the date more — spending less or earning more."] },
          { related: ["c-countdown", "c-savings-rate", "c-return"] },
        ],
      },
      {
        slug: "scenarios",
        title: ["场景模拟：给大决定一个冷静期", "Scenarios: a cooling-off period for big decisions"],
        lead: ["买车、换城市、跳槽、买房——把它们加成场景，和现状并排比一比。", "A car, a move, a new job, a home — add them as scenarios and compare side by side."],
        blocks: [
          { fig: F.ScenarioCompare },
          { p: ["想买的东西先放进来，看看它换算成自由日的代价，过几天再决定。很多「非买不可」，过几天就没那么想要了。", "Put the thing you want in first, see its price in time, decide in a few days. Plenty of must-haves stop feeling that way after a week."] },
        ],
      },
    ],
  },
  {
    id: "more",
    title: ["更多", "More"],
    pages: [
      {
        slug: "sync",
        title: ["同步、备份与隐私", "Sync, backups and privacy"],
        lead: ["没有账号、没有服务器、没有追踪。你的账只在你自己手里。", "No account, no server, no tracking. Your books stay yours."],
        blocks: [
          { fig: F.PrivacyDiagram },
          { list: [
            ["开启 iCloud 同步后，iPhone、iPad、Mac 之间自动同步。iPad 和 Mac 上是大屏布局，横屏时左边是侧边栏。", "With iCloud sync on, iPhone, iPad and Mac stay in step. iPad and Mac get a big-screen layout with a sidebar in landscape."],
            ["在别人面前打开 App？点眼睛图标隐藏金额；或者在设置里打开「后台模糊」，切到多任务界面时整屏糊掉。", "Around other people? Tap the eye to hide amounts, or turn on Blur in background so the app switcher shows nothing."],
          ] },
        ],
      },
      {
        slug: "pro",
        title: ["免费与 Pro", "Free and Pro"],
        lead: ["记账、看账、自由倒计时都免费。Pro 解锁的是更深一层的推演和个性化。", "Logging, reviewing and the freedom countdown are free. Pro adds deeper projections and personalization."],
        blocks: [{ fig: F.ProTable }],
      },
    ],
  },
]

const PAGES = GROUPS.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.id })))
const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]))
const slugFromHash = () => {
  const h = decodeURIComponent(window.location.hash.slice(1))
  return BY_SLUG.has(h) ? h : PAGES[0].slug
}

function Nav({ current, open, toggle, onPick }: { current: string; open: Set<string>; toggle: (id: string) => void; onPick?: () => void }) {
  const { lang } = useLang()
  const pick = (x: L) => (lang === "zh" ? x[0] : x[1])
  return (
    <nav className="space-y-1">
      {GROUPS.map((g) => {
        const isOpen = open.has(g.id)
        return (
          <div key={g.id}>
            <button onClick={() => toggle(g.id)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-semibold hover:bg-muted/60" aria-expanded={isOpen}>
              <span>{pick(g.title)}<span className="ml-1.5 text-xs font-normal text-muted-foreground">{g.pages.length}</span></span>
              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "" : "-rotate-90"}`} />
            </button>
            {isOpen && (
              <ul className="mb-2 ml-2 border-l border-border pl-2">
                {g.pages.map((p) => {
                  const active = p.slug === current
                  return (
                    <li key={p.slug}>
                      <a href={`#${p.slug}`} onClick={onPick}
                        className={`block rounded-md px-2.5 py-1.5 text-[14px] leading-snug ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}>
                        {pick(p.title)}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default function Guide() {
  const { t, lang } = useLang()
  const pick = (x: L) => (lang === "zh" ? x[0] : x[1])
  const [slug, setSlug] = useState(slugFromHash)
  const page = BY_SLUG.get(slug)!
  const idx = PAGES.findIndex((p) => p.slug === slug)
  const [open, setOpen] = useState<Set<string>>(() => new Set([page.group]))
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setSlug(slugFromHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // 换篇：回到顶部，并把所在大类展开（从上一篇 / 下一篇、相关概念跳进一个收起的大类时）
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setOpen((s) => (s.has(page.group) ? s : new Set([...s, page.group])))
  }, [slug, page.group])

  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const groupTitle = useMemo(() => GROUPS.find((g) => g.id === page.group)!.title, [page.group])
  const prev = PAGES[idx - 1], next = PAGES[idx + 1]
  const link = (s: string) => BY_SLUG.get(s)

  const renderBlock = (b: Block, j: number) => {
    if ("p" in b) return <p key={j} className="leading-relaxed text-muted-foreground">{pick(b.p)}</p>
    if ("tip" in b) return (
      <div key={j} className="rounded-xl bg-primary/8 px-4 py-3 text-[15px] leading-relaxed">
        <span className="mr-2 font-medium text-primary">{t("试试", "Try it")}</span>
        <span className="text-foreground/80">{pick(b.tip)}</span>
      </div>
    )
    if ("def" in b) return (
      <div key={j} className="border-l-2 border-primary pl-4">
        <div className="text-xs font-bold uppercase tracking-[.1em] text-primary">{t("一句话", "In one line")}</div>
        <p className="mt-1.5 text-[17px] leading-relaxed">{pick(b.def)}</p>
      </div>
    )
    if ("formula" in b) return (
      <div key={j} className="rounded-xl border border-dashed border-border px-4 py-3">
        <div className="text-xs text-muted-foreground">{t("怎么算", "How it's calculated")}</div>
        <div className="num mt-1 text-[15px]">{pick(b.formula)}</div>
      </div>
    )
    if ("where" in b) return (
      <div key={j} className="rounded-xl bg-muted/50 p-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.1em] text-muted-foreground"><MapPin className="size-3.5" />{t("在 App 里哪里看", "Where to find it in the app")}</div>
        <ul className="space-y-2.5">
          {b.where.map(([loc, what], k) => (
            <li key={k} className="grid gap-0.5 text-sm sm:grid-cols-[minmax(0,210px)_1fr] sm:gap-4">
              <span className="font-medium">{pick(loc)}</span>
              <span className="text-muted-foreground">{pick(what)}</span>
            </li>
          ))}
        </ul>
      </div>
    )
    if ("related" in b) return (
      <div key={j}>
        <div className="mb-2 text-xs text-muted-foreground">{t("相关", "Related")}</div>
        <div className="flex flex-wrap gap-2">
          {b.related.map((s) => link(s) && (
            <a key={s} href={`#${s}`} className="rounded-full border border-border px-3 py-1 text-[13px] hover:border-primary/40 hover:text-primary">{pick(link(s)!.title)} →</a>
          ))}
        </div>
      </div>
    )
    if ("index" in b) {
      const concepts = PAGES.filter((p) => p.short)
      return (
        <div key={j} className="divide-y divide-border rounded-2xl border border-border">
          {concepts.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="group grid gap-1 px-4 py-3 hover:bg-muted/40 sm:grid-cols-[150px_1fr] sm:gap-4">
              <span className="font-medium group-hover:text-primary">{pick(c.title)}</span>
              <span className="text-sm">
                <span className="text-muted-foreground">{pick(c.short!)}</span>
                <span className="mt-1 flex items-center gap-1 text-[12px] text-primary/80"><MapPin className="size-3" />{pick(c.loc!)}</span>
              </span>
            </a>
          ))}
        </div>
      )
    }
    if ("cardmap" in b) return (
      <ol key={j} className="space-y-2">
        {b.cardmap.map(([name, q, s], k) => (
          <li key={s + k}>
            <a href={`#${s}`} className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:border-primary/40">
              <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-muted text-[12px]">{k + 1}</span>
              <span className="min-w-0 flex-1"><span className="block font-medium group-hover:text-primary">{pick(name)}</span><span className="block text-[13px] text-muted-foreground">{pick(q)}</span></span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ol>
    )
    if ("list" in b) return (
      <ul key={j} className="space-y-2">
        {b.list.map((it, k) => (
          <li key={k} className="flex gap-3 leading-relaxed text-muted-foreground">
            <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-primary/50" />
            <span>{pick(it)}</span>
          </li>
        ))}
      </ul>
    )
    if ("img" in b) return (
      <figure key={j} className="py-2">
        <Device src={screen(b.img, lang)} alt={pick(b.cap)} width={230} />
        <figcaption className="mt-3 text-center text-[13px] text-muted-foreground">{pick(b.cap)}</figcaption>
      </figure>
    )
    const Fig = b.fig
    return <Fig key={j} />
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-28 md:px-10">
        <div className="grid gap-10 md:grid-cols-[232px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden md:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
              <div className="mb-3 px-2 font-heading text-xl">{t("使用手册", "Manual")}</div>
              <Nav current={slug} open={open} toggle={toggle} />
            </div>
          </aside>

          <article className="min-w-0 max-w-[720px]">
            {/* 手机：目录按钮吸在顶栏下面（顶栏 fixed top-3 h-14，底边在 68px），往下读也随时能换篇 */}
            <div className="sticky top-[76px] z-10 -mx-6 mb-6 bg-background/85 px-6 py-2 backdrop-blur md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger render={<Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-card" />}>
                  <ListTree className="size-4 shrink-0" />
                  <span className="shrink-0">{t("目录", "Contents")}</span>
                  <span className="truncate text-muted-foreground">· {pick(page.title)}</span>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle className="font-heading">{t("使用手册", "Manual")}</SheetTitle></SheetHeader>
                  <div className="px-3 pb-6"><Nav current={slug} open={open} toggle={toggle} onPick={() => setSheetOpen(false)} /></div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="font-sans text-xs font-bold uppercase tracking-[.12em] text-primary">{pick(groupTitle)}</div>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{pick(page.title)}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{pick(page.lead)}</p>

            <div className="mt-8 space-y-5">{page.blocks.map(renderBlock)}</div>

            <div className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
              {prev ? (
                <a href={`#${prev.slug}`} className="group rounded-xl border border-border p-4 hover:border-primary/40">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft className="size-3.5" />{t("上一篇", "Previous")}</div>
                  <div className="mt-1 font-medium group-hover:text-primary">{pick(prev.title)}</div>
                </a>
              ) : <span />}
              {next && (
                <a href={`#${next.slug}`} className="group rounded-xl border border-border p-4 text-right hover:border-primary/40">
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">{t("下一篇", "Next")}<ChevronRight className="size-3.5" /></div>
                  <div className="mt-1 font-medium group-hover:text-primary">{pick(next.title)}</div>
                </a>
              )}
            </div>

            <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
              {t("还有想不明白的地方，或者有一个「我天天遇到、你可能没想到」的记账场景，直接写信：", "Stuck, or have a situation you run into every day that we may not have thought of? Write to us: ")}
              <a href={`mailto:${MAIL}`} className="text-primary hover:underline">{MAIL}</a>
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
