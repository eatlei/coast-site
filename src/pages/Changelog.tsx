import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DocPage } from "@/components/site/Shell"
import { BASE, useLang } from "@/lib/i18n"

/** [中文标题, 中文说明, 英文标题, 英文说明]；说明可为空 */
type Item = [string, string, string, string]
type Section = { title: [string, string]; items: Item[] }
type Version = { v: string; date: [string, string]; intro: [string, string]; sections: Section[] }

const VERSIONS: Version[] = [
  {
    v: "1.0.4",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "标签从「只能打」升级到「能改、能归档、能看花了多少」；多币种转为免费；图表统一了一遍。",
      "Tags grow up: rename, archive, and see where each tag's money went. Multi-currency is now free. Charts got a consistency pass.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["标签升级", "标签能改名、合并、归档、加图标了。数据页 → 标签卡 → 管理。", "Tags, upgraded", "Rename, merge, archive and add icons. Data tab → Tags card → Manage."],
        ["标签详情", "点任一标签，按月 / 年 / 全部看这个标签的支出、笔数和跨月柱图；下方「花在哪」按分类列出金额和占比，待报销也算进去。", "Tag detail", "Tap any tag to see its spending, entry count and a month-by-month bar chart; \"Where it went\" below breaks it down by category, pending reimbursements included."],
        ["多币种转为免费", "多币种账户与每日汇率不再需要 Pro。", "Multi-currency is now free", "Multi-currency accounts and daily rates no longer require Pro."],
        ["净资产卡新增三项", "投资占比、月均支出、应急金能撑几个月。资产页顶部卡片。", "Three new net-worth metrics", "Investment share, average monthly spending, and how many months your emergency fund covers. Top card on the Assets tab."],
        ["负债水位有了档位", "健康 / 稳健……以及离下一档还有多远。", "Debt level tiers", "Healthy, Steady… and how far to the next one."],
        ["设置页新增入口", "使用指南、FAQ、更新日志一键直达。", "Links in Settings", "Guide, FAQ and changelog, one tap away."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["图表统一", "实色柱、超阈值换色、真零基线、柱宽封顶，各页图表同一套画法。", "Charts, unified", "Solid bars, threshold colors, a true zero baseline, capped bar width — one style across every tab."],
        ["动效更利落", "29 处动画曲线改回统一档位；开启「减弱动态效果」后只淡入不位移。", "Snappier motion", "29 animations back on the standard curves; with Reduce Motion on, cards fade in without moving."],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["年视图里月份标签与柱子错位、折线末端不到当月（iOS 27）", "", "Month labels misaligned with bars in year view, and the line ending short of the current month (iOS 27)", ""],
        ["关掉设置弹窗后底部标签栏发灰", "", "Tab bar stayed dimmed after closing Settings", ""],
        ["iCloud 同步把已报销的 AA 账单清成未报销", "", "iCloud sync reset settled split bills to unsettled", ""],
        ["自动备份漏了五张表和四处字段", "", "Automatic backups missed five tables and four fields", ""],
        ["英文界面里露出半句中文", "", "Stray Chinese text in the English interface", ""],
      ] },
    ],
  },
  {
    v: "1.0.3",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "AA 分账上线，iPad 和 Mac 有了大屏版，全 App 再提一次速。",
      "Split bills arrive, iPad and Mac get a big-screen layout, and the whole app gets faster again.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["AA 分账", "多人分摊一笔账，平均、按金额、按比例都行；我付了等别人还、别人付了我来还，两个方向都能记。分账中心按人列出待收待付，单笔或一键结清，账户余额自动同步。", "Split Bills", "Split an expense evenly, by amount or by percentage — whether you paid or someone else did. Split Center groups what you're owed and what you owe by person; settle one or all, and account balances update automatically."],
        ["iPad 与 Mac", "支持 iPad，Mac 上窗口可自由缩放；大屏用侧边栏导航，数据页和 FIRE 页卡片分两列。", "iPad & Mac", "Now on iPad, with a resizable window on Mac; sidebar navigation and two-column cards on larger screens."],
        ["长按加号", "直接选记一笔、用模板，或发起 AA。", "Long-press +", "Log an entry, use a template, or start a split."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["金额输入", "从 0 开始，输入多少显示多少，不再自动补 .00。", "Amount entry", "Starts at 0 and shows exactly what you type — no more automatic .00."],
        ["设置入口统一", "四个页面右上角都能直接进设置。", "Settings, everywhere", "One tap from the top-right of every tab."],
        ["更快更顺", "切换页面、滑动列表、打开记账面板都更快。", "Faster", "Quicker tab switching, smoother scrolling, a faster entry sheet."],
        ["记账面板里的就地拆账改名为「快速 AA」", "", "The in-entry split is now called \"Quick Split\"", ""],
        ["自动备份包含按月单独设置的预算", "", "Automatic backups now include budgets set for individual months", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["备注只有空格时，账单标题显示为空白", "", "Blank entry titles when a note contained only spaces", ""],
        ["小屏上记账金额「符号大、数字小」", "", "Large currency symbol with small digits on small screens", ""],
        ["iOS 26 上长按加号没有反应", "", "Long-press on + not responding on iOS 26", ""],
        ["Coast FIRE 提示里露出格式符号", "", "Formatting symbols showing in a Coast FIRE tip", ""],
      ] },
    ],
  },
  {
    v: "1.0.2",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "修复 App Store 会员购买相关的问题。已经买过的不用再买一次。",
      "Fixes for membership purchases on the App Store. If you already bought it, you never need to buy it again.",
    ],
    sections: [
      { title: ["修复", "Fixed"], items: [
        ["会员购买与恢复", "", "Membership purchase and restore", ""],
      ] },
    ],
  },
  {
    v: "1.0.1",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "上线后的第一轮修补：钱算错的地方一个不留，字太小的地方全库排查，计划类的东西收进一个页面。",
      "First round after launch: every miscounted number fixed, tiny text hunted down app-wide, and everything plan-shaped on one screen.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["计划中心", "周期账单、分期、贷款合成一个页面。贷款每期自动拆成利息 + 本金，建贷款时顺手建出负债账户，支持提前还款。", "Plan Center", "Recurring bills, installments and loans on one screen. Loan payments split into interest + principal, a liability account is created with the loan, early repayment supported."],
        ["报销可回头", "已记的每一笔报销都看得见，能改能删。", "Reimbursements you can revisit", "Every recorded reimbursement is visible, editable and deletable."],
        ["常买清单筛选", "按一二级分类筛，账单详情也能看这件东西的常买记录。", "Repeat-buy filters", "Filter by category; an entry's detail page shows repeat-buy history for that item."],
        ["图表默认改列表", "两张易误读的图改成能直接比大小的列表，图形退为可选。", "Lists first", "Two easy-to-misread charts now default to sortable lists, with the chart optional."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["设置页重做", "会员卡补回层次，设置行图标不再又小又细。", "Settings redesigned", "The membership card has hierarchy again; settings icons are no longer tiny."],
        ["超小字全库排查", "14 处会掉到 11pt 以下的文字全部收回可读档位。", "Tiny text, app-wide", "14 places that could drop below 11pt are back at readable sizes."],
        ["首页与资产页对齐", "主角卡不再错开，资产卡表头不再跳，进度环入场干净。", "Home and Assets polish", "Hero cards line up, the assets header stops jumping, the progress ring enters cleanly."],
        ["折线全部圆滑", "", "Smooth line charts", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["兑换码换来的永久解锁，冷启动后丢失", "", "Lifetime unlocks from offer codes lost after a cold start", ""],
        ["订阅查询通道失灵时，付费用户被锁在外面", "", "Subscribers locked out when one entitlement query failed", ""],
        ["退款不指定账户时静默吃掉一笔净资产", "", "A refund with no account silently removed net worth", ""],
        ["编辑收入丢分类；币种列表美元出现三次", "", "Editing income lost its category; USD listed three times", ""],
        ["改已有账单的币种不生效", "", "Changing an entry's currency didn't stick", ""],
        ["金额键盘在预填值后续写：200 按 4 得到 2004", "", "Keypad appended to prefilled amounts: 200 then 4 gave 2004", ""],
        ["输入法候选词丢失；进后台再回来输入没了", "", "Pending IME text dropped; input lost after backgrounding", ""],
        ["计划编辑 31 号锚点漂月漂年；删贷款计划留下孤儿账户", "", "Day-31 anchors drifted; deleting a loan plan left an orphan account", ""],
        ["计划中心周期账单显示假 100%", "", "Plan Center showed a false 100% on recurring cards", ""],
        ["储蓄率卡：柱子画了全历史、正值颜色不对、均线画错", "", "Savings-rate card drew all history, wrong positive color, wrong average line", ""],
      ] },
    ],
  },
  {
    v: "1.0",
    date: ["2026 年 8 月", "Aug 2026"],
    intro: [
      "首个正式版本。记账只是输入手段，真正回答的问题是「我离财务自由还有多远」。",
      "The first release. Tracking spending is the input; the real question is \"how far am I from financial freedom?\"",
    ],
    sections: [
      { title: ["记账", "Tracking"], items: [
        ["快速记账", "任意页面一键唤起，三步搞定；支持分期、手续费、AA 分摊、借入借出。", "Quick Add", "One tap from any screen, three steps; installments, fees, splits, IOUs."],
        ["周期账单", "自动发现重复消费，一次设置每月自动入账。", "Recurring", "Detects repeat spending; set once, logged monthly."],
        ["CSV 导入", "支付平台和其他记账工具导出的 CSV / XLSX 一键导入，自动匹配分类、去重、识别转账。", "CSV import", "Import CSV / XLSX from payment platforms and other tools; auto-categorize, dedupe, detect transfers."],
        ["分期中心", "已还多少、还剩多少、每期金额与手续费。", "Installments", "Paid, remaining, per-period amount and fees."],
      ] },
      { title: ["数据", "Insights"], items: [
        ["月度数据面板", "收支趋势、分类环形图、预算执行率、储蓄率。", "Monthly dashboard", "Trends, category donut, budget progress, savings rate."],
        ["预算", "按分类设预算，超支在账单页标红。", "Budgets", "Per-category budgets; overspend flagged in the list."],
        ["日历视图", "每天标记有无账单，点开看当日明细。", "Calendar", "Daily markers with tap-through detail."],
      ] },
      { title: ["资产", "Assets"], items: [
        ["资产快照", "每月记录余额，自动生成净资产曲线；多币种自动折算。", "Snapshots", "Monthly balances build a net worth curve; multi-currency converted."],
        ["资产类型", "现金、投资、负债按类别汇总。", "Asset types", "Cash, investments, liabilities aggregated by type."],
      ] },
      { title: ["FIRE", "FIRE"], items: [
        ["FI 仪表盘", "Lean FI / 标准 FI 与进度，追踪 Coast FIRE、Barista FIRE。", "FI dashboard", "Lean / Standard FI with progress; Coast and Barista FIRE."],
        ["储蓄率", "当月 + 12 月移动平均。", "Savings rate", "This month plus 12-month average."],
        ["被动收入覆盖率", "到 100% 就是不用上班的那一天。", "Passive coverage", "At 100%, you no longer need a paycheck."],
      ] },
      { title: ["其他", "More"], items: [
        ["iCloud 同步、JSON 备份与恢复", "", "iCloud sync, JSON backup and restore", ""],
        ["深色模式、多主题、中英双语", "", "Dark mode, themes, bilingual", ""],
        ["自定义分类与二级分类、常买小票", "", "Custom categories with subcategories, frequent purchases", ""],
        ["无账号、无服务器、无追踪", "", "No account, no server, no tracking", ""],
      ] },
    ],
  },
]

/** 开发计划：写在更新日志顶部。只写大功能和它的思路，不写修修补补；
 *  免费 / 会员的划分是产品决定（2026-09-21 定案），不是按实现难度分的 */
const ROADMAP: { tier: "free" | "pro"; zh: [string, string]; en: [string, string] }[] = [
  { tier: "pro", zh: ["AI 分析", "不是把数字再念一遍，而是替你读懂它：「本月弹性支出比均值多 ¥2,400，自由日往后推了 11 天」；哪一笔偏离了你的习惯、哪个分类在悄悄长大，它先看见。想问什么就问：「去年在衣服上花了多少」，直接给答案，不用翻账。"], en: ["AI insights", "Not a recap of numbers — a read on what they mean: \"flexible spending ran ¥2,400 over your average this month; your freedom date moved 11 days.\" It spots the entry that broke your pattern and the category quietly growing. Ask anything — \"how much on clothes last year?\" — and get the answer, not a spreadsheet."] },
  { tier: "free", zh: ["多维度分析", "分类、账户、标签、时段，任意两个维度交叉着看：出差标签下的餐饮，信用卡上的固定支出，今年 vs 去年同期。同一份账，想从哪个角度切都行——数据本来就是你的，怎么看也该由你定。"], en: ["Analysis in every dimension", "Cross any two of category, account, tag and period: dining under the Business Trip tag, fixed costs on the credit card, this year against last. One ledger, any angle — it's your data; how you look at it should be your call."] },
  { tier: "pro", zh: ["投资持仓与收益", "FIRE 的分子是资产，可现在投资账户只是一个手填的余额。持仓、成本、收益率记进来，被动收入就有了真实来源——「被动收入覆盖率」不再是估的，自由日也跟着更准。"], en: ["Holdings and returns", "Assets are the numerator of FIRE, yet today an investment account is just a balance you type in. Track positions, cost and return, and passive income finally has a real source — coverage stops being an estimate, and so does your freedom date."] },
  { tier: "pro", zh: ["家庭共享账本", "两个人一本账，一个自由日。各记各的，合起来看；谁付了什么、家里的净资产、离目标还有多远，两台手机上是同一个数——通过 iCloud 共享，数据仍然不经过任何服务器。"], en: ["Shared household ledger", "Two people, one ledger, one freedom date. Log separately, see it together: who paid what, the household's net worth, how far to go — the same numbers on both phones, shared through iCloud with no server in between."] },
  { tier: "free", zh: ["储蓄目标", "自由日太远，中间得有里程碑：六个月的应急金、一笔首付、下一次旅行。每个目标一条进度、一个日期，和总目标用同一套算法——你会知道这个月的每一笔存款，具体在推动哪一个。"], en: ["Savings goals", "Freedom is far; you need milestones on the way: six months of emergency fund, a down payment, the next trip. Each goal gets its own progress and date, on the same math as the big one — so you know exactly which goal this month's savings just moved."] },
  { tier: "free", zh: ["年度总结", "一年过去，一页说清：花了多少、存了多少、哪个月最克制、自由日往前挪了几天。做成可以分享的样子——给自己复盘，也给别人看看你走了多远。"], en: ["Year in review", "A year, on one page: what you spent, what you saved, your most disciplined month, how many days your freedom date moved. Made to share — a review for you, and proof of how far you've come."] },
  { tier: "free", zh: ["AA 分账：拍照识别", "一张小票拍下来，菜品自动逐行认出，谁点了什么勾一下就分好——不用再手动敲每一项。识别在手机本地完成，不上传。"], en: ["Split bills from a photo", "Snap the receipt, every line item is recognised, tick who had what and the split is done — no more typing each item. Recognition runs on your phone; nothing is uploaded."] },
]

/** 七张卡横向滑动，不平铺——平铺占了大半屏，更新日志本身反而被推到下面。
 *  手机上手指滑，桌面上给两个箭头（触控板横滑也行，但不是每个人都知道） */
function Roadmap() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  const rail = React.useRef<HTMLDivElement>(null)
  const step = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * 316, behavior: "smooth" })
  return (
    <section id="roadmap" className="grid gap-6 py-12 first:pt-2 md:grid-cols-[200px_1fr] md:gap-12">
      <div className="md:sticky md:top-24 md:self-start">
        <div className="font-heading text-[44px] leading-none">{t("计划中", "Next")}</div>
        <div className="mt-2 text-sm text-muted-foreground">{t("接下来要做的大功能", "What's coming")}</div>
      </div>
      <div className="min-w-0">
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-[640px] leading-relaxed text-muted-foreground">{t("只列大功能和做它的理由。顺序不代表先后，做到哪一步会在这里更新。", "Only the big ones, and why. Order isn't priority; this list updates as each one lands.")}</p>
          <div className="hidden shrink-0 gap-2 md:flex">
            <button type="button" onClick={() => step(-1)} aria-label={t("上一张", "Previous")} className="grid size-9 place-items-center rounded-full border border-rule bg-card text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
            <button type="button" onClick={() => step(1)} aria-label={t("下一张", "Next")} className="grid size-9 place-items-center rounded-full border border-rule bg-card text-muted-foreground hover:text-foreground"><ChevronRight className="size-4" /></button>
          </div>
        </div>
        <div ref={rail} className="-mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:thin] md:mx-0 md:px-0">
          {ROADMAP.map((r) => (
            <div key={r.zh[0]} className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-rule bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{z ? r.zh[0] : r.en[0]}</div>
                <span className={`tag rounded-full px-2 py-0.5 text-[11px] ${r.tier === "pro" ? "bg-muted text-primary" : "bg-muted text-muted-foreground"}`}>{r.tier === "pro" ? "Pro" : t("免费", "Free")}</span>
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{z ? r.zh[1] : r.en[1]}</p>
            </div>
          ))}
        </div>
        <a href={`${BASE}contact.html`} className="tag mt-4 inline-block text-primary hover:underline">{t("还有想要的功能？告诉我 →", "Want something else? Tell me →")}</a>
      </div>
    </section>
  )
}

export default function Changelog() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  return (
    <DocPage wide title={t("更新日志", "Changelog")} subtitle={t("每一次更新，都离自由更近一步。", "Every update, one step closer to freedom.")}>
      <div className="divide-y divide-border">
        <Roadmap />
        {VERSIONS.map((ver) => (
          <section key={ver.v} id={`v${ver.v}`} className="grid gap-6 py-12 first:pt-2 md:grid-cols-[200px_1fr] md:gap-12">
            <div className="md:sticky md:top-24 md:self-start">
              <div className="font-heading text-[44px] leading-none">{ver.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{z ? ver.date[0] : ver.date[1]}</div>
            </div>
            <div>
              <p className="max-w-[640px] leading-relaxed text-muted-foreground">{z ? ver.intro[0] : ver.intro[1]}</p>
              {ver.sections.map((g) => (
                <div key={g.title[0]} className="mt-8">
                  <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-[.12em] text-primary">{z ? g.title[0] : g.title[1]}</h2>
                  <ul className="space-y-2">
                    {g.items.map((it) => {
                      const title = z ? it[0] : it[2], body = z ? it[1] : it[3]
                      return (
                        <li key={it[0]} className="flex gap-3 text-[15px] leading-relaxed">
                          <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-border" />
                          <span><span className="font-medium">{title}</span>{body && <span className="text-muted-foreground">　{body}</span>}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocPage>
  )
}
