import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ListTree } from "lucide-react"
import { Device, Footer, Header } from "@/components/site/Shell"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MAIL, screen, useLang } from "@/lib/i18n"
import * as F from "@/components/guide/figures"

/**
 * 使用手册：左侧按大类分组、可展开收起的目录，右侧一次只显示一篇（分页，`#slug` 可直接分享）。
 * 思路取自少数派长文《记了 10 年账，我还是决定自己 Vibe Coding 一款记账 App》：
 * 先讲记账的终点（FIRE）和「能不记就不记」，再按页面讲功能。
 * 语气是引导式的；能画成图的尽量画（见 components/guide/figures.tsx），文字只讲「为什么」。
 * 功能名、路径、英文叫法、免费 / Pro 划分都按 FIRE 仓库里的 App 文案和 Entitlement 核对过，App 改了这里跟着改。
 */

type L = [string, string]
type Block =
  | { p: L }
  | { tip: L }
  | { list: L[] }
  | { img: string; cap: L }
  | { fig: React.ComponentType }
type Page = { slug: string; title: L; lead: L; blocks: Block[] }
type Group = { id: string; title: L; pages: Page[] }

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
          { p: ["Coast 给的终点是 FIRE（财务独立、提前退休）：攒到一笔钱，它产生的收益足够覆盖开销，工作就从「必须」变成「可选」。估算方法很简单——一年的开销 ÷ 4%，也就是年支出的 25 倍。", "Coast's destination is FIRE (Financial Independence, Retire Early): enough savings that the returns cover your spending, so work becomes optional. The estimate is simple — a year of spending ÷ 4%, or 25× your annual spending."] },
          { fig: F.FiFormula },
          { p: ["这个公式里只有两样东西是你能动的：攒下的钱和花掉的钱。少花一点，既多攒了，要攒的目标也变小了——所以储蓄率对「还有多久」的影响，比大多数人想的要大得多。", "Only two things in that formula are yours to move: what you save and what you spend. Spending less saves more and shrinks the target at the same time — which is why your savings rate matters far more than most people expect."] },
          { fig: F.SavingsRateYears },
          { tip: ["Coast 里所有功能，最后都在回答同一个问题：离这个终点还有多远。带着这个问题往下看，每个功能为什么长这样就清楚了。", "Every feature in Coast answers one question: how far are you from that point? Keep it in mind and the rest of this manual will make sense."] },
        ],
      },
      {
        slug: "fire-types",
        title: ["几条不同的自由线", "Several freedom lines"],
        lead: ["「财务自由」不是一个点，而是几条由近到远的线。越过第一条，你就已经换了一种活法。", "Financial freedom isn't one point but several lines, near to far. Crossing the first already changes how you can live."],
        blocks: [
          { fig: F.FireLadder },
          { list: [
            ["Coast FIRE：已有的钱靠复利自己长，到退休那年正好够。越过它，就不必再为退休额外存钱——App 的名字就来自这里。", "Coast FIRE: what you have compounds into enough by retirement. Past it, you no longer need to save for retirement — the app is named after it."],
            ["Lean FI：只算停不下来的开销（固定 + 必要），是「活下去」的那条线，通常比想象中近。", "Lean FI: only the spending you can't stop (fixed + essential). The \"I'd be fine\" line — usually closer than you think."],
            ["Barista FIRE：一份愿意长期做的兼职把开销托住一部分，资产只需覆盖剩下的。", "Barista FIRE: a part-time job you'd keep covers part of your spending; assets cover the rest."],
            ["标准 FI：按现在的生活方式算全部开销，是「照现在这样活」的那条线。", "Standard FI: everything at your current lifestyle — \"live like I do now\"."],
          ] },
          { tip: ["这几条线在 FIRE 页上都有对应的卡片，后面「FIRE 页」那组会一条条讲怎么看、怎么动。", "Each line has its own card on the FIRE tab; the FIRE section of this manual walks through how to read and move them."] },
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
          { tip: ["如果你已经在用别的 App，不用急着换掉习惯：先把旧账导进来（见「从其他 App 搬过来」），再按下面三篇把分类和账户理一遍。", "Already using another app? No need to relearn everything at once: import your history first (see Move in from another app), then tidy categories and accounts using the next three pages."] },
        ],
      },
      {
        slug: "diff-categories",
        title: ["分类：不只是「花在哪」", "Categories: more than \"where\""],
        lead: ["常见 App 的分类树按消费类型长：餐饮下面早中晚，交通下面地铁公交打车。分得越细，越说不清哪一块能省。", "Typical category trees grow by type of purchase: meals under food, rides under transport. The finer they get, the less they say about what you could cut."],
        blocks: [
          { fig: F.DiffCategories },
          { p: ["在 Coast 里，一级分类的名字你随便起，但它必须回答一个问题：这类钱在你的自由计算里算什么？固定和必要决定「最低能活」的那条线，弹性是你最能动的地方，其他则是不该被年化的一次性大事。", "In Coast you name top-level categories however you like, but each must answer one question: what does this money count as in your freedom math? Fixed and essential set the bare-minimum line, flexible is where you have room, and other holds one-offs that shouldn't be annualized."] },
        ],
      },
      {
        slug: "diff-assets",
        title: ["资产：对账定锚", "Assets: anchored by reconciling"],
        lead: ["资产余额怎么来，决定了净资产曲线可不可信——而 FIRE 倒计时就是建在这条曲线上的。", "How balances are computed decides whether the net worth curve can be trusted — and the FIRE countdown is built on that curve."],
        blocks: [{ fig: F.DiffAssets }],
      },
      {
        slug: "diff-numbers",
        title: ["统计口径：按真实的钱算", "The math: real money, net"],
        lead: ["同样几笔账，不同的算法会得出完全不同的储蓄率。Coast 的原则只有一条：只算真正离开你口袋、不会回来的钱。", "The same entries can produce very different savings rates. Coast has one rule: count only money that truly left your pocket and isn't coming back."],
        blocks: [{ fig: F.DiffNumbers }],
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
          { tip: ["合并记之后，余额和实际对不上很正常。每月对一次账就好（见「资产页」）。", "Merged entries mean balances drift a little — that's fine. Reconcile once a month (see Assets)."] },
        ],
      },
      {
        slug: "categories",
        title: ["按性质分类", "Categorize by nature"],
        lead: ["分类方式决定了复盘时你能回答什么问题。真正想知道的只有一个：如果要省钱，哪些能砍？", "How you categorize decides what questions your data can answer. The one that matters: if I had to cut back, what could go?"],
        blocks: [
          { fig: F.CategoryEvolution },
          { p: ["所以 Coast 的每个支出分类都属于四个角色之一。「吃饭」和「聚餐」分开，「交通」和「打车」分开，因为后一个是可以选择不花的。角色决定了这笔钱在 FIRE 计算里算什么：", "So every expense category in Coast belongs to one of four roles. Keep meals apart from eating out, transit apart from taxis — the second of each is optional. The role decides what the money counts as in the FIRE math:"] },
          { fig: F.RolesMap },
          { tip: ["自定义分类时名字和图标随便改，但必须选一个角色。某一块花得多、想单独盯着（比如旅行、学习），就拆成独立的一级分类，角色仍然选「弹性」。", "Rename categories and change icons freely, but give each a role. If one area deserves its own trend line (travel, learning), make it a top-level category and keep its role as Flexible."] },
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
            ["截图记账在「设置 → 截图记账」里设置，支持支付宝、微信、云闪付的支付结果页，可以绑到操作按钮或控制中心。", "Set up Screenshot Capture in Settings → Screenshot Capture. It reads Alipay, WeChat Pay and UnionPay result pages and can live on the Action button or in Control Center."],
            ["一笔钱里有别人的份，用「快速 AA」就地拆开；要报销的标成「待报销」，钱回来之后核销，净支出自动变小。", "Part of it someone else's? Split it in place with Quick Split. Work expense? Mark it To Claim and settle it when the money comes back."],
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
          { tip: ["导入后顺手把碎账户合并一下（「少建几个账户」那篇），再把分类归到四个角色里，FIRE 页的数字就准了。", "After importing, merge scattered accounts (see Keep accounts few) and give categories their roles — then the FIRE numbers are right."] },
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
          { img: "ledger", cap: ["账单页顶部的卡片左右滑：本月支出 ⇄ 财富自由目标", "Swipe the top card on Entries: spent this month ⇄ your freedom goal"] },
          { p: ["试试记完一笔大额支出后，把账单页顶部的卡片滑到「财富自由目标」看一眼——那个数字会动。卡片下面的快速入口是「有就看一眼」的地方：待报销、AA 分账、计划、转账、退款，显示哪些、用卡片还是胶囊样式，都能在设置里改。", "After a big purchase, swipe the top card to your freedom goal — the number moves. Below it are shortcuts worth a glance: To Claim, Split Bills, Plans, Transfers, Refunds. Pick which show, and card or chip style, in Settings."] },
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
        ],
      },
    ],
  },
  {
    id: "fire",
    title: ["FIRE 页", "The FIRE tab"],
    pages: [
      {
        slug: "countdown",
        title: ["倒计时与试算", "Countdown and What-If"],
        lead: ["最大的数字不是余额，是「还有几年几个月」。更好玩的是：它会跟着你的手指动。", "The biggest number isn't a balance; it's years and months to go. Better still, it moves under your finger."],
        blocks: [
          { img: "fire", cap: ["FIRE 页：距离财务自由（标准 FI）", "The FIRE tab: time to financial independence (standard FI)"] },
          { p: ["记了资产，再有一段时间的收支，倒计时就能按近 12 个月的平均开销、月均储蓄和一个中性的收益假设估出来。接着拖一拖「试算」滑块：", "With your assets and a few months of income and spending recorded, the countdown uses your 12-month average spending, average monthly savings and a neutral return. Then drag the What-If sliders:"] },
          { fig: F.WhatIf },
          { tip: ["同样拖 10%，试试「少花」和「多赚」哪个让自由日提前得更多。", "Drag both by 10% and see which moves the date more — spending less or earning more."] },
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
      {
        slug: "fire-lines",
        title: ["FI 进度、Coast 与 Barista", "FI Progress, Coast and Barista"],
        lead: ["倒计时回答「还有多久」，这几张卡回答「已经走了多远」和「还能怎么走」。", "The countdown answers how long. These cards answer how far you've come — and what other routes exist."],
        blocks: [
          { p: ["FI 进度有两条线：Lean FI 是「活下去」，标准 FI 是「照现在这样活」，两条线之间的差额就是生活方式的价钱。Coast FIRE 线跟「距目标退休」的年数联动：", "FI Progress has two lines, Lean and Standard; the gap between them is the price of your lifestyle. The Coast FIRE line moves with Until Target Retirement:"] },
          { fig: F.CoastCurve },
          { p: ["Barista FIRE 里填一个你真愿意长期做的兼职收入，看半退休需要的资产会少多少：", "In Barista FIRE, enter part-time income you'd really keep doing and see how much less you'd need to semi-retire:"] },
          { fig: F.BaristaBars },
          { tip: ["4% 提取率是 30 年退休期的经验值。打算更早退休，可以在「设置 → FI 参数」里调低一点（比如 3.5%），结果更稳妥。", "4% is a rule of thumb for a 30-year retirement. Stopping earlier? Lower it in Settings → FI Parameters (3.5%, say) for a safer estimate."] },
        ],
      },
      {
        slug: "savings",
        title: ["储蓄率与被动收入", "Savings rate and passive income"],
        lead: ["这是这个月就能改的两个数。", "Two numbers you can move this month."],
        blocks: [
          { p: ["储蓄率 =（收入 − 支出）÷ 收入。先从弹性分类下手；单月起伏不用紧张，看那条 12 个月的虚线往哪走就够了。50% 是 FIRE 社区的常用参照，从零开始大约十六七年到 FI（见「记账的终点」那张图）。", "Savings rate = (income − spending) ÷ income. Start with Flexible categories; ignore single-month swings and watch the 12-month line. 50% is the community's common benchmark — roughly 16–17 years to FI from zero (see the chart in Where tracking leads)."] },
          { fig: F.PassiveGauge },
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
const slugFromHash = () => {
  const h = decodeURIComponent(window.location.hash.slice(1))
  return PAGES.some((p) => p.slug === h) ? h : PAGES[0].slug
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
              {pick(g.title)}
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
  const page = PAGES.find((p) => p.slug === slug)!
  const idx = PAGES.findIndex((p) => p.slug === slug)
  const [open, setOpen] = useState<Set<string>>(() => new Set([page.group]))
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setSlug(slugFromHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // 换篇：回到顶部，并把所在大类展开（从上一篇 / 下一篇跳进一个收起的大类时）
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setOpen((s) => (s.has(page.group) ? s : new Set([...s, page.group])))
  }, [slug, page.group])

  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const groupTitle = useMemo(() => GROUPS.find((g) => g.id === page.group)!.title, [page.group])
  const prev = PAGES[idx - 1], next = PAGES[idx + 1]

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
            <div className="mb-6 md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
                  <ListTree className="size-4" />{t("目录", "Contents")}
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

            <div className="mt-8 space-y-5">
              {page.blocks.map((b, j) => {
                if ("p" in b) return <p key={j} className="leading-relaxed text-muted-foreground">{pick(b.p)}</p>
                if ("tip" in b) return (
                  <div key={j} className="rounded-xl bg-primary/8 px-4 py-3 text-[15px] leading-relaxed">
                    <span className="mr-2 font-medium text-primary">{t("试试", "Try it")}</span>
                    <span className="text-foreground/80">{pick(b.tip)}</span>
                  </div>
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
              })}
            </div>

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
