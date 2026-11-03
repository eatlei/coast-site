import { useLang } from "@/lib/i18n"

/** Neutral line drawings of the bookkeeping view being compared, not another app's UI. */
export function ConventionalSketch({ page }: { page: number }) {
  const { t } = useLang()
  return <svg className="comparison-sketch" viewBox="0 0 320 200" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={[
    t("账单与消费分布图", "A ledger and a spending chart"), t("按消费用途展开的分类树", "A category tree organized by purchase type"), t("记录账户余额的账页", "An account balance ledger"), t("支出与回款分别记录", "Spending and money returned recorded separately"),
    t("商品价格标签", "A price tag"), t("过去的收支记录", "Past income and expense entries"),
  ][page]}>
    {page === 0 && <>
      <path d="M44 26H168V170L156 163L144 170L132 163L120 170L108 163L96 170L84 163L72 170L60 163L44 170Z" />
      <path d="M62 50H148M62 65H120M62 112H94M118 112H148M62 132H94M118 132H148" />
      <text x="61" y="95" fill="currentColor" stroke="none" fontSize="22">¥8,000</text>
      <circle cx="237" cy="83" r="43" /><path d="M237 40V83H280M237 83L206 113" /><path d="M199 151H214M225 151H241M251 151H269" />
    </>}
    {page === 1 && <>
      <rect x="117" y="25" width="86" height="40" rx="6" /><path d="M160 65V95M63 95H257M63 95V117M160 95V117M257 95V117" />
      <rect x="22" y="117" width="82" height="38" rx="6" /><rect x="119" y="117" width="82" height="38" rx="6" /><rect x="216" y="117" width="82" height="38" rx="6" />
      <text x="160" y="51" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14">{t("餐饮", "Food")}</text>
      {[t("早餐", "Breakfast"),t("午餐", "Lunch"),t("晚餐", "Dinner")].map((label,i) => <text key={label} x={63+i*97} y="141" textAnchor="middle" fill="currentColor" stroke="none" fontSize="12">{label}</text>)}
      <path d="M63 155V174M160 155V174M257 155V174M50 174H76M147 174H173M244 174H270" />
    </>}
    {page === 2 && <>
      <rect x="43" y="30" width="202" height="140" rx="8" /><path d="M43 66H245M63 88H107M63 112H117M63 136H96M148 110H220M148 134H207" />
      <text x="144" y="93" fill="currentColor" stroke="none" fontSize="18">¥12,000</text>
      <path d="M218 148L254 112L265 123L229 159L213 164ZM254 112L259 107Q263 103 267 107L270 110Q274 114 270 118L265 123M218 148L229 159" />
    </>}
    {page === 3 && <>
      <rect x="37" y="38" width="246" height="123" rx="8" /><path d="M37 99H283M61 68H91M82 59L91 68L82 77M91 130H61M70 121L61 130L70 139" />
      <text x="123" y="76" fill="currentColor" stroke="none" fontSize="22">− ¥599</text>
      <text x="123" y="138" fill="currentColor" stroke="none" fontSize="22">+ ¥200</text>
    </>}
    {page === 4 && <><path d="M100 35H225L278 100L225 165H100Z"/><circle cx="238" cy="100" r="6"/><text x="155" y="109" textAnchor="middle" fill="currentColor" stroke="none" fontSize="26">¥1,200</text></>}
    {page === 5 && <><path d="M40 145H280M50 50V145M80 122L130 96L180 108L235 63"/><circle cx="80" cy="122" r="4"/><circle cx="130" cy="96" r="4"/><circle cx="180" cy="108" r="4"/><circle cx="235" cy="63" r="4"/></>}

  </svg>
}
