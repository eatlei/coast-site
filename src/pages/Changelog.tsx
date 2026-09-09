import { DocPage } from "@/components/site/Shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useLang } from "@/lib/i18n"

type Group = { title: [string, string]; items: [string, string, string, string][] }
const GROUPS: Group[] = [
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
]
const MORE: [string, string, string, string][] = [
  ["iCloud 同步", "多设备无缝切换，数据只存你自己的 iCloud 私有库", "iCloud Sync", "Seamless multi-device, stored only in your personal iCloud private database"],
  ["备份与恢复", "本地 JSON 备份，随时导出、导入", "Backup & Restore", "Local JSON backups, export and import anytime"],
  ["深色模式", "跟随系统或手动切换", "Dark Mode", "Follows system setting or manual toggle"],
  ["多主题", "多套配色可选", "Themes", "Multiple color schemes"],
  ["中英双语", "应用内随时切换", "Bilingual", "Switch between Chinese and English in-app"],
  ["分类管理", "自定义分类、图标、排序，支持二级分类", "Category Management", "Custom categories, icons, sorting, with subcategories"],
  ["常买小票", "高频消费一键复用", "Frequent Purchases", "One-tap reuse for recurring buys"],
  ["隐私优先", "无账号、无服务器、无追踪，你的数据只属于你", "Privacy First", "No accounts, no servers, no tracking"],
]

export default function Changelog() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  return (
    <DocPage title={t("Coast 更新日志", "Coast Changelog")} subtitle={t("每一次更新，都离自由更近一步。", "Every update, one step closer to freedom.")}>
      <div className="flex items-center gap-3"><Badge className="text-sm">1.0</Badge><span className="text-sm text-muted-foreground">{t("2026 年 8 月", "August 2026")}</span></div>
      <p className="mt-4 leading-relaxed text-muted-foreground">{t("首个正式版本。Coast 是一款以 FIRE（财务自由）进度为核心的记账 App，记账只是输入手段，真正回答的问题是「我离财务自由还有多远」。",
        "The first release. Coast is a personal finance app built around FIRE progress. Tracking spending is just the input; the real question it answers is \"how far am I from financial freedom?\"")}</p>
      {GROUPS.map((g) => (
        <section key={g.title[0]} className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">{z ? g.title[0] : g.title[1]}</h2>
          <div className="grid gap-3">
            {g.items.map((it) => (
              <Card key={it[0]} size="sm"><CardContent>
                <h3 className="font-sans text-[15px] font-semibold tracking-normal">{z ? it[0] : it[2]}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{z ? it[1] : it[3]}</p>
              </CardContent></Card>
            ))}
          </div>
        </section>
      ))}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">{t("更多", "And More")}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {MORE.map((m) => <li key={m[0]} className="rounded-lg border border-border px-3.5 py-2.5 text-sm"><b>{z ? m[0] : m[2]}</b><span className="text-muted-foreground"> · {z ? m[1] : m[3]}</span></li>)}
        </ul>
      </section>
    </DocPage>
  )
}
