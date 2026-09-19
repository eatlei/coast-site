import { DocPage, Device } from "@/components/site/Shell"
import { MAIL, screen, useLang } from "@/lib/i18n"

/**
 * 使用手册。思路取自少数派长文《记了 10 年账，我还是决定自己 Vibe Coding 一款记账 App》：
 * 先讲「记账的终点是 FIRE」和「能不记就不记」，再按页面讲功能。
 * 语气是引导式的（试试、你可以），不是操作说明书；每节讲「为什么这样用」，再给一个能马上试的动作。
 * 功能名、路径、英文叫法以 App 内文案为准（FIRE 仓库的 Localizable.xcstrings），App 改名时这里跟着改。
 */

type L = [string, string]
type Block = { p: L } | { tip: L } | { list: L[] } | { img: string; cap: L }
type Section = { id: string; title: L; blocks: Block[] }

const SECTIONS: Section[] = [
  {
    id: "why",
    title: ["先说终点：为什么是 FIRE", "Start with the destination: why FIRE"],
    blocks: [
      { p: [
        "很多人记账记了好几年，最后只剩一句「这个月又花了这么多」。不是记得不够细，是记账缺一个终点——记下来的数字，要往哪里用？",
        "Plenty of people track spending for years and end up with one sentence: \"I spent a lot again this month.\" The problem isn't detail. It's that tracking has no destination. Where are all these numbers supposed to go?",
      ] },
      { p: [
        "Coast 给的终点是 FIRE（财务独立、提前退休）：攒到一笔钱，它产生的收益足够覆盖你的开销，工作就从「必须」变成「可选」。常用的估算很简单——一年的开销 ÷ 4%，也就是年支出的 25 倍，就是你的 FI 数字。",
        "Coast's destination is FIRE (Financial Independence, Retire Early): enough savings that the returns cover your spending, so work becomes optional. The common estimate is simple — a year of spending ÷ 4%, or 25× your annual spending, is your FI number.",
      ] },
      { p: [
        "这个公式里只有两样东西是你能动的：攒下的钱和花掉的钱。每月多攒一点，离目标更近；每月少花一点，目标本身也跟着变小——所以储蓄率对「还有多久」的影响，比大多数人想的要大。Coast 里所有功能，最后都在回答同一个问题：离这个终点还有多远。",
        "Only two things in that formula are yours to move: what you save and what you spend. Saving more brings you closer; spending less makes the target itself smaller. That's why your savings rate moves the \"how long\" more than most people expect. Every feature in Coast ends up answering one question: how far are you from that point?",
      ] },
      { list: [
        ["Lean FI：只算停不下来的开销（固定 + 必要），是「活下去」的那条线，通常比你想的近。", "Lean FI counts only the spending you can't stop (fixed + essential). It's the \"I'd be fine\" line, and usually closer than you think."],
        ["标准 FI：按你现在的生活方式算全部开销，是「照现在这样活」的那条线。", "Standard FI counts everything at your current lifestyle — the \"live like I do now\" line."],
        ["Coast FIRE：已有的钱靠复利自己长，到退休那年正好够。越过这条线，就不必再为退休额外存钱——App 的名字就来自它。", "Coast FIRE: what you already have compounds into enough by retirement. Past this line you no longer need to save for retirement — the app is named after it."],
        ["Barista FIRE：有一份愿意长期做的兼职托底，资产只需覆盖剩下那部分。", "Barista FIRE: a part-time job you'd happily keep covers part of your spending, so your assets only need to cover the rest."],
      ] },
    ],
  },
  {
    id: "habits",
    title: ["开始记之前：能不记就不记", "Before you start: record less"],
    blocks: [
      { p: [
        "事无巨细地记，数据看着很完整，但复盘时特别琐碎，久了就不想看了。与其记得多，不如记得有用。下面三个习惯是 Coast 的设计出发点，你可以按自己的情况取舍。",
        "Logging every bottle of water looks thorough, but reviewing it is tedious, and soon you stop looking. Useful beats complete. These three habits shaped how Coast works — take what fits you.",
      ] },
      { p: [
        "第一，少建几个账户。每张信用卡单独建账，往往永远对不上银行——最后的还款额反正以银行 App 为准。可以把几张信用卡合成一个「信用卡」账户，把常用的支付钱包合成一个，日常只在三四个账户之间选。",
        "First, keep accounts few. A separate account per credit card rarely matches the bank, and the bank's number wins anyway. Merge your cards into one \"Credit card\" account and your payment wallets into one, so day to day you pick from three or four.",
      ] },
      { tip: [
        "已经有一堆碎账户？在资产页长按某个账户，选「合并到其他账户」，流水会一起搬过去。余额对不上时，用「资产 → ＋ → 批量对账」把真实余额填一遍，差额自动记为校准，不用逐笔去找。",
        "Already have scattered accounts? Long-press one on the Assets tab and merge it into another — its entries move with it. When balances drift, use Assets → + → Batch Reconcile to enter the real balances; the difference is recorded as a calibration, no hunting required.",
      ] },
      { p: [
        "第二，能合并的消费合成一笔。地铁卡充值记一笔，而不是每次刷卡；咖啡店储值记一笔，之后每天喝都不用再记；旅行里零零碎碎的花费，最后合成一笔「旅行」就好。你关心的是这件事花了多少，不是每一杯多少。",
        "Second, merge what can be merged. One top-up for the transit card instead of every ride; one prepaid balance at the coffee shop instead of every cup; the small stuff on a trip rolled into one \"Travel\" entry. What matters is what the thing cost, not every cup along the way.",
      ] },
      { p: [
        "第三，按「性质」分类，而不是按「类型」。早餐、午餐、晚餐这样分，复盘时回答不了任何问题；真正想知道的是：如果要省钱，哪些能砍？所以 Coast 的每个支出分类都属于四个角色之一——固定（房租、订阅）、必要（吃饭、通勤）、弹性（聚餐、打车、购物）和其他。「吃饭」和「聚餐」分开，「交通」和「打车」分开，因为后一个是可以选择不花的。",
        "Third, categorize by nature, not by type. Breakfast, lunch and dinner answer no useful question; what you want to know is, if I had to cut back, what could go? So every expense category in Coast belongs to one of four roles — Fixed (rent, subscriptions), Essential (groceries, commute), Flexible (eating out, taxis, shopping) and Other. Keep meals apart from eating out, transit apart from taxis — the second of each is the one you can choose to skip.",
      ] },
      { tip: [
        "自定义分类时，名字和图标随便改，但它必须属于一个角色——这决定了它在 FIRE 计算里算什么：固定 + 必要是 Lean FI 的底数，弹性是你最能优化的地方。某一块花得多、想单独盯着（比如旅行、学习），可以拆成独立的一级分类，角色仍然选「弹性」。",
        "When you create a category, rename it and pick any icon, but give it a role — that decides what it counts as in the FIRE math: fixed + essential form the Lean FI base, flexible is where you have the most room. If one area is big enough to watch on its own (travel, learning), make it a top-level category and keep its role as Flexible.",
      ] },
    ],
  },
  {
    id: "record",
    title: ["记一笔：尽量不打断你", "Logging: stay out of your way"],
    blocks: [
      { p: [
        "点底部的「＋」打开记账面板：先选分类，再输金额。键盘自带加减乘除，一上来是 0，你按多少就显示多少；常用的账户会记住上次的选择。",
        "Tap + at the bottom to open the entry sheet: pick a category, then the amount. The keypad does arithmetic, starts at 0 and shows exactly what you type; your usual account is remembered.",
      ] },
      { list: [
        ["常记的条目存成模板，之后长按「＋」一步选用——房租、通勤、每天那杯咖啡都很适合。", "Save frequent entries as templates, then long-press + to use one in a single step — rent, commute, the daily coffee."],
        ["在支付宝、微信、云闪付的支付结果页截屏，用「截图记账」快捷指令自动记一笔，金额、时间、分类、账户都会填好。在「设置 → 截图记账」里设置，可以绑到操作按钮或控制中心。", "Screenshot a payment result in Alipay, WeChat Pay or UnionPay and let the Screenshot Capture shortcut log it — amount, time, category and account filled in. Set it up in Settings → Screenshot Capture and bind it to the Action button or Control Center."],
        ["小费、服务费、税费、手续费、优惠可以作为金额的标注一起记，不改变统计口径。刷卡时只输了小费比例、最后总价多少都不清楚的时候，这个特别有用。", "Tips, service fees, taxes, card fees and discounts can be recorded as labels on the amount without changing how it's counted — handy when you only entered a tip percentage at the card reader."],
        ["一笔钱里有别人的份，用「快速 AA」就地拆开；要报销的标成「待报销」，钱报下来之后核销，净支出自动变小。", "If part of a payment is someone else's, split it right there with Quick Split; mark work expenses as To Claim and settle them when the money comes back — your net spending drops automatically."],
      ] },
      { tip: [
        "从别的 App 搬过来？「设置 → 导入账单」支持 iCost、Cookie 记账、随手记、钱迹等导出的 Excel / CSV，会自动识别表头、跳过重复。导入只有流水、没有期初余额，导完记得做一次批量对账。",
        "Coming from another app? Settings → Import Entries takes Excel / CSV exports from iCost, Cookie, Suishouji, Qianji and more — headers detected, duplicates skipped. Imports carry entries but not starting balances, so do a Batch Reconcile afterwards.",
      ] },
    ],
  },
  {
    id: "home",
    title: ["首页：每一笔都有代价", "Home: every entry has a price"],
    blocks: [
      { img: "ledger", cap: ["账单页顶部的卡片可以左右滑：本月支出 ⇄ 财富自由目标", "Swipe the top card on Entries: spent this month ⇄ your freedom goal"] },
      { p: [
        "账单页顶上那张卡往左滑，是「距离财务自由」。试试记完一笔大额支出后回来看一眼——那个数字会动。钱已经花了，但把它换算成「晚自由几天」，下一次花钱之前你会多想一秒。",
        "Swipe the top card on the Entries tab to see your distance to financial freedom. Log a big purchase and come back — that number moves. The money's already spent, but seeing it as a few more days of work tends to make the next purchase a little more deliberate.",
      ] },
      { p: [
        "卡片下面的快速入口是「有就看一眼」的地方：待报销、AA 分账、计划（周期账单、分期、贷款）、转账、退款。显示哪些、用卡片还是胶囊样式，都能在设置里改。",
        "Below it are shortcuts to the things worth a glance: To Claim, Split Bills, Plans (recurring bills, installments, loans), Transfers and Refunds. Choose which ones show, and card or chip style, in Settings.",
      ] },
    ],
  },
  {
    id: "budget",
    title: ["预算：让过去的你帮你算", "Budgets: let your past do the math"],
    blocks: [
      { img: "budget", cap: ["展开本月支出卡看消费节奏：实线是实际花的，虚线是匀速该花的", "Expand the monthly card for Spending Pace: solid is what you spent, dashed is an even pace"] },
      { p: [
        "拉表格手动算预算，大多坚持不了几个月，所以 Coast 直接从你的历史里算。在预算页打开「智能预算」，选「重新生成」，会按最近 3 个月为每个分类给出额度。",
        "Hand-built budget spreadsheets rarely survive a few months, so Coast works it out from your history. Open Smart Budget on the budget page and choose Regenerate to get a limit for each category from the last three months.",
      ] },
      { list: [
        ["默认用中位数而不是平均数——上个月买了台电脑，不该被固化成以后每个月的预算。", "It uses the median, not the average — last month's laptop shouldn't become every month's budget."],
        ["在这个基础上可以拖动滑块再收紧一点。预算的意义往往是「比过去花得少」，照搬历史等于把旧习惯合理化。", "Then drag the slider to tighten it. A budget is usually about spending less than before; copying history just makes old habits official."],
        ["「铺满全年」会优先参考去年同月：春节、年货该高就高，匀速的全年预算是假的。", "Fill Year looks at the same month last year first — holiday months are supposed to be higher; a flat yearly budget is fiction."],
        ["总额合适、但分类之间分得不对时，用「再平衡」把额度从花不完的分类挪到真正在花的分类。", "If the total is right but the split isn't, Rebalance moves room from categories you never use up to the ones you do."],
      ] },
      { tip: [
        "预算就是个参考，超了也不用有负担。有用的是月中看一眼消费节奏：曲线跑到虚线上面，就知道这个月剩下的日子该收一收了。",
        "A budget is a reference; going over isn't a failure. What helps is a mid-month look at the pace: if the line is above the dashed one, you know to ease off for the rest of the month.",
      ] },
    ],
  },
  {
    id: "fire",
    title: ["FIRE 页：还有多久，怎样更快", "The FIRE tab: how long, and how to get there sooner"],
    blocks: [
      { img: "fire", cap: ["最大的数字不是余额，是「还有几年几个月」", "The biggest number isn't a balance; it's years and months to go"] },
      { p: [
        "记了资产，再有一段时间的收支，FIRE 页就能估出你离财务自由还有多久——按近 12 个月的平均开销、月均储蓄和一个中性的收益假设。点开数字下面那行年份，还能看到悲观和乐观情况下大概落在哪几年。",
        "Once you've recorded your assets and a few months of income and spending, the FIRE tab estimates how long until financial independence — from your average spending over the last 12 months, your average monthly savings and a neutral return assumption. Tap the years under the number to see where pessimistic and optimistic cases land.",
      ] },
      { p: [
        "接着拖一拖「试算」的滑块：每月少花 1000 能提前多久？收入涨两成呢？不用自己算，倒计时会实时告诉你。",
        "Then drag the What-If sliders: how much sooner if you spend ¥1,000 less a month? What about a 20% raise? No math needed — the countdown updates as you drag.",
      ] },
      { p: [
        "有一笔计划中的大额支出，或者在考虑换城市、跳槽、买房？把它加成一个「场景」，和现状并排比一比自由日会怎么动。这也是一种冷静期：想买的东西先放进来看看代价，过几天再决定。",
        "Planning a big purchase, or weighing a move, a new job or a home? Add it as a Scenario and compare your freedom date with today, side by side. It doubles as a cooling-off period: put the thing you want in, look at its price in time, decide in a few days.",
      ] },
      { list: [
        ["FI 进度里的两条线：Lean FI 是「活下去」，标准 FI 是「照现在这样活」。两条线之间的差额，就是生活方式的价钱。", "FI Progress shows two lines, Lean FI and Standard FI. The gap between them is the price of your lifestyle."],
        ["Coast FIRE 线跟「距目标退休」的年数联动：动一动年数，看晚退两年这条线能降多少——时间是它最大的杠杆。", "The Coast FIRE line moves with Until Target Retirement. Nudge the years and watch how far it drops if you retire two years later — time is its biggest lever."],
        ["Barista FIRE 里填一个你真愿意长期做的兼职收入，看半退休需要的资产会少多少。", "In Barista FIRE, enter part-time income you'd really keep doing and see how much less you'd need to semi-retire."],
        ["储蓄率是这些指标里唯一「这个月就能改」的，先从弹性分类下手。单月起伏不用紧张，看那条 12 个月的虚线往哪走就够了。", "Savings Rate is the one number you can change this month — start with Flexible categories. Ignore single-month swings; watch where the 12-month line is heading."],
        ["被动收入覆盖率到 100%，就是被动收入能覆盖停不下来那部分开销的那一天。", "Passive Income Coverage at 100% is the day passive income covers the spending you can't stop."],
      ] },
      { tip: [
        "4% 提取率是 30 年退休期的经验值。如果打算更早退休，可以在「设置 → FI 参数」里调低一点（比如 3.5%），结果会更稳妥。",
        "The 4% withdrawal rate is a rule of thumb for a 30-year retirement. Planning to stop earlier? Lower it a little in Settings → FI Parameters (3.5%, say) for a safer estimate.",
      ] },
    ],
  },
  {
    id: "review",
    title: ["数据页与资产页：回头看", "Data and Assets: looking back"],
    blocks: [
      { p: [
        "数据页按月、年、全部三个维度看收支。每个月初先看一眼「月度回顾」，它用几句话告诉你这个月结余多少、比上个月多花还是少花、变化最大的是哪一类。「分类构成」可以一路点进二级分类，看钱具体去了哪里。",
        "The Data tab looks at income and spending by month, year or all time. Start each month with the Monthly Review — a few sentences on what you saved, whether you spent more or less than last month, and which category moved most. Category Breakdown drills into subcategories so you can see where the money actually went.",
      ] },
      { p: [
        "「常买」会把同一样东西的历次价格收在一起：买了几次、通常多少钱、最低最高多少。同一杯奶茶在不同的日子、不同的券下价格能差不少，知道了「正常价」，才知道这次是不是买贵了。",
        "Repeat Buys gathers every price you've paid for the same thing: how often, the usual price, the lowest and highest. The same drink can swing a lot between days and coupons — once you know the normal price, you know when you've overpaid.",
      ] },
      { img: "assets", cap: ["资产页：净资产、资产变化、资产组成三种看法", "Assets: net worth, changes and breakdown"] },
      { p: [
        "资产页的数字和 FIRE 页同源：以最近一次校准的余额为锚，加上之后的所有流水。每月 1 号 Coast 会提醒你对一次账——花一分钟把各账户的真实余额填进去，净资产曲线就一直是准的。",
        "The Assets tab shares its numbers with the FIRE tab: your last calibrated balances plus every entry since. On the 1st of each month Coast reminds you to reconcile — a minute entering real balances keeps the net worth curve honest.",
      ] },
    ],
  },
  {
    id: "split",
    title: ["AA 分账：人情账也算清", "Split Bills: settle up without the awkwardness"],
    blocks: [
      { p: [
        "和朋友吃饭、合租、一起旅行，长按「＋」选「AA 分账」：可以平均分、按金额、按比例分。你付了等别人还，或者别人付了你来还，两个方向都能记。",
        "Dinner with friends, a shared flat, a group trip: long-press + and choose Split Bill. Split evenly, by amount or by percentage, whether you paid or someone else did.",
      ] },
      { p: [
        "分账中心按人列出谁欠你、你欠谁，钱到了点一下结清，或者一键全部结算，对应账户的余额会跟着变。常一起分账的人会被记住，下次直接选。",
        "The split center lists who owes you and whom you owe, by person. Settle one entry, or Settle All, when the money arrives, and the account balance updates with it. People you split with are remembered for next time.",
      ] },
      { tip: [
        "AA 只把你自己那份算作支出：一顿 400 的饭四个人分，你的账里是 100，预算和 FIRE 也按 100 算。",
        "Only your share counts as spending: a ¥400 dinner split four ways is ¥100 in your books — and ¥100 in your budget and FIRE numbers.",
      ] },
    ],
  },
  {
    id: "privacy",
    title: ["数据在你自己手里", "Your data stays yours"],
    blocks: [
      { list: [
        ["没有账号、没有服务器、没有追踪。账单只在你的设备和你自己的 iCloud 里。", "No account, no server, no tracking. Your entries live only on your devices and in your own iCloud."],
        ["开启 iCloud 同步后，iPhone、iPad、Mac 之间自动同步。iPad 和 Mac 上是大屏布局，横屏时左边是侧边栏。", "Turn on iCloud sync and your iPhone, iPad and Mac stay in step. iPad and Mac get a big-screen layout, with a sidebar in landscape."],
        ["每日自动备份独立于 iCloud 同步，保留最近 10 份，在「文件」App → iCloud 云盘 → Coast 里能找到，任何一天都能整体恢复。", "Daily automatic backups are separate from iCloud sync, keep the latest 10 and appear in Files → iCloud Drive → Coast — restore any day in full."],
        ["在别人面前打开 App？点眼睛图标隐藏金额；也可以在设置里打开「后台模糊」，切到多任务界面时整屏糊掉。", "Opening the app around other people? Tap the eye to hide amounts, or turn on Blur in background so the app switcher shows nothing."],
      ] },
    ],
  },
]

const PRO_NOTE: L = [
  "试算滑块、场景模拟、达成区间、Coast / Barista FIRE、完整月度回顾、常买、分类预算和多币种属于 Coast Pro，其余功能都可以免费使用。",
  "What-If sliders, Scenarios, the achievement range, Coast / Barista FIRE, the full Monthly Review, Repeat Buys, category budgets and multi-currency are part of Coast Pro; everything else is free.",
]

export default function Guide() {
  const { t, lang } = useLang()
  const pick = (x: L) => (lang === "zh" ? x[0] : x[1])
  const num = (i: number) => String(i + 1).padStart(2, "0")

  return (
    <DocPage
      title={t("使用手册", "Manual")}
      subtitle={t("不是按钮说明书，是一套让记账真正有用的思路。", "Less a button reference, more a way to make tracking actually useful.")}
    >
      <p className="leading-relaxed text-muted-foreground">
        {t(
          "Coast 是一个记了 10 年账的人做给自己用的记账 App。下面先讲记账的终点是什么，再讲怎么记最省力，最后一页一页带你看功能——大部分小节都附了一个可以马上试的小动作。",
          "Coast was built by someone who tracked every expense for ten years and wanted more out of it. First the destination, then how to record with the least effort, then a page-by-page tour — most sections end with something you can try right away.",
        )}
      </p>

      <nav className="mt-8 rounded-2xl border border-border p-5">
        <div className="mb-3 font-sans text-xs font-bold uppercase tracking-[.12em] text-primary">{t("目录", "Contents")}</div>
        <ol className="grid gap-1.5 text-[15px] sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">
                <span className="mr-2 tabular-nums text-primary">{num(i)}</span>
                {pick(s.title)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {SECTIONS.map((s, i) => (
        <section key={s.id} id={s.id} className="scroll-mt-28 pt-14">
          <div className="font-sans text-xs font-bold tabular-nums tracking-[.12em] text-primary">{num(i)}</div>
          <h2 className="mt-1 text-2xl font-semibold">{pick(s.title)}</h2>
          <div className="mt-4 space-y-4">
            {s.blocks.map((b, j) => {
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
                      <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-border" />
                      <span>{pick(it)}</span>
                    </li>
                  ))}
                </ul>
              )
              return (
                <figure key={j} className="py-4">
                  <Device src={screen(b.img, lang)} alt={pick(b.cap)} width={240} />
                  <figcaption className="mt-3 text-center text-sm text-muted-foreground">{pick(b.cap)}</figcaption>
                </figure>
              )
            })}
          </div>
        </section>
      ))}

      <section className="pt-14">
        <p className="text-sm leading-relaxed text-muted-foreground">{pick(PRO_NOTE)}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {t("还有想不明白的地方，或者有一个「我天天遇到、你可能没想到」的记账场景，直接写信：", "Stuck on something, or have a situation you run into every day that we may not have thought of? Write to us: ")}
          <a href={`mailto:${MAIL}`} className="text-primary hover:underline">{MAIL}</a>
        </p>
      </section>
    </DocPage>
  )
}
