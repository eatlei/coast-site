/** Website copy verified against Coast 1.1: PlanComparison and ProFeature. */
export type Copy = [string, string]
export type Comparison = { label: Copy; free: Copy | null; pro: Copy }
const yes: Copy = ["有", "Included"]
export const COMPARISON: Comparison[] = [
  { label: ["记账、账户、标签、模板、周期与还款计划", "Entries, accounts, tags, templates and recurring / repayment plans"], free: ["不限量", "Unlimited"], pro: ["不限量", "Unlimited"] },
  { label: ["截图 / 通知 / 快捷指令记账、转账与组合付款", "Screenshot / notification / Shortcuts capture, transfers and combined payments"], free: yes, pro: yes },
  { label: ["AA 分账、分次退款、报销与到账记录", "Splits, partial refunds, reimbursements and received-payment records"], free: yes, pro: yes },
  { label: ["CSV / Excel 导入、全部账单导出", "CSV / Excel import and full entry export"], free: ["全部", "Full access"], pro: ["全部", "Full access"] },
  { label: ["iCloud 同步与每日备份、iPad 与 Mac", "iCloud sync, daily backups, iPad and Mac"], free: yes, pro: yes },
  { label: ["多币种、每日汇率与跨币种实际到账", "Currencies, daily rates and actual cross-currency receipts"], free: yes, pro: yes },
  { label: ["资产晴雨表、账户分组、信用卡额度与还款日", "Asset weather, account groups, credit limits and repayment dates"], free: yes, pro: yes },
  { label: ["账户账单 / 概览 / 备注、余额走势与校准", "Account entries / overview / notes, balance history and reconciliation"], free: yes, pro: yes },
  { label: ["桌面与锁屏小组件、App 内字号与导航排序", "Home / Lock Screen widgets, in-app text size and navigation order"], free: yes, pro: yes },
  { label: ["FI 进度、储蓄率与被动收入覆盖率", "FI progress, savings rate and passive income coverage"], free: yes, pro: yes },
  { label: ["自由倒计时", "Freedom countdown"], free: ["中性档数字", "Neutral estimate"], pro: ["含三档区间", "Three-scenario range"] },
  { label: ["收支试算滑杆、场景保存与并排比较", "What-If sliders, saved scenarios and side-by-side comparisons"], free: null, pro: yes },
  { label: ["Coast FIRE、Barista FIRE 与高级 FI 参数", "Coast FIRE, Barista FIRE and advanced FI parameters"], free: null, pro: yes },
  { label: ["预算", "Budgets"], free: ["总预算", "Total budget"], pro: ["含分类预算与配速推演", "Category budgets and pace projection"] },
  { label: ["月度回顾", "Monthly review"], free: ["一句话摘要", "One-line summary"], pro: ["完整版", "Full review"] },
  { label: ["复购洞察", "Repeat-buy insights"], free: null, pro: yes },
  { label: ["投资按份额 × 单价记、按代码查价、本金与收益", "Investment units × price, symbol lookup, contributions and returns"], free: null, pro: yes },
  { label: ["分类", "Categories"], free: ["FI 分类", "FI categories"], pro: ["含自定义一级分类", "Custom top-level categories"] },
  { label: ["时薪看板与账单详情工时", "Hourly-rate dashboard and hours on entry details"], free: yes, pro: yes },
  { label: ["消费模拟：自由日推迟多久、要工作多久", "Spending simulation: freedom-date impact and work hours"], free: yes, pro: yes },
  { label: ["消费模拟：完整分析、冷静期、忍住了 / 入手了清单", "Spending simulation: full analysis, cooling-off period, Skipped / Bought lists"], free: null, pro: yes },
  { label: ["记账时显示工时", "Hours while adding an entry"], free: null, pro: yes },
  { label: ["配色主题与 App 图标", "Themes and app icons"], free: ["默认选项", "Defaults"], pro: ["全部可选", "All options"] },
  { label: ["收支配色、分类图标导入与 App 图标搜索", "Income / expense colors, imported category icons and app-icon search"], free: yes, pro: yes },
]
export const FREE_FEATURES: Copy[] = [
  ["不限量记账、AA、退款、报销与到账记录", "Unlimited entries, splits, refunds, reimbursements and receipts"],
  ["账户分组、信用卡管理、资产晴雨表与小组件", "Account groups, credit-card tools, asset weather and widgets"],
  ["CSV / Excel 导入导出、iCloud 同步与备份", "CSV / Excel import / export, iCloud sync and backups"],
  ["FI 进度、中性倒计时、总预算与月报摘要", "FI progress, neutral countdown, total budget and review summary"],
  ["多币种、汇率、快捷记账与组合付款", "Currencies, rates, Quick Capture and combined payments"],
  ["时薪看板、消费模拟的自由日与工时", "Hourly-rate dashboard, basic spending-date and work-hour simulation"],
  ["App 内字号、主导航排序与图标搜索", "In-app text size, navigation order and app-icon search"],
]
export const PRO_FEATURES: Copy[] = [
  ["投资持仓、价格查询、本金与收益", "Holdings, price lookup, contributions and returns"],
  ["自定义一级分类", "Custom top-level categories"],
  ["达成区间与收支试算", "Forecast range and What-If sliders"],
  ["场景保存与并排比较", "Saved scenarios and side-by-side comparisons"],
  ["Coast / Barista FIRE、高级 FI 参数", "Coast / Barista FIRE and advanced FI parameters"],
  ["完整月报、复购洞察、分类预算与配速推演", "Full reviews, repeat-buy insights, category budgets and pace projection"],
  ["消费模拟完整分析与冷静期清单", "Full spending analysis and cooling-off lists"],
  ["记账时看工时、主题与 App 图标", "Hours while adding, themes and app icons"],
]
export const V11_HIGHLIGHTS: { title: Copy; body: Copy; href: string; pro?: boolean }[] = [
  { title: ["个人资产晴雨表", "Personal asset weather"], body: ["应急金、负债率、月供比、储蓄率、投资占比各自显示数值和天气，点开看计算依据；天气样式可换。", "Runway, debt ratio, debt payments, savings rate and invested share each show a value and weather state. Open a metric for its calculation; choose your weather style."], href: "asset-weather" },
  { title: ["账户分组与信用卡管理", "Account groups and credit-card tools"], body: ["在 FI 分组和我的分组间切换。账户详情分账单、概览、备注；信用卡可设置额度、账单日与还款日。", "Switch between FI groups and your own groups. Account details have Entries, Overview and Notes; set a card's limit, statement day and payment due day."], href: "account-detail" },
  { title: ["投资持仓与收益", "Holdings and investment returns"], body: ["投资账户按份额 × 单价记录，可按代码查询并更新价格，在概览里查看投入本金与收益。", "Record investment units × price, look up and refresh a price by symbol, and review contributions and returns in the account overview."], href: "holdings", pro: true },
  { title: ["自定义一级分类", "Your own top-level categories"], body: ["建自己的一级分类、归入二级分类，记账和数据页按你的分法显示；FI 角色仍用于 FIRE 计算。", "Create top-level categories and group subcategories for entry and data views. FI roles continue to drive FIRE calculations."], href: "custom-categories", pro: true },
  { title: ["消费模拟器", "Spending simulator"], body: ["一次买入或每月都付，先看自由日与工时；Pro 补充完整分析、冷静期和忍住了 / 入手了清单。", "Try a one-off or monthly purchase and see its freedom-date impact and work hours. Pro adds full analysis, a cooling-off period and Skipped / Bought lists."], href: "spending" },
  { title: ["场景模拟器升级", "Updated scenario simulator"], body: ["用具体金额模拟收入、支出和资产变化，保存不同方案并排比较。", "Use actual amounts to model income, spending and asset changes, then save scenarios and compare them side by side."], href: "scenarios", pro: true },
  { title: ["到账记录与灵活记账", "Receipts and flexible logging"], body: ["退款、报销在到账当天也看得到；可填写报销到账日期，记账可不选账户，组合付款明细更清楚。", "Refunds and reimbursements also appear on the day money arrives. Set the receipt date, log without an account, and inspect combined-payment allocations."], href: "receipts-transfers" },
  { title: ["转账与快捷记账", "Transfers and Quick Capture"], body: ["转账显示可用余额并支持全部选择；快捷指令支持转账，截图 / 通知识别优惠与原币金额，提现需确认双方账户。", "See the available transfer balance and select All. Shortcuts support transfers; capture reads discounts and original currencies, with withdrawal accounts confirmed before saving."], href: "quick-capture" },
  { title: ["桌面与锁屏小组件", "Home and Lock Screen widgets"], body: ["新增资产晴雨表桌面小组件，以及锁屏应急金和记一笔入口；金额随隐私设置遮挡。", "New asset weather Home Screen widgets, plus Lock Screen runway and quick-entry shortcuts. Amounts follow privacy settings."], href: "widgets" },
  { title: ["字号、导航与图标", "Text size, navigation and icons"], body: ["App 内调字号、调整四个主页面顺序、搜索账户 App 图标；新增引导与可在设置重看的更新介绍。", "Adjust text size, reorder the four main tabs and search for account app icons. New onboarding and release notes can be revisited in Settings."], href: "personalize" },
]
