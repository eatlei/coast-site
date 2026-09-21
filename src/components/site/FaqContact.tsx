import * as React from "react"
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { H2, Lead, Section, Tag } from "@/components/site/Blocks"
import { MAIL, X_HANDLE, X_URL, XHS_ID, XHS_NAME, useLang } from "@/lib/i18n"

// 首页里的「常见问题」「联系我」两段，同时也是 faq.html / contact.html 两个独立页的正文：
// 顶部导航点过去是单独一页，首页往下读还是能看到——同一份，不写两遍
/* ---------- FAQ ---------- */
const FAQ = [
  ["我的数据存在哪里？", "只在你的设备和你自己的 iCloud 私有数据库里。Coast 没有服务器，开发者看不到你的任何数据。", "Where is my data stored?", "Only on your device and in your own iCloud private database. Coast has no servers; the developer cannot see any of your data."],
  ["如何在多台设备间同步？", "登录同一个 Apple 账户并开启 iCloud，数据会自动同步。", "How do I sync across devices?", "Sign in with the same Apple account with iCloud enabled, and your data syncs automatically."],
  ["能导入以前的账单吗？", "可以。支持 CSV / XLSX，UTF-8 和 GB18030 编码自动识别，常见记账 App 导出的文件可以直接导入。账户名会模糊匹配，自动去重，整批可撤销。", "Can I import my old records?", "Yes. CSV / XLSX with automatic UTF-8 and GB18030 detection; exports from most expense apps import directly. Account names are fuzzy-matched, duplicates skipped, and the whole batch can be undone."],
  ["免费版能用多久？", "永久。记账不限量，账户、预算、导入导出和 FI 倒计时都不收费。会员解锁的是达成区间、场景模拟这类「推演未来」的功能。", "How long does the free version last?", "Forever. Unlimited entries, accounts, budgets, import/export and the FI countdown are all free. Pro unlocks projection features like achievement range and scenarios."],
  ["会员是订阅吗？", "两种都有。包年 ¥30，前 7 天免费试用；永久 ¥60 一次买断，不转订阅。订阅可随时在 App Store 账户设置里取消。", "Is Pro a subscription?", "Your choice. Yearly is $4.99 with a 7-day free trial; Lifetime is $9.99 once and never converts to a subscription. Cancel anytime in your App Store settings."],
  ["如何恢复购买？", "在 Coast 会员页面底部点「恢复购买」。续费扣款遇到问题时，请在 App Store 账户里更新支付方式，期间功能不受影响。", "How do I restore purchases?", "Tap \"Restore Purchases\" at the bottom of the Coast Pro page. If a renewal fails, update your payment method in your App Store account; features stay on in the meantime."],
]
export function Faq() {
  const { t, lang } = useLang()
  return (
    <Section id="faq">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div>
          <Tag>FAQ</Tag>
          <H2>{t("常见问题", "Questions")}</H2>
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
