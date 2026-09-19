import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useLang } from "@/lib/i18n"

/**
 * 使用手册里的图。全部是就地画的 SVG / 块元素，颜色只用站点 token（深浅两套自动跟随）。
 * 图里的数都是**现算的**：同一套 `monthsToFI`（年化 5%、提取率 4%，与 App 默认口径一致），
 * 不写死结论，改参数时图跟着对。
 */

// ---------- 共用 ----------

const R = 0.05, SWR = 0.04

/** 月度复利逐月推，净资产 ≥ 年支出 ÷ 提取率 的那个月。200 年内到不了返回 null */
export function monthsToFI(netWorth: number, spend: number, income: number, annualSpend = spend * 12): number | null {
  const target = annualSpend / SWR
  const rm = Math.pow(1 + R, 1 / 12) - 1
  let nw = netWorth
  for (let m = 0; m <= 2400; m++) {
    if (nw >= target) return m
    nw = nw * (1 + rm) + (income - spend)
  }
  return null
}

const ROLE = {
  fixed: "oklch(0.56 0.17 290)",
  essential: "var(--primary)",
  flexible: "oklch(0.72 0.12 215)",
  other: "var(--ink-soft)",
}

function Fig({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="my-2 rounded-2xl border border-border bg-card p-5 md:p-6">
      {children}
      {caption && <figcaption className="mt-4 text-center text-[13px] text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

const wan = (n: number, zh: boolean) => zh ? `¥${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)} 万` : `¥${Math.round(n / 1000)}k`
const ym = (m: number, zh: boolean) => zh ? `${Math.floor(m / 12)} 年 ${m % 12} 个月` : `${Math.floor(m / 12)}y ${m % 12}m`

function Chip({ children, color, muted }: { children: React.ReactNode; color?: string; muted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] ${muted ? "border-dashed text-muted-foreground line-through decoration-muted-foreground/50" : "border-border"}`}>
      {color && <span className="size-2 rounded-full" style={{ background: color }} />}
      {children}
    </span>
  )
}

function Compare({ before, after, beforeTitle, afterTitle }: { before: React.ReactNode; after: React.ReactNode; beforeTitle: string; afterTitle: string }) {
  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-xl bg-muted/60 p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">{beforeTitle}</div>
        {before}
      </div>
      <div className="grid place-items-center text-xl text-muted-foreground md:rotate-0 rotate-90">→</div>
      <div className="rounded-xl bg-primary/8 p-4 ring-1 ring-primary/20">
        <div className="mb-3 text-xs font-bold uppercase tracking-[.1em] text-primary">{afterTitle}</div>
        {after}
      </div>
    </div>
  )
}

// ---------- 理念 ----------

/** 年支出 × 25 = FI 数字 */
export function FiFormula() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const [spend, setSpend] = useState(10000)
  const target = spend * 12 / SWR
  return (
    <Fig caption={t("拖一下：每月开销少 1000，要攒的目标就少 30 万。", "Drag it: ¥1,000 less a month shrinks the target by ¥300k.")}>
      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
        <div className="rounded-xl bg-muted/60 px-4 py-3"><div className="tag">{t("每月开销", "Monthly spending")}</div><div className="big-num mt-1 text-2xl">¥{spend.toLocaleString()}</div></div>
        <span className="text-2xl text-muted-foreground">× 12 ÷ 4% =</span>
        <div className="rounded-xl bg-primary/10 px-4 py-3 ring-1 ring-primary/25"><div className="tag">{t("你的 FI 数字", "Your FI number")}</div><div className="big-num mt-1 text-2xl text-primary">{wan(target, zh)}</div></div>
      </div>
      <div className="mx-auto mt-6 max-w-[420px]">
        <Slider min={3000} max={30000} step={500} value={spend} onValueChange={(v) => setSpend(Array.isArray(v) ? v[0] : v)} aria-label="spend" />
      </div>
    </Fig>
  )
}

/** 储蓄率 → 从零攒到 FI 要多少年 */
export function SavingsRateYears() {
  const { t } = useLang()
  const rows = [10, 20, 30, 40, 50, 60, 70, 80].map((s) => ({ s, m: monthsToFI(0, 1 - s / 100, 1) ?? 0 }))
  const max = Math.max(...rows.map((r) => r.m))
  return (
    <Fig caption={t("从零开始、年化 5%、提取率 4%。储蓄率是唯一同时推动「攒得更多」和「需要更少」的数。", "Starting from zero, 5% return, 4% withdrawal. Savings rate is the one number that both grows your savings and shrinks what you need.")}>
      <div className="mb-3 flex justify-between text-xs text-muted-foreground"><span>{t("储蓄率", "Savings rate")}</span><span>{t("到 FI 需要", "Years to FI")}</span></div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.s} className="grid grid-cols-[44px_1fr_64px] items-center gap-3 text-sm">
            <span className="num text-muted-foreground">{r.s}%</span>
            <div className="h-5 rounded-md bg-muted/60">
              <div className="h-full rounded-md" style={{ width: `${(r.m / max) * 100}%`, background: r.s === 50 ? "var(--primary)" : "color-mix(in oklch, var(--primary) 35%, transparent)" }} />
            </div>
            <span className={`num text-right ${r.s === 50 ? "font-medium text-primary" : ""}`}>{(r.m / 12).toFixed(1)}{t(" 年", "y")}</span>
          </div>
        ))}
      </div>
    </Fig>
  )
}

/** 四条线在一根净资产轴上 */
export function FireLadder() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const spend = 120000, core = 70000, years = 25, partTime = 36000, nw = 800000
  const std = spend / SWR, lean = core / SWR, coast = std / Math.pow(1 + R, years), barista = (spend - partTime) / SWR
  const max = std * 1.08
  const marks = [
    { k: "Coast FIRE", v: coast, d: t(`退休还有 ${years} 年，靠复利就够`, `${years} years of compounding does the rest`) },
    { k: "Lean FI", v: lean, d: t("只算固定 + 必要", "Fixed + essential only") },
    { k: "Barista FIRE", v: barista, d: t("兼职月入 3000 托底", "¥3,000/mo part-time") },
    { k: t("标准 FI", "Standard FI"), v: std, d: t("照现在这样活", "Live like now") },
  ].sort((a, b) => a.v - b.v)
  return (
    <Fig caption={t("示例：年开销 12 万（其中固定 + 必要 7 万），净资产 80 万。几条线由近到远，越过第一条就已经换了一种活法。", "Example: ¥120k a year (¥70k fixed + essential), ¥800k net worth. The lines run near to far — crossing the first already changes how you can live.")}>
      <div className="relative mx-2 mt-16 mb-24 h-2 rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${(nw / max) * 100}%` }} />
        <div className="absolute -top-12 -translate-x-1/2 text-center" style={{ left: `${(nw / max) * 100}%` }}>
          <div className="whitespace-nowrap text-xs font-medium text-primary">{t("你在这", "You're here")} · {wan(nw, zh)}</div>
          <div className="mx-auto mt-1 h-7 w-px bg-primary" />
        </div>
        {marks.map((m, i) => (
          <div key={m.k} className="absolute top-3 -translate-x-1/2 text-center" style={{ left: `${(m.v / max) * 100}%` }}>
            <div className="mx-auto h-3 w-px bg-foreground/40" />
            <div className={`w-24 ${i % 2 ? "mt-9" : "mt-1"}`}>
              <div className="text-[12px] font-medium">{m.k}</div>
              <div className="num text-[11px] text-muted-foreground">{wan(Math.round(m.v / 1000) * 1000, zh)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-2">
        {marks.map((m) => <div key={m.k}><span className="font-medium text-foreground">{m.k}</span>　{m.d}</div>)}
      </div>
    </Fig>
  )
}

// ---------- 记账方法 ----------

export function AccountsMerge() {
  const { t } = useLang()
  const before = [t("招行信用卡", "Card A"), t("中信信用卡", "Card B"), t("浦发信用卡", "Card C"), t("广发信用卡", "Card D"), t("交行信用卡", "Card E"), t("微信", "WeChat Pay"), t("支付宝", "Alipay"), t("储蓄卡", "Debit card")]
  const after = [[t("储蓄卡", "Debit card"), t("工资进、房租出", "Salary in, rent out")], [t("信用卡", "Credit card"), t("5 张卡合一个", "5 cards in one")], [t("微付宝", "Wallets"), t("微信 + 支付宝", "WeChat + Alipay")]]
  return (
    <Fig caption={t("还款额最终以银行 App 为准，分得再细也对不上；账户少了，每记一笔就少选一次。", "The bank's number wins in the end anyway. Fewer accounts means one less choice every time you log.")}>
      <Compare beforeTitle={t("8 个账户", "8 accounts")} afterTitle={t("3 个账户", "3 accounts")}
        before={<div className="flex flex-wrap gap-1.5">{before.map((b) => <Chip key={b}>{b}</Chip>)}</div>}
        after={<div className="space-y-2">{after.map(([a, d]) => <div key={a} className="flex items-baseline justify-between gap-3 rounded-lg bg-card px-3 py-2 text-sm"><span className="font-medium">{a}</span><span className="text-xs text-muted-foreground">{d}</span></div>)}</div>} />
    </Fig>
  )
}

export function MergeEntries() {
  const { t } = useLang()
  const Row = ({ label, n, amount }: { label: string; n: number; amount: string }) => (
    <div className="mb-3">
      <div className="mb-1.5 flex justify-between text-sm"><span>{label}</span><span className="num text-muted-foreground">{amount}</span></div>
      <div className="flex flex-wrap gap-[3px]">{Array.from({ length: n }).map((_, i) => <span key={i} className="h-3 w-2 rounded-[2px] bg-foreground/25" />)}</div>
    </div>
  )
  return (
    <Fig caption={t("一个月的地铁和咖啡：花的钱一样，要记的次数从 66 次变成 2 次。", "A month of transit and coffee: same money, 66 entries down to 2.")}>
      <Compare beforeTitle={t("逐笔记", "Every time")} afterTitle={t("充值记一笔", "Log the top-up")}
        before={<><Row label={t("地铁 44 次", "Metro × 44")} n={44} amount="¥176" /><Row label={t("咖啡 22 杯", "Coffee × 22")} n={22} amount="¥330" /></>}
        after={<><Row label={t("交通卡充值", "Transit top-up")} n={1} amount="¥200" /><Row label={t("咖啡店储值", "Coffee card")} n={1} amount="¥300" /></>} />
    </Fig>
  )
}

export function CategoryEvolution() {
  const { t } = useLang()
  const stages = [
    { h: t("按时间", "By time"), q: t("回答不了任何问题", "Answers nothing"), items: [t("早餐", "Breakfast"), t("午餐", "Lunch"), t("晚餐", "Dinner"), t("夜宵", "Late snack"), t("水果", "Fruit"), t("零食", "Snacks")] },
    { h: t("按场景", "By setting"), q: t("看得出在哪吃，看不出能不能省", "Where, not whether to cut"), items: [t("外卖", "Delivery"), t("自己做", "Home-cooked"), t("聚餐", "Group meals"), t("超市", "Groceries")] },
    { h: t("按性质", "By nature"), q: t("一眼看出哪些能砍", "What could go, at a glance"), items: [t("吃饭", "Meals"), t("聚餐", "Eating out")], hi: 1 },
  ]
  return (
    <Fig caption={t("「如果要省钱，哪些能砍？」——能回答这个问题的分类，才是有用的分类。", "\"If I had to cut back, what could go?\" A category scheme is only useful if it answers that.")}>
      <div className="grid gap-3 md:grid-cols-3">
        {stages.map((s, i) => (
          <div key={s.h} className={`rounded-xl p-4 ${i === 2 ? "bg-primary/8 ring-1 ring-primary/20" : "bg-muted/60"}`}>
            <div className={`text-xs font-bold uppercase tracking-[.1em] ${i === 2 ? "text-primary" : "text-muted-foreground"}`}>{`0${i + 1} · ${s.h}`}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.items.map((it, k) => <Chip key={it} color={s.hi === k ? ROLE.flexible : i === 2 ? ROLE.essential : undefined}>{it}{s.hi === k && <span className="text-[11px] text-muted-foreground">{t("可砍", "can cut")}</span>}</Chip>)}
            </div>
            <div className="mt-3 text-[13px] text-muted-foreground">{s.q}</div>
          </div>
        ))}
      </div>
    </Fig>
  )
}

export function RolesMap() {
  const { t } = useLang()
  const Y = <span className="text-success">●</span>, N = <span className="text-muted-foreground/40">—</span>
  const rows = [
    { c: ROLE.fixed, n: t("固定", "Fixed"), e: t("房租、保险、订阅", "Rent, insurance, subscriptions"), lean: Y, std: Y, cut: t("很难", "Hard") },
    { c: ROLE.essential, n: t("必要", "Essential"), e: t("吃饭、通勤、水电", "Meals, commute, utilities"), lean: Y, std: Y, cut: t("有限", "Some") },
    { c: ROLE.flexible, n: t("弹性", "Flexible"), e: t("聚餐、打车、购物、旅行", "Eating out, taxis, shopping, travel"), lean: N, std: Y, cut: t("主战场", "Most") },
    { c: ROLE.other, n: t("其他", "Other"), e: t("首付、婚礼这类一次性大事", "One-offs like a down payment"), lean: N, std: N, cut: "—" },
  ]
  return (
    <Fig caption={t("「其他」默认不进 FI 计算：一次性的大钱不该被年化成「你每年都会这么花」（可在 FI 参数里打开）。", "Other is left out of the FI math by default — a one-off shouldn't be annualized (you can include it in FI Parameters).")}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-normal">{t("角色", "Role")}</th><th className="pb-2 font-normal">{t("例子", "Examples")}</th><th className="pb-2 text-center font-normal">Lean FI</th><th className="pb-2 text-center font-normal">{t("标准 FI", "Standard FI")}</th><th className="pb-2 text-right font-normal">{t("能省多少", "Room to cut")}</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.n} className="border-t border-border">
              <td className="py-2.5 font-medium"><span className="mr-2 inline-block size-2.5 rounded-full align-middle" style={{ background: r.c }} />{r.n}</td>
              <td className="py-2.5 text-muted-foreground">{r.e}</td>
              <td className="py-2.5 text-center">{r.lean}</td><td className="py-2.5 text-center">{r.std}</td>
              <td className="py-2.5 text-right">{r.cut}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </Fig>
  )
}

// ---------- 记账 ----------

function Steps({ steps }: { steps: [string, string][] }) {
  return (
    <ol className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr">
      {steps.map(([h, d], i) => (
        <li key={h} className="relative rounded-xl bg-muted/60 p-4">
          <div className="grid size-7 place-items-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground">{i + 1}</div>
          <div className="mt-3 font-medium">{h}</div>
          <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</div>
        </li>
      ))}
    </ol>
  )
}

export function EntryWays() {
  const { t } = useLang()
  const ways = [
    { h: t("点「＋」", "Tap +"), s: t("约 5 秒", "~5 s"), d: t("选分类 → 输金额 → 完成。键盘自带加减乘除。", "Category → amount → done. The keypad does arithmetic."), w: 70 },
    { h: t("长按「＋」用模板", "Long-press + for a template"), s: t("约 2 秒", "~2 s"), d: t("房租、通勤、每天那杯咖啡，一步选用。", "Rent, commute, the daily coffee — one step."), w: 28 },
    { h: t("截图记账", "Screenshot Capture"), s: t("约 1 秒", "~1 s"), d: t("支付完截个屏，金额、时间、分类、账户自动填好。", "Screenshot the payment; amount, time, category and account filled in."), w: 14 },
  ]
  return (
    <Fig caption={t("大致耗时，按常见操作估。越常见的账，越该用越快的方式记。", "Rough timings for typical use. The more often you log something, the faster the method should be.")}>
      <div className="space-y-4">
        {ways.map((w) => (
          <div key={w.h}>
            <div className="flex items-baseline justify-between gap-3"><span className="font-medium">{w.h}</span><span className="num text-sm text-primary">{w.s}</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${w.w}%` }} /></div>
            <div className="mt-1.5 text-[13px] text-muted-foreground">{w.d}</div>
          </div>
        ))}
      </div>
    </Fig>
  )
}

export function ExtrasLabel() {
  const { t } = useLang()
  const parts = [[t("餐费", "Meal"), "$42.00", ""], [t("小费 18%", "Tip 18%"), "$7.56", "tip"], [t("税费", "Tax"), "$3.73", "tax"]]
  return (
    <Fig caption={t("小费、服务费、税费、手续费、优惠作为标注挂在这笔账上：总额一目了然，统计口径不变。", "Tips, service fees, taxes, card fees and discounts ride along as labels: the total is clear, and nothing about how it's counted changes.")}>
      <div className="mx-auto max-w-[360px] rounded-xl bg-muted/60 p-4">
        {parts.map(([a, b, k]) => <div key={a} className="flex justify-between py-1 text-sm"><span className={k ? "text-muted-foreground" : ""}>{a}{k && <span className="ml-2 rounded bg-primary/12 px-1.5 py-0.5 text-[11px] text-primary">{t("标注", "label")}</span>}</span><span className="num">{b}</span></div>)}
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium"><span>{t("这一笔记为", "Logged as")}</span><span className="num">$53.29</span></div>
      </div>
    </Fig>
  )
}

export function ImportFlow() {
  const { t } = useLang()
  return (
    <Fig>
      <Steps steps={[
        [t("在旧 App 里导出", "Export from the old app"), t("iCost 用「导出账单」而不是「备份」；随手记、钱迹、Cookie 记账导出 Excel / CSV。", "In iCost use Export, not Backup; Suishouji, Qianji and Cookie export Excel / CSV.")],
        [t("设置 → 导入账单", "Settings → Import Entries"), t("自动认表头和编码、跳过重复、识别转账。导错了能一键撤销。", "Headers and encoding detected, duplicates skipped, transfers recognized. One tap to undo.")],
        [t("资产 → ＋ → 批量对账", "Assets → + → Batch Reconcile"), t("导入只有流水、没有期初余额，填一遍真实余额，资产马上对齐。", "Imports have entries but no starting balances; enter real balances once and assets line up.")],
      ]} />
    </Fig>
  )
}

export function SplitDiagram() {
  const { t } = useLang()
  const people = [t("你", "You"), "A", "B", "C"]
  return (
    <Fig caption={t("你先付了 400：你的支出只记 100，另外 300 进「待收」，谁还了就结清谁。", "You paid ¥400: only ¥100 counts as your spending; ¥300 goes to money owed, settled person by person.")}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl bg-muted/60 px-5 py-3 text-center"><div className="tag">{t("晚饭，你付的", "Dinner, you paid")}</div><div className="big-num mt-1 text-2xl">¥400</div></div>
        <div className="text-muted-foreground">↓ {t("平均分给 4 人", "split 4 ways")}</div>
        <div className="grid w-full max-w-[460px] grid-cols-4 gap-2">
          {people.map((p, i) => (
            <div key={p} className={`rounded-xl p-3 text-center ${i === 0 ? "bg-primary/10 ring-1 ring-primary/25" : "bg-muted/60"}`}>
              <div className="text-sm font-medium">{p}</div>
              <div className="num mt-1 text-lg">¥100</div>
              <div className={`mt-1 text-[11px] ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{i === 0 ? t("记为支出", "your spending") : t("待收", "owed")}</div>
            </div>
          ))}
        </div>
      </div>
    </Fig>
  )
}

// ---------- 看账 ----------

/** 一笔钱换算成自由日推迟几天。演示账本：月支出 1.2 万、月收入 2 万、净资产 80 万 */
export function EntryPrice() {
  const { t, lang } = useLang()
  const [amount, setAmount] = useState(3200)
  const base = monthsToFI(800000, 12000, 20000)
  const after = monthsToFI(800000 - amount, 12000, 20000)
  const days = base !== null && after !== null ? Math.max(0, Math.round((after - base) * 30.4)) : null
  // 月度推算精度是一个月；小额时用「少了多少本金 ÷ 月储蓄」估天数，免得一直显示 0
  const precise = days !== null && days < 31 ? Math.round((amount / 8000) * 30.4) : days
  return (
    <Fig caption={t("演示账本：月支出 1.2 万、月收入 2 万、净资产 80 万。一次性花掉的钱，要靠后面的储蓄补回来。", "Demo ledger: ¥12k spending, ¥20k income a month, ¥800k net worth. One-off spending has to be earned back by future savings.")}>
      <div className="flex flex-wrap items-center justify-center gap-2 text-[15px]">
        <span>{t("花掉", "Spend")}</span>
        <span className="relative"><span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">¥</span>
          <Input type="number" inputMode="decimal" min={0} max={999999} value={amount} onChange={(e) => setAmount(Math.max(0, Math.min(999999, Number(e.target.value) || 0)))} className="h-9 w-28 pl-6 font-mono" aria-label="amount" /></span>
        <span>{t("，自由日推迟", ", and freedom moves back")}</span>
        <b className="big-num text-3xl text-primary">{precise ?? "—"}</b>
        <span>{lang === "zh" ? "天" : "days"}</span>
      </div>
    </Fig>
  )
}

function BarsSvg({ values, labels, lines, highlight, hiColor = "var(--destructive)", h = 160, fmt }: { values: number[]; labels: string[]; lines?: { v: number; label: string; color: string; dash?: boolean }[]; highlight?: number; hiColor?: string; h?: number; fmt?: (n: number) => string }) {
  const W = 560, pad = 16, top = 22, max = Math.max(...values, ...(lines?.map((l) => l.v) ?? [])) * 1.1
  const bw = (W - pad * 2) / values.length
  const y = (v: number) => top + (h - top) * (1 - v / max)
  return (
    <>
      <svg viewBox={`0 0 ${W} ${h + 26}`} className="w-full">
        {values.map((v, i) => (
          <g key={i}>
            <rect x={pad + i * bw + bw * 0.18} y={y(v)} width={bw * 0.64} height={h - y(v)} rx={4}
              fill={i === highlight ? hiColor : "color-mix(in oklch, var(--primary) 45%, transparent)"} />
            {/* 只标突出的那根：每根都标会跟参考线的字挤在一起 */}
            {fmt && i === highlight && <text x={pad + i * bw + bw / 2} y={y(v) - 7} textAnchor="middle" fontSize="12" fill={hiColor} fontWeight={600}>{fmt(v)}</text>}
            <text x={pad + i * bw + bw / 2} y={h + 18} textAnchor="middle" className="fill-muted-foreground" fontSize="11">{labels[i]}</text>
          </g>
        ))}
        {lines?.map((l) => <line key={l.label} x1={pad} x2={W - pad} y1={y(l.v)} y2={y(l.v)} stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? "5 4" : undefined} />)}
      </svg>
      {lines && (
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px]">
          {lines.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-2">
              <svg width="22" height="6"><line x1="0" x2="22" y1="3" y2="3" stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? "5 4" : undefined} /></svg>
              <span style={{ color: l.color }} className="font-medium">{l.label}</span>
            </span>
          ))}
        </div>
      )}
    </>
  )
}

export function MedianVsAverage() {
  const { t } = useLang()
  const v = [4200, 3900, 4400, 11800, 4100, 4300]
  const avg = v.reduce((a, b) => a + b, 0) / v.length
  const sorted = [...v].sort((a, b) => a - b), med = (sorted[2] + sorted[3]) / 2
  return (
    <Fig caption={t("某个分类近 6 个月，其中一个月买了台电脑。平均数被这一笔拉高了 40%，中位数不受影响。", "One category over six months, one of which included a laptop. The average jumps 40%; the median doesn't move.")}>
      <BarsSvg values={v} labels={t("4月,5月,6月,7月,8月,9月", "Apr,May,Jun,Jul,Aug,Sep").split(",")} highlight={3} fmt={(n) => `¥${n.toLocaleString()} ${t("电脑", "laptop")}`}
        lines={[{ v: avg, label: `${t("平均数", "Average")} ¥${Math.round(avg).toLocaleString()}${t("（被电脑拉高）", " (pulled up by the laptop)")}`, color: "var(--destructive)", dash: true }, { v: med, label: `${t("中位数", "Median")} ¥${Math.round(med).toLocaleString()}`, color: "var(--primary)" }]} />
    </Fig>
  )
}

export function PaceChart() {
  const { t } = useLang()
  const W = 560, H = 190, pad = 30, budget = 12000, today = 19
  const daily = [800, 120, 90, 60, 300, 40, 150, 200, 90, 70, 60, 5600, 80, 120, 260, 90, 110, 70, 140]
  let acc = 0
  const pts = daily.map((d, i) => { acc += d; return [i + 1, acc] as const })
  const x = (d: number) => pad + ((W - pad * 2) * (d - 1)) / 29, y = (v: number) => 12 + (H - 40) * (1 - v / (budget * 1.1))
  const path = pts.map(([d, v], i) => `${i ? "L" : "M"}${x(d)},${y(v)}`).join(" ")
  const ahead = acc - (budget * today) / 30
  return (
    <Fig caption={t("实线是实际累计，虚线是「匀速花完预算」该到的位置。月中一眼就知道剩下的日子要不要收一收。", "Solid is what you've spent so far; dashed is an even pace to the budget. Mid-month, you know whether to ease off.")}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={x(1)} y1={y(0)} x2={x(30)} y2={y(budget)} stroke="var(--rule)" strokeWidth={2} strokeDasharray="5 5" />
        <line x1={pad} x2={W - pad} y1={y(budget)} y2={y(budget)} stroke="var(--rule)" strokeWidth={1} />
        <text x={W - pad} y={y(budget) - 6} textAnchor="end" fontSize="11" className="fill-muted-foreground">{t("预算 ¥12,000", "Budget ¥12,000")}</text>
        <path d={`${path} L${x(today)},${y(0)} L${x(1)},${y(0)} Z`} fill="color-mix(in oklch, oklch(0.75 0.15 60) 18%, transparent)" />
        <path d={path} fill="none" stroke="oklch(0.72 0.16 60)" strokeWidth={2.5} />
        <circle cx={x(today)} cy={y(acc)} r={5} fill="var(--card)" stroke="oklch(0.72 0.16 60)" strokeWidth={2.5} />
        <text x={x(today) + 10} y={y(acc) + 4} fontSize="12" fill="oklch(0.62 0.16 60)" fontWeight={600}>{t(`比匀速快 ¥${Math.round(ahead).toLocaleString()}`, `¥${Math.round(ahead).toLocaleString()} ahead of pace`)}</text>
        {[1, 15, 30].map((d) => <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" className="fill-muted-foreground">{t(`${d}日`, `${d}`)}</text>)}
      </svg>
    </Fig>
  )
}

export function SeasonalBudget() {
  const { t } = useLang()
  const last = [9800, 16500, 9200, 9400, 9900, 10400, 11200, 10800, 9600, 12400, 13800, 11000]
  const flat = last.reduce((a, b) => a + b, 0) / 12
  return (
    <Fig caption={t("「铺满全年」优先参考去年同月：春节、双 11 该高就高。一条匀速的线，会让你在二月「超支」、在三月「省了很多」——两个都是假的。", "Fill Year follows the same month last year first, so the holiday months stay high. A flat line would call February an overspend and March a triumph — both false.")}>
      <BarsSvg values={last} labels={t("1,2,3,4,5,6,7,8,9,10,11,12", "J,F,M,A,M,J,J,A,S,O,N,D").split(",")} h={150}
        lines={[{ v: flat, label: t("匀速平均的全年预算", "A flat yearly average"), color: "var(--destructive)", dash: true }]} highlight={1} hiColor="var(--primary)" fmt={() => t("春节", "Holidays")} />
    </Fig>
  )
}

export function RepeatBuyDots() {
  const { t } = useLang()
  const prices = [18.9, 19.5, 17.8, 21.0, 18.5, 19.2, 26.5, 18.0, 19.9, 20.4, 18.6, 19.0]
  const W = 560, H = 120, pad = 30, lo = 15, hi = 28
  const x = (p: number) => pad + ((W - pad * 2) * (p - lo)) / (hi - lo)
  const sorted = [...prices].sort((a, b) => a - b), usual = (sorted[5] + sorted[6]) / 2
  return (
    <Fig caption={t("同一杯奶茶的 12 次购买。最右边那杯是「秋天第一杯」那天，领了券还比平时贵 7 块——不追踪的话，你根本不知道正常价是多少。", "Twelve purchases of the same drink. The one on the far right was a promo day — even with a coupon it cost ¥7 more than usual. Without tracking, you'd never know the normal price.")}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect x={x(sorted[2])} y={30} width={x(sorted[9]) - x(sorted[2])} height={36} rx={8} fill="color-mix(in oklch, var(--primary) 12%, transparent)" />
        <line x1={x(usual)} x2={x(usual)} y1={24} y2={72} stroke="var(--primary)" strokeWidth={2} />
        <text x={x(usual)} y={18} textAnchor="middle" fontSize="12" fill="var(--primary)" fontWeight={600}>{t(`通常 ¥${usual.toFixed(1)}`, `Usual ¥${usual.toFixed(1)}`)}</text>
        {prices.map((p, i) => <circle key={i} cx={x(p)} cy={48 + ((i % 3) - 1) * 8} r={5} fill={p > 25 ? "var(--destructive)" : "var(--foreground)"} fillOpacity={p > 25 ? 1 : 0.55} />)}
        <text x={x(26.5)} y={92} textAnchor="middle" fontSize="11" fill="var(--destructive)">¥26.5</text>
        <text x={x(sorted[0])} y={92} textAnchor="middle" fontSize="11" className="fill-muted-foreground">{t(`最低 ¥${sorted[0]}`, `Low ¥${sorted[0]}`)}</text>
        <line x1={pad} x2={W - pad} y1={106} y2={106} stroke="var(--rule)" />
      </svg>
    </Fig>
  )
}

export function ReconcileFlow() {
  const { t } = useLang()
  return (
    <Fig caption={t("资产页和 FIRE 页的净资产同源：以最近一次对账为锚，叠加之后的流水。", "Assets and FIRE share one net worth: your last reconcile as the anchor, plus every entry since.")}>
      <div className="grid gap-3 sm:grid-cols-3">
        {[[t("1 号", "The 1st"), t("收到提醒", "Reminder arrives"), "🔔"], [t("1 分钟", "1 minute"), t("填各账户真实余额", "Enter real balances"), "✍️"], [t("差额", "The gap"), t("自动记为校准，不用逐笔找", "Recorded as a calibration — no hunting"), "🎯"]].map(([a, b, e]) => (
          <div key={a} className="rounded-xl bg-muted/60 p-4 text-center"><div className="text-2xl">{e}</div><div className="mt-2 font-medium">{a}</div><div className="mt-1 text-[13px] text-muted-foreground">{b}</div></div>
        ))}
      </div>
    </Fig>
  )
}

// ---------- FIRE ----------

export function WhatIf() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const [cut, setCut] = useState(0), [raise, setRaise] = useState(0)
  const spend = 12000 * (1 - cut / 100), income = 20000 * (1 + raise / 100)
  const base = monthsToFI(800000, 12000, 20000), m = monthsToFI(800000, spend, income)
  const d = base !== null && m !== null ? base - m : null
  return (
    <Fig caption={t("演示账本：月支出 1.2 万、月收入 2 万、净资产 80 万。少花同时作用两头，所以同样的百分比，少花比多赚更管用。", "Demo ledger: ¥12k spending, ¥20k income, ¥800k net worth. Spending less works on both ends, so the same percentage does more than earning more.")}>
      <div className="text-center">
        <div className="tag">{t("距离标准 FI", "Time to standard FI")}</div>
        <div className="big-num mt-2 text-4xl">{m === null ? "—" : ym(m, zh)}</div>
        <div className={`mt-2 min-h-5 text-sm font-medium ${d && d > 0 ? "text-success" : d && d < 0 ? "text-destructive" : "text-muted-foreground"}`}>
          {d === null ? "" : d === 0 ? t("拖动下面的滑杆", "Drag a slider") : d > 0 ? t(`提前 ${ym(d, true)}`, `${ym(d, false)} sooner`) : t(`推迟 ${ym(-d, true)}`, `${ym(-d, false)} later`)}
        </div>
      </div>
      <div className="mx-auto mt-6 grid max-w-[460px] gap-6">
        <div><div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{t("每月花费", "Monthly spending")}</span><b className="num font-medium">¥{Math.round(spend).toLocaleString()} {cut ? `(${cut > 0 ? "−" : "+"}${Math.abs(cut)}%)` : ""}</b></div>
          <Slider min={-20} max={40} step={1} value={cut} onValueChange={(v) => setCut(Array.isArray(v) ? v[0] : v)} aria-label="cut" /></div>
        <div><div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{t("每月收入", "Monthly income")}</span><b className="num font-medium">¥{Math.round(income).toLocaleString()} {raise ? `(${raise > 0 ? "+" : "−"}${Math.abs(raise)}%)` : ""}</b></div>
          <Slider min={-20} max={40} step={1} value={raise} onValueChange={(v) => setRaise(Array.isArray(v) ? v[0] : v)} aria-label="raise" /></div>
      </div>
    </Fig>
  )
}

export function ScenarioCompare() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const base = monthsToFI(800000, 12000, 20000) ?? 0
  const rows = [
    { n: t("现状", "As is"), m: base },
    { n: t("买一辆 20 万的车", "Buy a ¥200k car"), m: monthsToFI(600000, 12800, 20000) ?? 0 },
    { n: t("换个城市，房租少 3000", "Move, rent ¥3,000 less"), m: monthsToFI(800000, 9000, 18000) ?? 0 },
    { n: t("跳槽涨薪 20%", "New job, +20% pay"), m: monthsToFI(800000, 12000, 24000) ?? 0 },
  ]
  const max = Math.max(...rows.map((r) => r.m))
  return (
    <Fig caption={t("同一本账，几个「如果」并排放。买车那行同时算了首付和每月多出的养车钱；换城市那行收入也跟着降了一点。", "One ledger, several what-ifs side by side. The car row counts the down payment and the running costs; the move row assumes a slightly lower income too.")}>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.n} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[180px_1fr_90px]">
            <span className="text-sm">{r.n}</span>
            <span className="num text-right text-sm sm:order-last">{ym(r.m, zh)}</span>
            <div className="col-span-2 h-4 rounded bg-muted/60 sm:col-span-1">
              <div className="h-full rounded" style={{ width: `${(r.m / max) * 100}%`, background: i === 0 ? "var(--rule)" : r.m > base ? "var(--destructive)" : "var(--success)" }} />
            </div>
          </div>
        ))}
      </div>
    </Fig>
  )
}

export function CoastCurve() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const std = 3000000, nw = 800000
  const W = 560, H = 200, pad = 36, maxY = 3000000
  const yrs = Array.from({ length: 31 }, (_, i) => i + 5)
  const x = (yr: number) => pad + ((W - pad * 2) * (yr - 5)) / 30, y = (v: number) => 14 + (H - 44) * (1 - v / maxY)
  const path = yrs.map((yr, i) => `${i ? "L" : "M"}${x(yr)},${y(std / Math.pow(1 + R, yr))}`).join(" ")
  const cross = yrs.find((yr) => std / Math.pow(1 + R, yr) <= nw) ?? 35
  return (
    <Fig caption={t(`标准 FI 300 万、净资产 80 万：离退休还有 ${cross} 年以上，你已经越过 Coast 线；想更早退，线就往上走。`, `Standard FI ¥3M, net worth ¥800k: with ${cross}+ years to retirement you're already past the Coast line; retire sooner and the line rises.`)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <path d={`${path} L${x(35)},${y(0)} L${x(5)},${y(0)} Z`} fill="color-mix(in oklch, var(--primary) 10%, transparent)" />
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth={2.5} />
        <line x1={pad} x2={W - pad} y1={y(nw)} y2={y(nw)} stroke="var(--success)" strokeWidth={2} strokeDasharray="5 4" />
        <text x={pad + 4} y={y(nw) - 6} fontSize="12" fill="var(--success)" fontWeight={600}>{t("你的净资产 80 万", "Your net worth ¥800k")}</text>
        <line x1={x(cross)} x2={x(cross)} y1={y(nw)} y2={y(0)} stroke="var(--success)" strokeWidth={1} />
        <circle cx={x(cross)} cy={y(nw)} r={5} fill="var(--card)" stroke="var(--success)" strokeWidth={2.5} />
        <text x={x(12)} y={y(std / Math.pow(1 + R, 12)) - 10} fontSize="12" fill="var(--primary)" fontWeight={600}>{t("Coast 线", "Coast line")}</text>
        {[5, 15, 25, 35].map((yr) => <text key={yr} x={x(yr)} y={H - 10} textAnchor="middle" fontSize="11" className="fill-muted-foreground">{t(`${yr} 年`, `${yr}y`)}</text>)}
        <text x={W - pad} y={H - 26} textAnchor="end" fontSize="11" className="fill-muted-foreground">{t("距目标退休 →", "Until retirement →")}</text>
        {[0, 1000000, 2000000, 3000000].map((v) => <text key={v} x={pad - 6} y={y(v) + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground">{wan(v, zh).replace("¥", "")}</text>)}
      </svg>
    </Fig>
  )
}

export function BaristaBars() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const spend = 120000
  const rows = [0, 2000, 4000, 6000, 8000].map((p) => ({ p, need: Math.max(0, (spend - p * 12) / SWR) }))
  return (
    <Fig caption={t("年开销 12 万时：兼职月入每多 1000，需要攒的资产就少 30 万。", "At ¥120k a year, every extra ¥1,000/month of part-time income cuts what you need by ¥300k.")}>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.p} className="grid grid-cols-[112px_1fr_72px] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{r.p === 0 ? t("不兼职", "No part-time") : t(`兼职 ${r.p}/月`, `¥${r.p}/mo`)}</span>
            <div className="h-5 rounded-md bg-muted/60"><div className="h-full rounded-md" style={{ width: `${(r.need / (spend / SWR)) * 100}%`, background: r.p === 0 ? "var(--rule)" : "color-mix(in oklch, var(--primary) 55%, transparent)" }} /></div>
            <span className="num text-right">{wan(r.need, zh)}</span>
          </div>
        ))}
      </div>
    </Fig>
  )
}

export function PassiveGauge() {
  const { t } = useLang()
  const passive = 1100, core = 15142, pct = passive / core
  return (
    <Fig caption={t("被动收入（利息、分红、租金）÷ 停不下来的开销（固定 + 必要）。到 100% 那天，不上班也能维持最基本的生活。", "Passive income (interest, dividends, rent) ÷ spending you can't stop (fixed + essential). At 100%, the basics are covered without a paycheck.")}>
      <div className="mx-auto max-w-[460px]">
        <div className="flex items-baseline justify-between"><span className="big-num text-3xl text-primary">{Math.round(pct * 100)}%</span><span className="tag">{t("月被动 ¥1,100 / 固定 + 必要 ¥15,142", "¥1,100 passive / ¥15,142 core")}</span></div>
        <div className="relative mt-3 h-3 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct * 100}%` }} />
          {[25, 50, 75].map((m) => <span key={m} className="absolute top-0 h-full w-px bg-card" style={{ left: `${m}%` }} />)}</div>
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground"><span>0</span><span>50%</span><span>{t("100% · Lean FIRE", "100% · Lean FIRE")}</span></div>
      </div>
    </Fig>
  )
}

// ---------- 更多 ----------

export function PrivacyDiagram() {
  const { t } = useLang()
  const Box = ({ e, h, d, cls = "" }: { e: string; h: string; d: string; cls?: string }) => (
    <div className={`rounded-xl p-4 text-center ${cls}`}><div className="text-2xl">{e}</div><div className="mt-1 font-medium">{h}</div><div className="mt-1 text-[12px] text-muted-foreground">{d}</div></div>
  )
  return (
    <Fig caption={t("数据只在你的设备和你自己的 iCloud 之间走；每日备份是另一条独立的路，同步出了问题也能整体恢复。", "Data only travels between your devices and your own iCloud. Daily backups are a separate path, so you can restore even if sync goes wrong.")}>
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Box e="📱💻" h={t("你的设备", "Your devices")} d="iPhone · iPad · Mac" cls="bg-muted/60" />
        <div className="text-center text-muted-foreground">⇄</div>
        <Box e="☁️" h={t("你的 iCloud", "Your iCloud")} d={t("私有数据库，只有你的 Apple 账户能读", "Private database only your Apple account can read")} cls="bg-primary/8 ring-1 ring-primary/20" />
        <div className="text-center text-muted-foreground">✕</div>
        <Box e="🗄️" h={t("Coast 的服务器", "Coast's servers")} d={t("不存在。没有账号，也没有追踪", "Don't exist. No account, no tracking")} cls="border border-dashed border-border opacity-70" />
      </div>
      <div className="mt-5">
        <div className="mb-2 text-xs text-muted-foreground">{t("每日自动备份 · 保留最近 10 份 · 在「文件」App → iCloud 云盘 → Coast", "Daily backups · latest 10 kept · Files → iCloud Drive → Coast")}</div>
        <div className="flex gap-1.5">{Array.from({ length: 10 }).map((_, i) => <div key={i} className={`h-8 flex-1 rounded-md ${i === 9 ? "bg-primary" : "bg-primary/20"}`} />)}</div>
      </div>
    </Fig>
  )
}

export function ProTable() {
  const { t } = useLang()
  const Y = <span className="text-success">●</span>, N = <span className="text-muted-foreground/40">—</span>
  const rows: [string, React.ReactNode, React.ReactNode][] = [
    [t("记账、模板、截图记账、导入、AA 分账、报销、计划", "Logging, templates, Screenshot Capture, import, splits, claims, plans"), Y, Y],
    [t("总预算、首页的消费节奏", "Total budget, Spending Pace on the home card"), Y, Y],
    [t("自由倒计时、试算滑块、FI 进度、储蓄率、被动收入覆盖率", "Freedom countdown, What-If sliders, FI Progress, Savings Rate, Passive Income Coverage"), Y, Y],
    [t("iCloud 同步、每日备份、iPad 与 Mac", "iCloud sync, daily backups, iPad & Mac"), Y, Y],
    [t("场景模拟、达成区间", "Scenarios, achievement range"), N, Y],
    [t("Coast FIRE、Barista FIRE、高级 FI 参数", "Coast FIRE, Barista FIRE, advanced FI parameters"), N, Y],
    [t("分类预算、预算页的配速推演", "Category budgets, pace projection on the budget page"), N, Y],
    [t("完整月度回顾、常买", "Full Monthly Review, Repeat Buys"), N, Y],
    [t("多币种、主题配色与 App 图标", "Multi-currency, themes and app icons"), N, Y],
  ]
  return (
    <Fig>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-normal" /><th className="w-16 pb-2 text-center font-normal">{t("免费", "Free")}</th><th className="w-16 pb-2 text-center font-normal">Pro</th></tr></thead>
        <tbody>{rows.map(([a, f, p]) => <tr key={a} className="border-t border-border"><td className="py-2.5 pr-3">{a}</td><td className="py-2.5 text-center">{f}</td><td className="py-2.5 text-center">{p}</td></tr>)}</tbody>
      </table>
    </Fig>
  )
}

// ---------- 和常见记账 App 的不同 ----------

/** 左「常见记账 App」、右「Coast」的对照表。不点名任何产品：比的是做法，不是谁 */
function DiffTable({ rows }: { rows: [string, string, string][] }) {
  const { t } = useLang()
  return (
    <>
    <div className="space-y-3 sm:hidden">
      {rows.map(([k, a, b]) => (
        <div key={k} className="rounded-xl bg-muted/50 p-3.5 text-sm">
          <div className="font-medium">{k}</div>
          <div className="mt-2 text-[13px] text-muted-foreground"><span className="mr-1.5 text-[11px]">{t("常见", "Typical")}</span>{a}</div>
          <div className="mt-1 text-[13px]"><span className="mr-1.5 text-[11px] font-semibold text-primary">Coast</span>{b}</div>
        </div>
      ))}
    </div>
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[520px] text-sm">
        <thead><tr className="text-left text-xs">
          <th className="w-[22%] pb-2 font-normal text-muted-foreground" />
          <th className="w-[39%] pb-2 font-normal text-muted-foreground">{t("常见记账 App", "Typical budgeting apps")}</th>
          <th className="w-[39%] pb-2 font-semibold text-primary">Coast</th>
        </tr></thead>
        <tbody>{rows.map(([k, a, b]) => (
          <tr key={k} className="border-t border-border align-top">
            <td className="py-3 pr-3 font-medium">{k}</td>
            <td className="py-3 pr-4 text-muted-foreground">{a}</td>
            <td className="py-3 text-foreground/90">{b}</td>
          </tr>))}</tbody>
      </table>
    </div>
    </>
  )
}

export function DiffOverview() {
  const { t } = useLang()
  return (
    <Fig>
      <DiffTable rows={[
        [t("记账是为了", "Tracking is for"), t("知道钱花在哪", "Knowing where money went"), t("知道离财务自由还有多远", "Knowing how far you are from financial freedom")],
        [t("分类", "Categories"), t("按消费类型分，越细越好", "By type of purchase, the finer the better"), t("按性质分：每个分类都有一个 FIRE 角色", "By nature: every category has a FIRE role")],
        [t("资产", "Assets"), t("余额手动改，或者全靠流水累加", "Balances edited by hand, or summed from entries"), t("以对账为锚、叠加之后的流水；差额记为校准", "Anchored to your last reconcile plus later entries; gaps become calibrations")],
        [t("预算", "Budgets"), t("自己拍一个数", "A number you make up"), t("从历史算：中位数、去年同月、可再收紧", "From your history: median, same month last year, tighten if you like")],
        [t("统计口径", "What counts"), t("记了什么就算什么", "Whatever you entered"), t("退款、报销、AA 按净额；转账不算收支；一次性大额不年化", "Refunds, claims and splits net out; transfers aren't income or spending; one-offs aren't annualized")],
        [t("看数据", "Insights"), t("这个月花了多少", "How much this month"), t("还要工作多久、每一笔让自由日动了多少", "How long until you can stop, and what each entry did to that date")],
        [t("数据", "Your data"), t("多数要注册账号，数据存在开发者的服务器", "Usually an account, with data on the developer's servers"), t("没有账号，只在你的设备和你的 iCloud", "No account; only on your devices and your iCloud")],
      ]} />
    </Fig>
  )
}

export function DiffCategories() {
  const { t } = useLang()
  const Tree = ({ rows }: { rows: [string, string[]][] }) => (
    <div className="space-y-2 text-sm">{rows.map(([h, c]) => (
      <div key={h}><div className="font-medium">{h}</div><div className="mt-1 flex flex-wrap gap-1">{c.map((x) => <span key={x} className="rounded-md bg-card px-1.5 py-0.5 text-[12px] text-muted-foreground">{x}</span>)}</div></div>
    ))}</div>
  )
  const Role = ({ c, h, items, note }: { c: string; h: string; items: string[]; note: string }) => (
    <div className="rounded-lg bg-card p-2.5 text-sm">
      <div className="flex items-baseline justify-between gap-2"><span className="font-medium"><span className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ background: c }} />{h}</span><span className="text-[11px] text-muted-foreground">{note}</span></div>
      <div className="mt-1 text-[12px] text-muted-foreground">{items.join(" · ")}</div>
    </div>
  )
  return (
    <Fig caption={t("同样是「吃」：左边分到最细也回答不了「该省哪」；右边把吃饭和聚餐分到两个角色里，答案直接写在分类上。", "The same food spending: the left, however detailed, can't say what to cut; the right puts meals and eating out in different roles, so the answer is in the structure.")}>
      <Compare beforeTitle={t("按消费类型", "By type")} afterTitle={t("按性质 + 角色", "By nature + role")}
        before={<Tree rows={[[t("餐饮", "Food"), [t("早餐", "Breakfast"), t("午餐", "Lunch"), t("晚餐", "Dinner"), t("外卖", "Delivery"), t("聚餐", "Group meals"), t("零食", "Snacks")]], [t("交通", "Transport"), [t("地铁", "Metro"), t("公交", "Bus"), t("打车", "Taxi"), t("加油", "Fuel")]], [t("购物", "Shopping"), [t("服饰", "Clothes"), t("数码", "Tech"), t("日用", "Household")]]]} />}
        after={<div className="space-y-2">
          <Role c={ROLE.fixed} h={t("固定", "Fixed")} items={[t("房租", "Rent"), t("订阅", "Subscriptions")]} note={t("进 Lean FI", "In Lean FI")} />
          <Role c={ROLE.essential} h={t("必要", "Essential")} items={[t("吃饭", "Meals"), t("交通", "Transit"), t("日用", "Household")]} note={t("进 Lean FI", "In Lean FI")} />
          <Role c={ROLE.flexible} h={t("弹性", "Flexible")} items={[t("聚餐", "Eating out"), t("打车", "Taxis"), t("服饰", "Clothes"), t("数码", "Tech")]} note={t("最能省的地方", "Most room to cut")} />
        </div>} />
      <div className="mt-4 grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-2">
        <div>{t("· 二级分类照样有，名字、图标随便改，只是每个一级分类必须选一个角色。", "· Subcategories still exist; rename and re-icon freely — each top-level category just needs a role.")}</div>
        <div>{t("· 改了某笔账的分类时，App 会问要不要记住：以后备注里有这个词的账（含导入的）自动归到这里。", "· Change an entry's category and Coast asks whether to remember: future entries with that word in the note (imports included) go there automatically.")}</div>
      </div>
    </Fig>
  )
}

export function DiffAssets() {
  const { t } = useLang()
  const types: [string, string][] = [["💵", t("现金及等价物", "Cash & equivalents")], ["📈", t("投资", "Investments")], ["🏠", t("不动产", "Property")], ["🤝", t("应收款", "Receivables")], ["💳", t("负债", "Liabilities")]]
  return (
    <Fig caption={t("常见的两种做法各有毛病：手改余额和流水脱节，纯靠流水累加又会被漏记一点点带偏。Coast 取两者之长：对账定锚，之后的流水照常累加，差额明明白白记成一笔「校准」。", "Both common approaches break: hand-edited balances drift from your entries, and pure sums drift with every missed entry. Coast anchors on your reconcile, adds entries after it, and records any gap as a visible calibration.")}>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          [t("手改余额", "Edit the balance"), t("余额是余额、流水是流水，改完两边对不上，净资产曲线说不清为什么跳。", "Balances and entries live separately; after an edit they disagree and the net worth curve jumps for no clear reason."), false],
          [t("全靠流水累加", "Sum the entries"), t("漏记一笔就永远差一笔，合并记账、红包这类「能不记就不记」的做法没法用。", "One missed entry stays missing forever, so shortcuts like merged entries or skipped red envelopes don't work."), false],
          [t("对账为锚 + 之后的流水", "Reconcile + later entries"), t("每月对一次账定锚，差额自动记为「校准」，看得见、能追溯；合并记账也不怕。", "Reconcile monthly to set the anchor; the gap becomes a visible, traceable calibration. Merged entries are fine."), true],
        ].map(([h, d, ok]) => (
          <div key={h as string} className={`rounded-xl p-4 ${ok ? "bg-primary/8 ring-1 ring-primary/20" : "bg-muted/60"}`}>
            <div className={`font-medium ${ok ? "text-primary" : ""}`}>{ok ? "✓ " : "✕ "}{h}</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 text-xs text-muted-foreground">{t("按资产的性质分组，而不是按银行：", "Grouped by what the asset is, not which bank holds it:")}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">{types.map(([e, n]) => <Chip key={n}><span>{e}</span>{n}</Chip>)}</div>
      <div className="mt-4 grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-2">
        <div>{t("· 建贷款计划时自动建出对应的负债账户，每期自动拆成利息和本金。", "· A loan plan creates its liability account and splits each payment into interest and principal.")}</div>
        <div>{t("· 借给朋友的钱在「应收款」里，还回来之前也算你的资产。", "· Money lent to friends sits in Receivables — still your asset until it comes back.")}</div>
        <div>{t("· 外币账按记账当时的汇率固定下来，去年那趟旅行的金额不会因为汇率变了跟着变。", "· Foreign-currency entries keep the rate from the day you logged them, so last year's trip doesn't change when rates move.")}</div>
        <div>{t("· 资产页和 FIRE 页的净资产是同一个数，不是各算一遍。", "· Assets and FIRE show the same net worth — computed once, not twice.")}</div>
      </div>
    </Fig>
  )
}

export function DiffNumbers() {
  const { t } = useLang()
  const rows: [string, string, string, string][] = [
    [t("买外套 ¥599，后来退了 ¥200", "A ¥599 coat, ¥200 refunded later"), t("支出 599，收入 200", "Spent 599, earned 200"), t("支出 399", "Spent 399"), t("退款冲减原来那笔，不算收入", "The refund reduces the original, not income")],
    [t("出差垫付 ¥1,200，公司报销", "¥1,200 work trip, reimbursed"), t("支出 1,200，收入 1,200", "Spent 1,200, earned 1,200"), t("支出 0", "Spent 0"), t("报下来之前挂在「待报销」", "Sits in To Claim until paid back")],
    [t("请四个人吃饭 ¥400", "Dinner for four, ¥400"), t("支出 400", "Spent 400"), t("支出 100 + 待收 300", "Spent 100, owed 300"), t("只有你那份是你的开销", "Only your share is your spending")],
    [t("信用卡还款 ¥8,000", "¥8,000 card payment"), t("有时被算成支出", "Sometimes counted as spending"), t("不算收支", "Neither"), t("钱从左口袋到右口袋", "Left pocket to right pocket")],
    [t("首付 ¥50 万", "A ¥500k down payment"), t("当月支出暴涨，全年平均被拉高", "That month explodes; the yearly average follows"), t("计入「其他」，默认不进 FI", "Other role; excluded from FI by default"), t("一次性的钱不该被年化", "One-offs shouldn't be annualized")],
  ]
  return (
    <Fig caption={t("这些口径直接决定储蓄率和 FI 数字准不准——算错一笔「收入」，自由日就会莫名提前。", "These rules decide whether your savings rate and FI number are right — one phantom \"income\" and your freedom date moves for no reason.")}>
      <div className="space-y-3 sm:hidden">
        {rows.map(([a, b, c, d]) => (
          <div key={a} className="rounded-xl bg-muted/50 p-3.5 text-sm">
            <div className="font-medium">{a}</div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[13px] text-muted-foreground line-through decoration-muted-foreground/40">{b}</span>
              <span className="font-medium text-primary">→ {c}</span>
            </div>
            <div className="mt-1 text-[12px] text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[560px] text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-normal">{t("场景", "Situation")}</th><th className="pb-2 font-normal">{t("常见算法", "Typical")}</th><th className="pb-2 font-semibold text-primary">Coast</th><th className="pb-2 font-normal">{t("为什么", "Why")}</th></tr></thead>
          <tbody>{rows.map(([a, b, c, d]) => (
            <tr key={a} className="border-t border-border align-top">
              <td className="py-2.5 pr-3 font-medium">{a}</td>
              <td className="py-2.5 pr-3 text-muted-foreground line-through decoration-muted-foreground/40">{b}</td>
              <td className="py-2.5 pr-3 font-medium text-primary">{c}</td>
              <td className="py-2.5 text-[13px] text-muted-foreground">{d}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </Fig>
  )
}

// ---------- 概念词典 ----------

/** 提取率 → 需要年支出的多少倍 */
export function WithdrawalMultiples() {
  const { t } = useLang()
  const rows = [3, 3.5, 4, 4.5, 5].map((r) => ({ r, x: 100 / r }))
  return (
    <Fig caption={t("提取率越低越保守：3% 要攒约 33 倍年支出，5% 只要 20 倍。打算越早退休，退休期越长，越该往低了调。", "The lower the rate, the safer: 3% needs about 33× your annual spending, 5% only 20×. The earlier you plan to stop, the longer retirement lasts, and the lower you should go.")}>
      <div className="space-y-2.5">
        {rows.map((w) => (
          <div key={w.r} className="grid grid-cols-[52px_1fr_64px] items-center gap-3 text-sm">
            <span className="num text-muted-foreground">{w.r}%</span>
            <div className="h-5 rounded-md bg-muted/60"><div className="h-full rounded-md" style={{ width: `${(w.x / 34) * 100}%`, background: w.r === 4 ? "var(--primary)" : "color-mix(in oklch, var(--primary) 35%, transparent)" }} /></div>
            <span className={`num text-right ${w.r === 4 ? "font-medium text-primary" : ""}`}>{w.x.toFixed(1)}×</span>
          </div>
        ))}
      </div>
    </Fig>
  )
}

/** 三档收益假设：同一本账，倒计时用中性，区间由悲观~乐观围成 */
export function ReturnTiers() {
  const { t, lang } = useLang(), zh = lang === "zh"
  const tiers = [[t("悲观", "Pessimistic"), 0.03], [t("中性", "Neutral"), 0.05], [t("乐观", "Optimistic"), 0.07]] as const
  const months = tiers.map(([, r]) => {
    const rm = Math.pow(1 + r, 1 / 12) - 1, target = 12000 * 12 / SWR
    let nw = 800000
    for (let m = 0; m < 2400; m++) { if (nw >= target) return m; nw = nw * (1 + rm) + 8000 }
    return 2400
  })
  const max = Math.max(...months)
  return (
    <Fig caption={t("演示账本：月支出 1.2 万、月储蓄 8000、净资产 80 万。倒计时显示中性档；点开数字下面那行，能看到悲观到乐观的年份区间。", "Demo ledger: ¥12k spending, ¥8k saved a month, ¥800k net worth. The countdown uses Neutral; tap the line under it for the pessimistic-to-optimistic range.")}>
      <div className="space-y-2.5">
        {tiers.map(([n, r], i) => (
          <div key={n} className="grid grid-cols-[96px_1fr_92px] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{n} <span className="num">{Math.round(r * 100)}%</span></span>
            <div className="h-5 rounded-md bg-muted/60"><div className="h-full rounded-md" style={{ width: `${(months[i] / max) * 100}%`, background: i === 1 ? "var(--primary)" : "color-mix(in oklch, var(--primary) 35%, transparent)" }} /></div>
            <span className={`num text-right ${i === 1 ? "font-medium text-primary" : ""}`}>{ym(months[i], zh)}</span>
          </div>
        ))}
      </div>
    </Fig>
  )
}
