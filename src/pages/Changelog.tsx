import { DocPage } from "@/components/site/Shell"
import { useLang } from "@/lib/i18n"

/** [中文标题, 中文说明, 英文标题, 英文说明]；说明可为空 */
type Item = [string, string, string, string]
type Section = { title: [string, string]; items: Item[] }
type Version = { v: string; date: [string, string]; intro: [string, string]; sections: Section[] }

const VERSIONS: Version[] = [
  {
    v: "1.0.4",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "标签从「只能打」升级到「能改、能归档、能看花了多少」；多币种转为免费；图表和首页卡片统一了一遍。",
      "Tags grow up: rename, archive, and see where each tag's money went. Multi-currency is now free. Charts and home cards got a consistency pass.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["标签详情", "点进一个标签，按月 / 年 / 全部看支出、笔数、笔均，跨月画柱图；「花在哪」按分类列出金额、占比、笔数，待报销也算进去（脚注注明）。", "Tag detail", "Open any tag to see spending, entry count and average by month, year or all time, with a bar chart across months. \"Where it went\" lists amount, share and count by category — pending reimbursements included, with a note."],
        ["标签管理", "改名会连账单和模板一起改，重名先问再合并；能归档、能加图标；数据页新增标签排行卡。", "Tag management", "Renaming updates entries and templates; duplicate names merge after a prompt. Archive tags, give them icons, and see a tag ranking card on the Data tab."],
        ["多币种转为免费", "多币种账户与每日汇率不再需要 Pro。", "Multi-currency is now free", "Multi-currency accounts and daily rates no longer require Pro."],
        ["净资产卡补三个指标", "投资占比、月均支出、应急金能撑几个月；负债水位有了档位词（健康 / 稳健……）和「离下一档还有多远」。", "Three more net-worth metrics", "Investment share, average monthly spending, and how many months your emergency fund covers; debt level now has a named tier and how far to the next one."],
        ["设置页官网入口", "使用指南、FAQ、更新日志一键直达。", "Website links in Settings", "Guide, FAQ and changelog, one tap away."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["图表统一", "实色柱、超阈值换色、真零基线、柱宽封顶、圆角按柱数分档；分类下钻的柱图横轴按时段铺满，不再挤成一坨。", "Charts, unified", "Solid bars, threshold colors, a true zero baseline, capped bar width, corner radius by bar count; drill-down charts span the full period instead of bunching up."],
        ["首页两张主角卡", "本月支出与财富自由目标的数字同一字号、同一位置，展开后逐行对齐。", "Home hero cards", "Spending and Freedom Goal share one number size and position; expanded rows line up."],
        ["资产页三页对齐", "净资产 / 资产变化 / 资产组成的数字、按钮、图表同一高度；资产变化图不再错位或被裁切。", "Assets pages aligned", "Net Worth, Change and Composition share one layout; the change chart no longer misaligns or clips."],
        ["动效", "29 处动画曲线在跑 0.5 秒，改回统一档位；开启「减弱动态效果」后入场只淡入不位移。", "Motion", "29 animations were running at 0.5s; they now use the standard curves. With Reduce Motion on, cards fade in without moving."],
        ["标签详情写出待报销", "两笔全额待报销不再显示成「2 笔 / ¥0.00」，而是「另有 ¥x 待报销，收回前不算消费」。", "Pending reimbursements, spelled out", "Two fully reimbursable entries no longer read \"2 entries / ¥0.00\" — the pending amount is shown with a note."],
        ["记账截图不进备份", "", "Receipt screenshots are excluded from backups", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["iCloud 同步会把已报销的 AA 账单清成未报销", "", "iCloud sync reset settled split bills to unsettled", ""],
        ["自动备份漏了五张表和四处字段", "", "Automatic backups missed five tables and four fields", ""],
        ["下滑关掉设置后，底部标签栏发灰", "", "Tab bar stayed dimmed after swiping the Settings sheet away", ""],
        ["资产页数字先大后小；有的二级分类没有图表", "", "Numbers on Assets shrank after loading; some subcategories had no chart", ""],
        ["英文界面里露出半句中文", "", "Stray Chinese text in the English interface", ""],
        ["标签详情切换时段时高度跳动、翻页按钮被裁", "", "Tag detail jumped in height and clipped its paging buttons when switching periods", ""],
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
