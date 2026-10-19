import * as React from "react"
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { H2, Lead, Section, Tag } from "@/components/site/Blocks"
import { MAIL, X_HANDLE, X_URL, XHS_ID, XHS_NAME, useLang } from "@/lib/i18n"

// 首页里的「常见问题」「联系我」两段，同时也是 faq.html / contact.html 两个独立页的正文：
// 顶部导航点过去是单独一页，首页往下读还是能看到——同一份，不写两遍
/* ---------- FAQ ---------- */
const FAQ: [string, string, string, string][] = [
  [
    "v1.1 新增了什么？",
    "资产晴雨表、账户分组和信用卡管理、投资持仓与收益、自定义一级分类、消费模拟器、到账记录，以及锁屏应急金和记一笔入口。转账、快捷记账、字号和导航排序也有升级。投资持仓与收益、自定义一级分类是 Pro；消费模拟器有免费与 Pro 两部分。完整范围见使用手册的免费 / Pro 对比。",
    "What's new in v1.1?",
    "Asset weather, account groups and credit-card tools, holdings and returns, custom top-level categories, the spending simulator, received-payment records, and Lock Screen runway and quick entry. Transfers, Quick Capture, text size and navigation order are improved too. Holdings / returns and custom categories require Pro; the spending simulator has both Free and Pro features. See the guide for the full access comparison."
  ],
  [
    "免费版能用多久？哪些要 Pro？",
    "免费版没有使用期限，记账、账户、标签、模板、AA、退款、报销、总预算、导入导出、iCloud 同步、资产晴雨表和小组件都能用。FI 进度与中性倒计时免费，试算滑杆、三档区间、场景比较、Coast / Barista FIRE、高级 FI 参数、投资分析、自定义一级分类和其他进阶功能属于 Pro。月报免费版是一句话摘要；分类预算和完整月报属于 Pro。符合历史免费权益的用户以 App 内保留权益为准。",
    "How long does Free last, and what needs Pro?",
    "Free has no time limit: entries, accounts, tags, templates, splits, refunds, claims, total budgets, import / export, iCloud sync, asset weather and widgets are included. FI progress and the neutral countdown are free. What-If sliders, forecast ranges, scenario comparisons, Coast / Barista FIRE, advanced FI settings, investment analysis, custom top-level categories and other advanced features require Pro. Free reviews have a one-line summary; category budgets and full reviews require Pro. Eligible legacy access is retained as shown in the app."
  ],
  [
    "消费模拟器是不是都收费？",
    "不是。输入一次性消费或每月支出，查看自由日会推迟多久、要工作多久，这些免费。完整的预算、储蓄率和资产影响分析，冷静期，以及「忍住了 / 入手了」清单属于 Pro。「记账时看工时」也是 Pro；时薪看板和账单详情里的工时免费。",
    "Is the spending simulator entirely Pro?",
    "No. Enter a one-off or monthly expense and see its freedom-date impact and work hours for free. Full budget, savings-rate and asset-impact analysis, the cooling-off period and Skipped / Bought lists require Pro. Hours while adding an entry is also Pro; the hourly-rate dashboard and hours on entry details are free."
  ],
  [
    "资产晴雨表为什么显示待评估？",
    "五项指标分别看应急金、负债率、月供比、储蓄率和投资占比。缺少所需账单、还款计划、汇率或有效分母时，会显示待评估，而不是假设晴天。点开指标可看计算依据与缺失信息。投资占比只描述配置，不代表稳定被动收入，也不保证投资回报。晴雨表及天气样式切换免费。",
    "Why does asset weather say Unrated?",
    "The five metrics cover runway, debt ratio, debt payments, savings rate and invested share. A metric is unrated when required entries, repayment schedules, exchange rates or a valid denominator are missing. Open it for the calculation and missing inputs. Invested share describes allocation; it does not equal stable passive income or guarantee returns. Asset weather and its style choices are free."
  ],
  [
    "账户分组、信用卡功能和投资持仓怎么收费？",
    "账户的 FI 分组 / 我的分组、账单 / 概览 / 备注、每月进出、余额走势、校准，以及信用卡额度、账单日、还款日都免费。投资账户按份额 × 单价记录、按代码查价、投入本金与收益分析需要 Pro。查到的价格需主动更新；不表示已连接券商或自动同步所有持仓。",
    "Are account groups, credit-card tools and holdings free?",
    "Account FI / custom groups, Entries / Overview / Notes, monthly flows, balance history, reconciliation, and credit limits / statement / due dates are free. Recording investment units × price, symbol-based price lookup, and contributions / return analysis require Pro. Prices are refreshed on request; this does not connect a brokerage account or automatically sync its holdings."
  ],
  [
    "自定义分类会改变 FIRE 的算法吗？",
    "FI 分类免费。Pro 可以建立自己的一级分类并把二级分类归进去，让记账和数据页按自己的分法显示。每个分类的 FI 角色仍决定它怎样计入支出、储蓄和 FIRE；显示分组不是新的计算口径。账户的「我的分组」是免费功能，与 Pro 的自定义一级分类分开。",
    "Do custom categories change FIRE calculations?",
    "FI categories are free. Pro lets you create top-level categories and assign subcategories for entry and data views. Each category's FI role still determines its treatment in spending, savings and FIRE; display groups do not introduce a new calculation method. Custom account groups are free and are separate from Pro's custom entry categories."
  ],
  [
    "退款和报销为什么在到账日又出现一次？",
    "v1.1 会在钱实际回来的日期显示到账行，账单、日历、搜索和对应账户里都能看到；批量报销可合成一行。这是追踪到账的展示，不是重复登记一笔收入。原账单保留退款 / 报销关系。记账可以不选账户；这种记录不改变任何账户余额。",
    "Why do refunds and reimbursements appear again on the received date?",
    "v1.1 shows a received-payment row on the day the money arrives, in Entries, Calendar, Search and the receiving account. Batch reimbursements may appear as one row. This is a receipt view rather than a duplicate income entry; the original refund / claim link remains. You can log without an account, in which case no account balance changes."
  ],
  [
    "截图和通知记账支持哪些系统？",
    "截图记账在 Coast 支持的系统上可用；通知自动化需要 iOS 27 或以上。快捷指令可以一步步问，也支持转账。识别会保留原币和可识别的优惠；微信支付详情与提现识别有改进，提现要确认转出和转入账户后才保存。验证码、营销信息、未完成付款和仅有余额的页面不会直接当成已付款记账；识别失败时仍需手动核对。识别在设备上进行。",
    "Which systems support screenshot and notification capture?",
    "Screenshot capture works on Coast's supported iOS versions; notification automation needs iOS 27 or later. Shortcuts support step-by-step entry and transfers. Recognized currencies and discounts are kept, with improved WeChat payment details and withdrawal handling. Withdrawals require confirmed source and destination accounts. Codes, promotions, unfinished payments and balance-only screens are not treated as completed purchases; check manually when recognition fails. Recognition runs on device."
  ],
  [
    "小组件为什么没有立刻更新？",
    "App 会在数据变动后发布新快照，并处理跨天、跨月的数据变化，但桌面和锁屏小组件的实际刷新时间由系统安排。先打开 App 确认数据和隐私设置；资产晴雨表小组件有中、大尺寸，锁屏可放应急金或记一笔入口。记一笔入口打开记账面板，不会直接写入一笔账。",
    "Why hasn't a widget updated immediately?",
    "The app publishes a new snapshot after data changes and handles day / month changes, but iOS schedules the actual Home and Lock Screen refresh. Open Coast to confirm its data and privacy settings first. Asset weather has medium and large Home Screen widgets; Lock Screen choices include runway and quick entry. Quick entry opens the entry panel; it does not save an entry automatically."
  ],
  [
    "我的数据存在哪里？需要联网吗？",
    "账本保存在设备和你选择开启的 iCloud 私有数据库里，开发者不接收你的账单。公开汇率、主动查询投资价格、搜索账户 App 图标和购买验证等功能会联网；购买服务涉及匿名购买信息，详情见隐私政策。截图和通知的识别内容不上传。",
    "Where is my data stored, and does Coast use the network?",
    "Your ledger is stored on your device and, when enabled, in your private iCloud database; the developer does not receive your entries. Public rates, requested investment-price lookups, account app-icon searches and purchase validation use the network. Purchase services involve anonymous purchase information, described in the Privacy Policy. Screenshot and notification recognition content is not uploaded."
  ],
  [
    "如何在多台设备间同步？",
    "在 iPhone、iPad、Mac 登录同一个 Apple 账户并开启 Coast 的 iCloud 同步。同步受网络、系统后台调度和 iCloud 状态影响；可在设置 → iCloud 同步详情查看状态和实时推送，不承诺每次都在几秒内完成。",
    "How do I sync across devices?",
    "Use the same Apple account on iPhone, iPad and Mac and enable iCloud sync in Coast. Timing depends on the network, background scheduling and iCloud state. Settings → iCloud Sync Details shows status and Live Push; a fixed delivery time is not guaranteed."
  ],
  [
    "能导入以前的账单吗？",
    "可以。支持 CSV / XLSX，自动识别 UTF-8 和 GB18030；支持的记账和支付平台导出格式可直接导入。其他格式可按导入页的模板与提示词转换；PDF 或截图不直接作为账单表格导入。导入前核对净资产和账户余额，导入批次可撤销。",
    "Can I import my old records?",
    "Yes. CSV / XLSX supports automatic UTF-8 and GB18030 detection; supported budgeting and payment-platform exports import directly. Use the import template and prompt to convert other formats. PDFs and screenshots are not imported directly as entry tables. Reconcile net worth and account balances before import; an import batch can be undone."
  ],
  [
    "会员是订阅吗？",
    "可以包年，也可以一次买断永久版，永久版不转订阅。美元参考价为包年 $4.99、永久 $9.99；符合条件的包年用户可试用 7 天。地区价格、优惠和试用资格以 App Store 购买页为准。订阅在取消前会自动续费，可在 App Store 账户设置管理。",
    "Is Pro a subscription?",
    "Choose a yearly subscription or a one-time Lifetime purchase; Lifetime never converts to a subscription. USD reference prices are $4.99 yearly and $9.99 Lifetime, with a 7-day yearly trial for eligible users. Regional prices, offers and trial eligibility are shown on the App Store purchase sheet. Subscriptions renew until cancelled and can be managed in your App Store account settings."
  ],
  [
    "如何恢复购买？续费失败会怎样？",
    "使用购买时的 Apple 账户，在 Coast 会员页点「恢复购买」。若续费扣款失败，请在 App Store 更新支付方式；是否仍有会员权益取决于 Apple 返回的有效订阅与宽限期状态，不能保证一直可用。恢复不了时，可附上购买状态和问题描述联系支持。",
    "How do I restore purchases, and what if renewal fails?",
    "Use the Apple account that made the purchase and tap Restore Purchases on the Coast Pro page. Update your payment method in App Store if renewal fails. Continued Pro access depends on the valid subscription or grace-period state returned by Apple and is not guaranteed indefinitely. If restoration fails, contact support with your purchase status and a description of the problem."
  ]
]
export function Faq() {
  const { t, lang } = useLang()
  return (
    <Section id="faq">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag>FAQ</Tag>
          <H2>{t("常见问题", "Questions")}</H2>
          <a href={`guide.html?lang=${lang}#pro`} className="mt-5 block text-sm font-medium text-primary hover:underline">{t("完整免费 / Pro 对比 →", "Full Free / Pro comparison →")}</a>
          <a href={`mailto:${MAIL}`} className="tag mt-5 inline-block text-primary hover:underline">{t("没找到答案？写信给我们 →", "Not answered? Email us →")}</a>
        </div>
        <Accordion>
          {FAQ.map((q, i) => (
            <AccordionItem key={i} value={String(i)} className="border-rule">
              <AccordionTrigger className="py-4 text-[15px] font-medium">{lang === "zh" ? q[0] : q[2]}</AccordionTrigger>
              <AccordionContent className="max-w-[600px] text-[14.5px] leading-relaxed text-muted-foreground">{lang === "zh" ? q[1] : q[3]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}

/* ---------- 联系我 ---------- */
export function Contact() {
  const { t } = useLang()
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(XHS_ID); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* 剪贴板不可用时就让用户看着号手动输 */ }
  }
  const card = "flex flex-col rounded-2xl border border-rule bg-card p-6 transition-colors hover:border-primary/40"
  return (
    <Section id="contact">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag>Contact</Tag>
          <H2>{t("联系我", "Get in touch")}</H2>
          <Lead>{t("Coast 是我一个人做的。用着哪里不顺手、想要什么功能，或者只是想聊聊记账和 FIRE，都欢迎来找我。", "Coast is built by one person. If something feels off, there's a feature you want, or you just want to talk budgeting and FIRE, I'd love to hear from you.")}</Lead>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <a href={X_URL} rel="noopener" target="_blank" className={card}>
            <div className="grid size-10 place-items-center rounded-xl bg-foreground text-lg font-semibold text-background">𝕏</div>
            <div className="mt-5 text-sm text-muted-foreground">X</div>
            <div className="mt-1 font-medium">@{X_HANDLE}</div>
            <div className="mt-auto flex items-center gap-1 pt-5 text-sm text-primary">{t("去关注", "Follow")}<ArrowUpRight className="size-4" /></div>
          </a>
          <button type="button" onClick={copy} className={`${card} text-left`}>
            <div className="grid size-10 place-items-center rounded-xl bg-[#FF2442] text-[11px] font-bold text-white">{t("小红书", "RED")}</div>
            <div className="mt-5 text-sm text-muted-foreground">{t("小红书", "Xiaohongshu")}</div>
            <div className="mt-1 font-medium">@{XHS_NAME}</div>
            <div className="num mt-1 text-xs text-muted-foreground">{t("小红书号", "ID")} {XHS_ID}</div>
            <div className="mt-auto flex items-center gap-1 pt-5 text-sm text-primary">
              {copied ? <><Check className="size-4" />{t("已复制", "Copied")}</> : <><Copy className="size-4" />{t("复制小红书号", "Copy ID")}</>}
            </div>
          </button>
          <a href={`mailto:${MAIL}`} className={card}>
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Mail className="size-5" /></div>
            <div className="mt-5 text-sm text-muted-foreground">Email</div>
            <div className="mt-1 break-all font-medium">{MAIL}</div>
            <div className="mt-auto flex items-center gap-1 pt-5 text-sm text-primary">{t("写信", "Write")}<ArrowUpRight className="size-4" /></div>
          </a>
        </div>
      </div>
    </Section>
  )
}
