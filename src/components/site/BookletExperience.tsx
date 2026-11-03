import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { NumberInput } from "@/components/site/NumberInput"
import { useLang } from "@/lib/i18n"

const EmbeddedGuide = React.lazy(() => import("@/pages/Guide").then(module => ({ default: module.EmbeddedGuide })))
type GuideLink = [string, string, string]
const GUIDE_PAGES: Record<"features" | "difference", GuideLink[][]> = {
  features: [
    [["countdown","倒计时","Countdown"],["fire-cards","FI 指标","FI metrics"],["pro","免费与 Pro","Free & Pro"]],
    [["entry","记一笔","Entries"],["split","AA 分账","Splits"],["receipts-transfers","退款与转账","Receipts & transfers"],["tags","标签","Tags"],["bill-notes","账单笔记","Bill notes"],["calendar","日历与周期","Calendar"],["booking-confirmation","到期入账","Booking"]],
    [["assets","资产概览","Overview"],["asset-weather","晴雨表","Asset weather"],["account-detail","账户与信用卡","Accounts & cards"],["holdings","投资持仓","Holdings"],["reconciliation","余额校准","Reconciliation"]],
    [["budget","预算与配速","Budget & pace"],["accounting-period","记账周期","Accounting cycle"],["booking-confirmation","计划预留与入账","Plan booking"]],
    [["quick-capture","快捷记账","Capture"],["entry","模板与计划","Templates & plans"],["batch","批量操作","Batch edit"],["import","导入导出","Import & export"],["booking-confirmation","识别待办与入账","Inbox & booking"]],
    [["data","收支与回顾","Insights & reviews"],["accounting-period","统计周期","Accounting cycle"]],
    [["sync","同步与备份","Sync & backup"],["ipad","iPad 与 Mac","iPad & Mac"],["currency","多币种","Currencies"],["import","导入导出","Import & export"]],
    [["widgets","小组件","Widgets"],["personalize","字号、主题与图标","Personalization"],["custom-categories","自定义分类","Custom categories"],["entry-preferences","键盘与草稿","Keypad & drafts"]],
  ],
  difference: [
    [["c-countdown","倒计时怎么算","Countdown math"],["c-lean","Lean FI","Lean FI"],["c-standard","标准 FI","Standard FI"],["c-passive","被动收入","Passive income"]],
    [["diff-categories","分类思路","Category approach"],["c-roles","FI 角色","FI roles"],["custom-categories","自己的分类","Custom categories"]],
    [["diff-assets","余额逻辑","Balance logic"],["c-net-worth","净资产","Net worth"],["account-detail","校准与账户","Account details"],["reconciliation","当前与未来余额","Balance time scopes"]],
    [["diff-numbers","净额统计","Net spending"],["receipts-transfers","回款与转账","Receipts & transfers"],["split","AA 分账","Splits"]],
    [["spending","消费模拟","Spending simulator"],["work-hours","时薪与工时","Work hours"]],
    [["scenarios","保存与比较","Save & compare"],["c-coast","Coast FIRE","Coast FIRE"],["c-barista","Barista FIRE","Barista FIRE"],["c-return","收益假设","Return assumptions"],["c-withdrawal","提取率","Withdrawal rate"]],
  ],
}
function ChapterGuide({ pages }: { pages: GuideLink[] }) {
  const { lang, t } = useLang()
  const [selected, setSelected] = React.useState(pages[0][0])
  const [revision, setRevision] = React.useState(0)
  return <><nav className="chapter-guide-nav" aria-label={t("本章用法", "Chapter topics")}>{pages.map(([slug,zh,en]) => <button type="button" key={slug} aria-current={selected === slug ? "page" : undefined} onClick={() => { setSelected(slug); setRevision(value => value + 1) }}>{lang === "zh" ? zh : en}</button>)}</nav><React.Suspense fallback={<div className="guide-loading" role="status" aria-label={t("加载说明", "Loading the guide")} />}><EmbeddedGuide key={`${selected}-${revision}`} slug={selected} /></React.Suspense></>
}

type Experience = "freedom" | "categories" | "balances" | "net" | "budget"
const FEATURE_EXPERIENCES: (Experience | undefined)[] = ["freedom", "net", "balances", "budget"]
const DIFFERENCE_EXPERIENCES: (Experience | undefined)[] = ["freedom", "categories", "balances", "net", undefined, undefined]
function DemoRange({ label, value, min, max, step = 1, onChange, display }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; display: string }) {
  const id = React.useId()
  return <div className="experience-range"><div><label id={id}>{label}</label><output>{display}</output></div><Slider aria-labelledby={id} value={[value]} min={min} max={max} step={step} onValueChange={value => onChange(Array.isArray(value) ? value[0] : value)} /></div>
}
export function BookletExperience({ topic, page, open, onOpenChange, returnFocus, forecast }: { topic: "features" | "difference"; page: number; open: boolean; onOpenChange: (open: boolean) => void; returnFocus: React.RefObject<HTMLButtonElement | null>; forecast: (expense: number, income: number, net: number, annual: number, withdrawal: number) => number | null }) {
  const { t, lang } = useLang()
  const kind = (topic === "features" ? FEATURE_EXPERIENCES : DIFFERENCE_EXPERIENCES)[page]
  const [expense, setExpense] = React.useState(8000)
  const [income, setIncome] = React.useState(20000)
  const [netWorth, setNetWorth] = React.useState(500000)
  const [annual, setAnnual] = React.useState(5)
  const [withdrawal, setWithdrawal] = React.useState(4)
  const [role, setRole] = React.useState("flexible")
  const [recorded, setRecorded] = React.useState(11780)
  const [actual, setActual] = React.useState(12000)
  const [mode, setMode] = React.useState("refund")
  const [refund, setRefund] = React.useState(200)
  const [people, setPeople] = React.useState(4)
  const [budget, setBudget] = React.useState(6000)
  const money = (n: number) => `¥${Math.round(n).toLocaleString(lang === "zh" ? "zh-CN" : "en-US")}`
  const months = forecast(expense, income, netWorth, annual / 100, withdrawal / 100)
  const baseline = forecast(8000, income, netWorth, annual / 100, withdrawal / 100)
  const shift = months === null || baseline === null ? null : months - baseline
  const title = topic === "features"
    ? t(...([ ["自由倒计时与 FI 指标", "Countdown & FI metrics"], ["日常记账", "Daily tracking"], ["资产与账户", "Assets & accounts"], ["预算与配速", "Budget & pace"], ["快捷录入与整理", "Capture & organize"], ["数据与月度回顾", "Insights & reviews"], ["同步、备份与多币种", "Sync, backup & currencies"], ["小组件与个性化", "Widgets & personalization"] ] as [string,string][])[page])
    : t(...([ ["自由目标与计算", "Freedom goals & calculations"], ["分类与 FI 角色", "Categories & FI roles"], ["真实余额与净资产", "Real balances & net worth"], ["退款、报销与 AA", "Refunds, claims & splits"], ["消费模拟与工时", "Spending & work hours"], ["人生方案与 FIRE 路径", "Life scenarios & FIRE paths"] ] as [string,string][])[page])
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="experience-backdrop" />
      <Dialog.Popup className="booklet-experience" finalFocus={returnFocus}>
        <header className="experience-header"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="experience-close" aria-label={t("关闭", "Close")}><X size={20} /></Dialog.Close></header>
        <Tabs key={`${topic}-${page}`} defaultValue="guide" className="experience-tabs">
          {kind && <TabsList className="experience-tablist" aria-label={t("详情内容", "Details")}><TabsTrigger value="guide">{t("功能与用法", "Features & usage")}</TabsTrigger><TabsTrigger value="demo">{kind && ({ freedom: t("倒计时试算", "Countdown demo"), categories: t("分类试算", "Category demo"), balances: t("校准演示", "Reconciliation demo"), net: t("净额试算", "Net-spending demo"), budget: t("月度配速演示", "Monthly pace demo") })[kind]}</TabsTrigger></TabsList>}
          <TabsContent value="guide" className="experience-body"><ChapterGuide key={`${topic}-${page}`} pages={GUIDE_PAGES[topic][page]} /></TabsContent>
          <TabsContent value="demo" className="experience-body">
          {kind === "freedom" && <>
            <Dialog.Description>{t("按标准 FI 目标逐月推算，演示参数可以自行调整。", "Project month by month toward Standard FI using adjustable demo assumptions.")}</Dialog.Description>
            <div className="experience-result" aria-live="polite"><span>{t("距离财务自由", "Until financial freedom")}</span><strong>{months === null ? t("暂不可达", "Not yet reachable") : t(`${Math.floor(months / 12)} 年 ${months % 12} 个月`, `${Math.floor(months / 12)} years ${months % 12} months`)}</strong>{shift !== null && shift !== 0 && <p>{shift < 0 ? t(`比每月花 8,000 元提前 ${-shift} 个月`, `${-shift} months earlier than spending ¥8,000/month`) : t(`比每月花 8,000 元推迟 ${shift} 个月`, `${shift} months later than spending ¥8,000/month`)}</p>}</div>
            <DemoRange label={t("每月支出", "Monthly spending")} value={expense} min={4000} max={12000} step={100} onChange={setExpense} display={money(expense)} />
            <DemoRange label={t("每月收入", "Monthly income")} value={income} min={5000} max={50000} step={100} onChange={setIncome} display={money(income)} />
            <div className="experience-inputs"><label>{t("当前净资产", "Current net worth")}<NumberInput aria-label={t("当前净资产", "Current net worth")} value={netWorth} onValueChange={setNetWorth} min={0} max={100000000} /></label></div>
            <DemoRange label={t("年化收益假设", "Assumed annual return")} value={annual} min={0} max={10} step={0.5} onChange={setAnnual} display={`${annual}%`} />
            <DemoRange label={t("提取率", "Withdrawal rate")} value={withdrawal} min={2} max={6} step={0.5} onChange={setWithdrawal} display={`${withdrawal}%`} />
            <p className="experience-note">{t("少花的钱留下来，未来需要覆盖的生活费也更低。这里是固定参数的演示试算，不代表实际收益或达成日期。", "Spending less increases savings and lowers the future costs to cover. This fixed-assumption demo is not a prediction of returns or an actual freedom date.")}</p>
          </>}
          {kind === "categories" && <>
            <Dialog.Description>{t("每月 600 元的聚餐，你会赋予它什么角色？", "What role would you give ¥600 of monthly dining out?")}</Dialog.Description>
            <div className="experience-options" role="group" aria-label={t("支出角色", "Spending role")}>{[["fixed",t("固定", "Fixed")],["essential",t("必要", "Essential")],["flexible",t("弹性", "Flexible")],["other",t("其他", "Other")]].map(([key,label]) => <button type="button" key={key} aria-pressed={role === key} onClick={() => setRole(key)}>{label}</button>)}</div>
            <div className="experience-results" aria-live="polite"><div><span>{t("Lean FI 目标", "Lean FI goal")}</span><strong>{money((5000 + (["fixed","essential"].includes(role) ? 600 : 0)) * 300)}</strong></div><div><span>{t("标准 FI 目标", "Standard FI goal")}</span><strong>{money((6000 + (role !== "other" ? 600 : 0)) * 300)}</strong></div></div>
            <p className="experience-note">{t("Lean FI 覆盖固定与必要支出；标准 FI 再加入弹性支出。「其他」默认不进入 FI 计算。演示基础月支出为固定 3,000、必要 2,000、弹性 1,000 元，提取率 4%。", "Lean FI covers fixed and essential costs; Standard FI adds flexible costs. Other is excluded by default. Demo baseline: ¥3,000 fixed, ¥2,000 essential, ¥1,000 flexible per month, at a 4% withdrawal rate.")}</p>
          </>}
          {kind === "balances" && <>
            <Dialog.Description>{t("核对真实余额，差额单独记为校准，之后的流水继续累加。", "Reconcile with the real balance. Keep the adjustment separate, then add subsequent entries.")}</Dialog.Description>
            <div className="experience-inputs"><label>{t("账面余额", "Recorded balance")}<NumberInput aria-label={t("账面余额", "Recorded balance")} value={recorded} onValueChange={value => setRecorded(Math.min(1000000,Math.max(0,value)))} min={0} max={1000000} /></label><label>{t("核对后的真实余额", "Reconciled real balance")}<NumberInput aria-label={t("核对后的真实余额", "Reconciled real balance")} value={actual} onValueChange={value => setActual(Math.min(1000000,Math.max(0,value)))} min={0} max={1000000} /></label></div>
            <div className="experience-results" aria-live="polite"><div><span>{t("校准差额", "Reconciliation adjustment")}</span><strong>{actual - recorded >= 0 ? "+" : "−"}{money(Math.abs(actual - recorded))}</strong></div><div><span>{t("之后收入 1,500、支出 300", "Then +¥1,500 income, −¥300 spending")}</span><strong>{money(actual + 1200)}</strong></div></div>
          </>}
          {kind === "net" && <>
            <Dialog.Description>{t("退款、报销和 AA 回款，回到原来的支出里看。", "See refunds, reimbursements and splits against the original expense.")}</Dialog.Description>
            <div className="experience-options" role="group" aria-label={t("交易场景", "Transaction scenario")}>{[["refund",t("退款", "Refund")],["claim",t("报销", "Reimbursement")],["split",t("AA", "Split")]].map(([key,label]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => {setMode(key);setRefund(key === "claim" ? 1200 : 200)}}>{label}</button>)}</div>
            <div className="experience-result" aria-live="polite"><span>{mode === "refund" ? t("外套原价 ¥599 · 实际支出", "¥599 coat · Net spending") : mode === "claim" ? t("出差垫付 ¥1,200 · 实际支出", "¥1,200 trip · Net spending") : t("聚餐共 ¥400 · 你承担的部分", "¥400 dinner · Your share")}</span><strong>{money(mode === "split" ? 400 / people : Math.max(0,(mode === "claim" ? 1200 : 599) - refund))}</strong></div>
            {mode === "split" ? <DemoRange label={t("均摊人数", "People splitting equally")} value={people} min={2} max={8} onChange={setPeople} display={t(`${people} 人`, `${people} people`)} /> : <DemoRange label={mode === "claim" ? t("已报销金额", "Reimbursed amount") : t("退款金额", "Refund amount")} value={refund} min={0} max={mode === "claim" ? 1200 : 599} onChange={setRefund} display={money(refund)} />}
            <p className="experience-note">{t("回款冲减原来的支出，不再额外算一笔收入。账户间转账不计入收支。", "Money returned reduces the original expense rather than adding income. Transfers between your accounts are excluded from income and spending.")}</p>
          </>}
          {kind === "budget" && <>
            <Dialog.Description>{t("演示：第 14 天已花 3,700 元，按当前日均支出推算本月节奏。", "Demo: ¥3,700 spent by day 14. Project this pace across a 30-day month.")}</Dialog.Description>
            <div className="experience-results" aria-live="polite"><div><span>{t("预计月底支出", "Projected month-end spending")}</span><strong>{money(3700 / 14 * 30)}</strong></div><div><span>{budget >= 3700 / 14 * 30 ? t("预计结余", "Projected remaining") : t("预计超出", "Projected over budget")}</span><strong>{money(Math.abs(budget - 3700 / 14 * 30))}</strong></div></div>
            <DemoRange label={t("每月预算", "Monthly budget")} value={budget} min={3000} max={12000} step={100} onChange={setBudget} display={money(budget)} />
          </>}
        </TabsContent></Tabs>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
}
