import { DocPage } from "@/components/site/Shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLang } from "@/lib/i18n"

/** [中文标题, 中文说明, 英文标题, 英文说明] */
type Item = [string, string, string, string]
type Section = { title: [string, string]; style?: "cards" | "list"; items: Item[] }
type Version = { v: string; date: [string, string]; intro: [string, string]; sections: Section[] }

const VERSIONS: Version[] = [
  {
    v: "1.0.1",
    date: ["2026 年 9 月", "September 2026"],
    intro: [
      "上线后的第一轮修补。大部分改动来自前两周的真实使用：钱算错的地方一个不留，字太小的地方全库排查，计划类的东西收进一个页面。",
      "The first round after launch. Most of it comes from two weeks of real use: every place money was miscounted is fixed, tiny text was hunted down app-wide, and everything plan-shaped now lives on one screen.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["计划中心", "周期账单、分期、贷款三套管理合成一个页面。贷款每期自动拆成利息支出 + 本金转账，建贷款时顺手建出负债账户；支持提前还款，单期可以只改「此期及以后」。", "Plan Center", "Recurring bills, installments and loans now share one screen. Each loan payment splits into interest expense + principal transfer, a liability account is created with the loan, early repayment is supported, and a single period can be edited \"from here on\"."],
        ["报销面板能回头", "看得见已记的每一笔报销，能改能删，不再是记完就消失。", "Reimbursements you can revisit", "Every recorded reimbursement is visible, editable and deletable instead of vanishing once entered."],
        ["常买清单加分类筛选", "左栏按一二级分类筛，右侧两列瀑布；账单详情页也能直接看这件东西的常买记录。", "Repeat-buy filters", "Filter repeat buys by category and subcategory; an entry's detail page now shows the repeat-buy history for that item."],
        ["图表默认换成列表", "两张「图形和数字对不上」的图改成能直接比大小的列表，图形退为可选概览；折线全部改回圆滑。", "Lists first, charts optional", "Two charts that were easy to misread now default to sortable lists with the chart as an optional overview; all line charts are smooth again."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["设置页重做", "会员卡补回层次，关于页只留它独有的东西，设置行的图标不再又小又细。", "Settings redesigned", "The membership card has hierarchy again, About keeps only what's unique to it, and settings icons are no longer tiny and thin."],
        ["超小字全库排查", "32 处缩放里 14 处会掉到 11pt 以下，全部收回到可读档位；金额和变化值统一成语义组件。", "Tiny text, app-wide", "14 of 32 scaling sites could drop below 11pt; all are back at readable sizes, and amounts and deltas now share one component."],
        ["首页与资产页细节", "两张主角卡不再错开 8pt，资产卡切页时表头不再跳，进度环入场不再扫、末尾不再跳色。", "Home and Assets polish", "The two hero cards line up, the assets card header no longer jumps between pages, and the progress ring enters cleanly."],
      ] },
      { title: ["修复", "Fixed"], style: "list", items: [
        ["兑换码换来的永久解锁，冷启动后会丢", "", "Lifetime unlocks from offer codes could disappear after a cold start", ""],
        ["订阅查询通道失灵时，付费用户被锁在外面", "", "Subscribers could be locked out when one entitlement query failed", ""],
        ["退款「不指定账户」会静默吃掉一笔净资产", "", "A refund with no account silently removed net worth", ""],
        ["编辑收入会丢分类；币种列表里美元出现三次", "", "Editing an income lost its category; USD appeared three times in the currency list", ""],
        ["改已有账单的币种不生效", "", "Changing an existing entry's currency didn't stick", ""],
        ["金额键盘对预填值是「续写」：填着 200 的框里按 4 得到 2004", "", "The amount keypad appended to prefilled values: typing 4 into 200 gave 2004", ""],
        ["输入法候选词没提交就丢；进后台再回来输入没了", "", "Pending IME text was dropped; input vanished after returning from the background", ""],
        ["计划编辑页 31 号锚点显示漂月漂年；删贷款计划留下孤儿账户", "", "Day-31 anchors drifted by a month or year in plan editing; deleting a loan plan left an orphan account", ""],
        ["计划中心周期账单卡片显示假 100%，徽章漏数活跃周期账单", "", "Recurring cards in Plan Center showed a false 100%; the badge undercounted active recurring bills", ""],
        ["储蓄率卡三处对不上：柱子画了全历史、正值不是收入色、均线画成折线", "", "Savings-rate card: bars covered all history, positives weren't income-colored, the average line was drawn wrong", ""],
      ] },
    ],
  },
  {
    v: "1.0",
    date: ["2026 年 8 月", "August 2026"],
    intro: [
      "首个正式版本。Coast 是一款以 FIRE（财务自由）进度为核心的记账 App，记账只是输入手段，真正回答的问题是「我离财务自由还有多远」。",
      "The first release. Coast is a personal finance app built around FIRE progress. Tracking spending is just the input; the real question it answers is \"how far am I from financial freedom?\"",
    ],
    sections: [
      { title: ["记账", "Transactions"], items: [
        ["快速记账", "从任意页面一键唤起，金额 → 分类 → 完成，三步搞定。支持分期、手续费、AA 分摊、借入借出。", "Quick Add", "One-tap entry from any screen. Amount, category, done. Supports installments, fees, split bills, and IOUs."],
        ["周期账单", "自动发现重复消费模式，一次设置、每月自动入账。再也不用手动记房租、订阅费。", "Recurring Transactions", "Automatically detects spending patterns. Set it once, and rent, subscriptions, and bills are logged each month."],
        ["CSV 导入", "支持从支付平台和其他记账工具导出的 CSV / XLSX 一键导入，自动匹配分类、去重、识别转账。历史账单冷启动不再是问题。", "CSV Import", "Import CSV / XLSX exports from payment platforms and other expense tools. Auto-categorizes, deduplicates, and detects transfers."],
        ["分期中心", "所有进行中的分期一目了然：已还多少、还剩多少、每期金额与手续费。", "Installment Center", "All active installments at a glance: how much paid, how much left, per-period amount and fees."],
      ] },
      { title: ["数据", "Insights"], items: [
        ["月度数据面板", "收支趋势、分类环形图、预算执行率、储蓄率，一屏看清这个月的财务全貌。", "Monthly Dashboard", "Income and expense trends, category donut chart, budget progress, savings rate on one screen."],
        ["预算", "按分类设预算，实时追踪剩余额度。超支时在账单页直接标红提醒。", "Budgets", "Set budgets by category, track remaining balance in real time. Over-budget items are flagged on the transaction list."],
        ["日历视图", "日历上每一天标记有无账单，点击查看当日明细，月度节奏一目了然。", "Calendar View", "Each day on the calendar is marked with transactions. Tap to see the daily breakdown."],
      ] },
      { title: ["资产", "Assets"], items: [
        ["资产快照", "每月记录各账户余额，自动生成净资产曲线。支持多币种、自动汇率折算。", "Asset Snapshots", "Record account balances each month to build a net worth curve. Multi-currency with automatic conversion."],
        ["资产类型", "现金及等价物、投资（股票、基金、理财）、负债（信用卡、贷款），按类别汇总。", "Asset Types", "Cash and equivalents, investments, liabilities, aggregated by type."],
      ] },
      { title: ["FIRE 进度", "FIRE Progress"], items: [
        ["FI 仪表盘", "实时计算 Lean FI、标准 FI 数字与进度百分比，追踪 Coast FIRE、Barista FIRE 状态。", "FI Dashboard", "Real-time Lean FI and Standard FI numbers with progress. Tracks Coast FIRE and Barista FIRE status."],
        ["储蓄率追踪", "当月储蓄率 + 12 月移动平均，FIRE 践行者最关心的第一指标。", "Savings Rate", "Current month savings rate plus 12-month moving average."],
        ["被动收入覆盖率", "被动收入占必要支出的比例，100% 就是你不用上班的那一天。", "Passive Income Coverage", "Passive income over essential expenses. At 100%, that's the day you no longer need a paycheck."],
      ] },
      { title: ["更多", "And More"], style: "list", items: [
        ["iCloud 同步", "多设备无缝切换，数据只存你自己的 iCloud 私有库", "iCloud Sync", "Seamless multi-device, stored only in your personal iCloud private database"],
        ["备份与恢复", "本地 JSON 备份，随时导出、导入", "Backup & Restore", "Local JSON backups, export and import anytime"],
        ["深色模式", "跟随系统或手动切换", "Dark Mode", "Follows system setting or manual toggle"],
        ["多主题", "多套配色可选", "Themes", "Multiple color schemes"],
        ["中英双语", "应用内随时切换", "Bilingual", "Switch between Chinese and English in-app"],
        ["分类管理", "自定义分类、图标、排序，支持二级分类", "Category Management", "Custom categories, icons, sorting, with subcategories"],
        ["常买小票", "高频消费一键复用", "Frequent Purchases", "One-tap reuse for recurring buys"],
        ["隐私优先", "无账号、无服务器、无追踪，你的数据只属于你", "Privacy First", "No accounts, no servers, no tracking"],
      ] },
    ],
  },
]

export default function Changelog() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  return (
    <DocPage title={t("Coast 更新日志", "Coast Changelog")} subtitle={t("每一次更新，都离自由更近一步。", "Every update, one step closer to freedom.")}>
      {VERSIONS.map((ver, vi) => (
        <section key={ver.v} id={`v${ver.v}`}>
          {vi > 0 && <Separator className="my-14" />}
          <div className="flex items-center gap-3">
            <Badge variant={vi === 0 ? "default" : "secondary"} className="text-sm">{ver.v}</Badge>
            <span className="text-sm text-muted-foreground">{z ? ver.date[0] : ver.date[1]}</span>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">{z ? ver.intro[0] : ver.intro[1]}</p>
          {ver.sections.map((g) => (
            <div key={g.title[0]} className="mt-10">
              <h2 className="mb-3 text-lg font-semibold">{z ? g.title[0] : g.title[1]}</h2>
              {g.style === "list" ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <li key={it[0]} className="rounded-lg border border-border px-3.5 py-2.5 text-sm">
                      <b>{z ? it[0] : it[2]}</b>{(z ? it[1] : it[3]) && <span className="text-muted-foreground"> · {z ? it[1] : it[3]}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid gap-3">
                  {g.items.map((it) => (
                    <Card key={it[0]} size="sm"><CardContent>
                      <h3 className="font-sans text-[15px] font-semibold tracking-normal">{z ? it[0] : it[2]}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{z ? it[1] : it[3]}</p>
                    </CardContent></Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}
    </DocPage>
  )
}
