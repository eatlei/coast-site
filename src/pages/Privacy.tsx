import { DocPage } from "@/components/site/Shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MAIL, useLang } from "@/lib/i18n"

export default function Privacy() {
  const { lang } = useLang()
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-2 mt-8 text-xl font-semibold">{children}</h2>
  const P = ({ children }: { children: React.ReactNode }) => <p className="leading-relaxed text-muted-foreground">{children}</p>
  const UL = ({ items }: { items: React.ReactNode[] }) => <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-muted-foreground">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
  const mail = <a href={`mailto:${MAIL}`} className="text-primary hover:underline">{MAIL}</a>
  const apple = <a href="https://www.apple.com/legal/privacy/" rel="noopener" className="text-primary hover:underline">{lang === "zh" ? "隐私政策" : "privacy policy"}</a>

  const rc = <a href="https://www.revenuecat.com/privacy/" rel="noopener" className="text-primary hover:underline">{lang === "zh" ? "隐私政策" : "privacy policy"}</a>

  if (lang === "en") return (
    <DocPage title="Coast Privacy Policy" subtitle="Effective date: October 14, 2026">
      <Alert><AlertTitle>The short version: Coast does not collect your financial data.</AlertTitle><AlertDescription>Your transactions, accounts and asset data live only on your device and in your personal iCloud private database. We run no servers and cannot see them. The only thing that leaves your device about you is anonymous purchase statistics (see below).</AlertDescription></Alert>
      <H>What data we collect</H>
      <P>Coast has no account system and no servers of its own, and contains no advertising or tracking SDKs. Everything you record in the app — transactions, accounts, budgets, holdings, categories and settings — is stored only in:</P>
      <UL items={["local storage on your device;", <>your own iCloud private database and iCloud key-value storage (if you enable iCloud sync). iCloud data is managed by Apple under its {apple}, is accessible only to your Apple account, and cannot be read by Coast's developer.</>]} />
      <P>The one exception is purchase statistics, described under "Network requests".</P>
      <H>Network requests</H>
      <UL items={[
        <><b>Exchange rates</b> — fetches public currency exchange rates to convert multi-currency accounts. Contains no personal information or device identifiers.</>,
        <><b>Investment prices</b> — only when you tap "Update price" on an investment account. Coast sends just the security / fund code you entered (e.g. 600519) to Tencent Finance's public quote service. No ledger data or device identifiers are sent.</>,
        <><b>App icon search</b> — only when you search for an app icon while choosing an account icon. Coast sends just your search term to Apple's App Store search service and downloads the icon image from Apple.</>,
        <><b>Purchase statistics</b> — Coast uses RevenueCat, a third-party service, to understand subscriptions (trial conversion, renewals, refunds). It receives a random anonymous ID and your Coast purchase records (product, time, price, trial / renewal / refund status). It receives none of your transactions, accounts or asset data, and nothing is used for advertising or tracking. See RevenueCat's {rc}.</>,
      ]} />
      <H>System permissions</H>
      <UL items={[<><b>Notifications</b> — used only for reminders you turn on, such as the monthly asset-snapshot reminder, "recorded" confirmations from Quick Capture, and cooling-off reminders in the spend simulator. You can turn them off in Settings at any time.</>, <><b>Photo library (add only)</b> — used only to save a share image to your photo library when you explicitly choose to. Coast requests add-only access and never reads your photos.</>]} />
      <H>Purchases</H>
      <P>Coast Pro subscriptions and the lifetime purchase are handled entirely through Apple's In-App Purchase. Payment is processed by Apple; we never see your payment information.</P>
      <H>Children's privacy</H>
      <P>Coast does not collect personal information, including from children.</P>
      <H>Changes to this policy</H>
      <P>If this policy changes, we will update this page and revise the effective date.</P>
      <H>Contact</H>
      <P>For any privacy questions, email {mail}.</P>
    </DocPage>
  )
  return (
    <DocPage title="Coast 隐私政策" subtitle="生效日期：2026 年 10 月 14 日">
      <Alert><AlertTitle>一句话版本：Coast 不收集你的记账数据。</AlertTitle><AlertDescription>你的账单、账户和资产数据只存在你自己的设备与你个人的 iCloud 私有数据库中，我们没有服务器，也无法看到它们。唯一会离开你设备、和你有关的，是匿名的购买统计（见下文）。</AlertDescription></Alert>
      <H>我们收集哪些数据</H>
      <P>Coast 没有账号系统、没有自有服务器，不含任何广告或追踪 SDK。你在 App 中记录的账单、账户、预算、持仓、分类和设置等全部数据仅保存在：</P>
      <UL items={["你的设备本地；", <>你自己的 iCloud 私有数据库和 iCloud 键值存储（如果你开启了 iCloud 同步）。iCloud 数据由 Apple 按其{apple}管理，仅你本人的 Apple 账户可以访问，Coast 的开发者无法读取。</>]} />
      <P>唯一的例外是购买统计，见下方「网络请求」。</P>
      <H>网络请求</H>
      <UL items={[
        <><b>汇率</b>：获取公开的货币汇率，用于多币种账户的折算。不包含任何个人信息或设备标识。</>,
        <><b>投资行情</b>：仅在你给投资账户点「更新价格」时发出。只发送你填写的证券 / 基金代码（如 600519）到腾讯财经的公开行情接口，不包含任何账本数据或设备标识。</>,
        <><b>App 图标搜索</b>：仅在你给账户选图标、主动搜索 App 时发出。只发送你输入的搜索词到 Apple 的 App Store 搜索接口，并从 Apple 下载图标图片。</>,
        <><b>购买统计</b>：Coast 使用第三方服务 RevenueCat 了解订阅情况（试用转化、续费、退款）。它收到的是一个随机的匿名 ID 和你在 Coast 内的购买记录（商品、时间、价格、是否试用 / 续费 / 退款），不包含你的任何账单、账户或资产数据，也不用于广告或跟踪。详见 RevenueCat 的{rc}。</>,
      ]} />
      <H>系统权限</H>
      <UL items={[<><b>通知</b>：仅用于你开启的提醒，例如每月更新资产快照、快捷记账「已记一笔」、消费模拟器冷静期到期，可随时在系统设置中关闭。</>, <><b>相册（仅添加）</b>：仅在你主动保存分享图时，向相册写入一张图片。Coast 只申请「添加」权限，从不读取你的照片。</>]} />
      <H>购买</H>
      <P>Coast Pro 的订阅与买断均通过 Apple 的 App 内购买完成。支付由 Apple 处理，我们不接触你的任何支付信息。</P>
      <H>儿童隐私</H>
      <P>Coast 不收集个人信息，也不会收集儿童的个人信息。</P>
      <H>政策变更</H>
      <P>如本政策发生变更，我们会在此页面更新并调整生效日期。</P>
      <H>联系我们</H>
      <P>关于隐私的任何疑问，请发邮件至 {mail}。</P>
    </DocPage>
  )
}
