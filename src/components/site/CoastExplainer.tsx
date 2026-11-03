import { ArrowDown, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function CoastExplainer({ page, freedomMonths }: { page: number; freedomMonths: number | null }) {
  const { t } = useLang()
  return <div className={`coast-explainer coast-explainer-${page}`}>
    {page === 0 && <>
      <div className="coast-input-flow">
        <div><span>{t("月支出", "Monthly spending")}</span><strong>¥8,000</strong></div>
        <div><span>{t("每月储蓄", "Monthly savings")}</span><strong>¥12,000</strong></div>
        <div><span>{t("净资产", "Net worth")}</span><strong>¥500,000</strong></div>
      </div>
      <ArrowDown className="coast-flow-arrow" size={18} aria-hidden="true" />
      <div className="coast-diagram-result"><div><span>{t("距离标准 FI", "Until Standard FI")}</span><strong>{freedomMonths === null ? "—" : t(`${Math.floor(freedomMonths / 12)} 年${freedomMonths % 12 ? ` ${freedomMonths % 12} 个月` : ""}`, `${Math.floor(freedomMonths / 12)} years${freedomMonths % 12 ? ` ${freedomMonths % 12} months` : ""}`)}</strong></div></div>
      <p className="coast-assumption">{t("演示：年化 5% · 提取率 4% · 目标 240 万", "Demo: 5% annual return · 4% withdrawal · ¥2.4m goal")}</p>
    </>}
    {page === 1 && <>
      <div className="coast-role-list">
        {[
          [t("固定", "Fixed"),t("房租、订阅", "Rent, subscriptions"),t("按期发生", "Recurring costs")],
          [t("必要", "Essential"),t("吃饭、通勤", "Meals, commuting"),t("基本生活", "Everyday needs")],
          [t("弹性", "Flexible"),t("聚餐、购物", "Dining out, shopping"),t("可按需调整", "Adjustable")],
          [t("其他", "Other"),t("一次性大事", "One-off events"),t("默认不进 FI", "Outside FI by default")],
        ].map(([role, examples, meaning], i) => <div key={role} className={i === 2 ? "role-flexible" : ""}><strong>{role}</strong><span>{examples}</span><small>{meaning}</small></div>)}
      </div>
      <div className="coast-role-targets"><span>{t("固定 + 必要", "Fixed + essential")}<ArrowRight size={12} aria-hidden="true" />{t("基本生活目标（Lean FI）", "Lean FI goal")}</span><span>{t("再加弹性", "Add flexible")}<ArrowRight size={12} aria-hidden="true" />{t("当前生活目标（标准 FI）", "Standard FI goal")}</span></div>
    </>}
    {page === 2 && <>
      <div className="coast-ledger-equation"><div><span>{t("对账确认的余额", "Reconciled balance")}</span><strong>¥12,000</strong></div><div><span>{t("＋ 之后的净流水", "+ Subsequent net entries")}</span><strong>¥1,200</strong></div></div>
      <div className="coast-diagram-result"><div><span>{t("＝ 现在的余额", "= Current balance")}</span><strong>¥13,200</strong></div></div>
      <p className="coast-assumption">{t("示例：原账面 11,780 → 校准 +220，差额单独留痕", "Example: recorded ¥11,780 → a separate +¥220 reconciliation adjustment")}</p>
    </>}
    {page === 3 && <>
      <div className="coast-ledger-equation"><div><span>{t("外套原价", "Original coat purchase")}</span><strong>¥599</strong></div><div><span>{t("− 关联退款", "− Linked refund")}</span><strong>¥200</strong></div></div>
      <div className="coast-diagram-result"><div><span>{t("＝ 实际支出", "= Net spending")}</span><strong>¥399</strong></div></div>
      <p className="coast-assumption">{t("退款冲减原支出，不再额外算一笔收入", "The refund reduces spending instead of adding income")}</p>
    </>}
    {page === 4 && <><div className="coast-ledger-equation"><div><span>{t("商品价格", "Purchase price")}</span><strong>¥1,200</strong></div><div><span>{t("÷ 示例时薪", "÷ Demo hourly rate")}</span><strong>¥60</strong></div></div><div className="coast-diagram-result"><div><span>{t("＝ 要工作", "= Working time")}</span><strong>{t("20 小时", "20 hours")}</strong></div></div><p className="coast-assumption">{t("工时来自工作收入与工作时间；自由日影响在消费模拟中另行试算", "Hourly rate uses work income and hours; freedom-date impact is calculated separately")}</p></>}
    {page === 5 && <><div className="coast-scenario-rows"><div><span>{t("现在的生活", "Current life")}</span><strong>{t("月支出 ¥8,000", "Spend ¥8,000 / mo")}</strong></div><div><span>{t("换个城市", "Move cities")}</span><strong>{t("月支出 ¥6,000", "Spend ¥6,000 / mo")}</strong></div><div><span>{t("收入增加", "Earn more")}</span><strong>{t("月收入 +¥3,000", "Income +¥3,000 / mo")}</strong></div></div><p className="coast-assumption">{t("示例方案 · 同一组资产与假设下比较自由日，方案可保存", "Example scenarios · compare freedom dates with shared assets and assumptions, then save")}</p></>}

  </div>
}
