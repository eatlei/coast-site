import { DocPage } from "@/components/site/Shell"
import { useLang } from "@/lib/i18n"

/** [中文标题, 中文说明, 英文标题, 英文说明]；说明可为空 */
type Item = [string, string, string, string]
type Section = { title: [string, string]; items: Item[] }
type Version = { v: string; date: [string, string]; intro: [string, string]; sections: Section[] }

const VERSIONS: Version[] = [
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

export default function Changelog() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  return (
    <DocPage wide title={t("更新日志", "Changelog")} subtitle={t("每一次更新，都离自由更近一步。", "Every update, one step closer to freedom.")}>
      <div className="divide-y divide-border">
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
