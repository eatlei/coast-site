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

  if (lang === "en") return (
    <DocPage title="Coast Privacy Policy" subtitle="Effective date: August 26, 2026">
      <Alert><AlertTitle>The short version: Coast does not collect any of your data.</AlertTitle><AlertDescription>Your transactions and asset data live only on your device and in your personal iCloud private database. We run no servers and cannot see your data.</AlertDescription></Alert>
      <H>What data we collect</H>
      <P>None. Coast has no account system, no servers of its own, and contains no third-party analytics, advertising, or tracking SDKs. Everything you record in the app is stored only in:</P>
      <UL items={["local storage on your device;", <>your own iCloud private database (if you enable iCloud sync). iCloud data is managed by Apple under its {apple}, is accessible only to your Apple account, and cannot be read by Coast's developer.</>]} />
      <H>Network requests</H>
      <P>Coast's only outgoing network request fetches public currency exchange rates, used to convert multi-currency accounts. This request contains no personal information or device identifiers.</P>
      <H>System permissions</H>
      <UL items={[<><b>Notifications</b> — used only to remind you to update your asset snapshot on the 1st of each month. You can turn this off in Settings at any time.</>, <><b>Photo library (add only)</b> — used only to save a share image to your photo library when you explicitly choose to. Coast requests add-only access and never reads your photos.</>]} />
      <H>Purchases</H>
      <P>Coast Pro subscriptions and the lifetime purchase are handled entirely through Apple's In-App Purchase. Payment is processed by Apple; we never see your payment information.</P>
      <H>Children's privacy</H>
      <P>Coast collects no user data, and therefore does not collect personal information from children.</P>
      <H>Changes to this policy</H>
      <P>If this policy changes, we will update this page and revise the effective date. Given Coast's architecture (no servers, no data collection), material changes are unlikely.</P>
      <H>Contact</H>
      <P>For any privacy questions, email {mail}.</P>
    </DocPage>
  )
  return (
    <DocPage title="Coast 隐私政策" subtitle="生效日期：2026 年 8 月 26 日">
      <Alert><AlertTitle>一句话版本：Coast 不收集你的任何数据。</AlertTitle><AlertDescription>你的账单和资产数据只存在你自己的设备与你个人的 iCloud 私有数据库中，我们没有服务器，也无法看到它们。</AlertDescription></Alert>
      <H>我们收集哪些数据</H>
      <P>不收集。Coast 没有账号系统、没有自有服务器、不含任何第三方统计、广告或追踪 SDK。你在 App 中记录的账单、账户、预算、资产快照等全部数据仅保存在：</P>
      <UL items={["你的设备本地；", <>你自己的 iCloud 私有数据库（如果你开启了 iCloud 同步）。iCloud 数据由 Apple 按其{apple}管理，仅你本人的 Apple 账户可以访问，Coast 的开发者无法读取。</>]} />
      <H>网络请求</H>
      <P>Coast 唯一的主动网络请求是获取公开的货币汇率，用于多币种账户的折算。该请求不包含任何个人信息或设备标识。</P>
      <H>系统权限</H>
      <UL items={[<><b>通知</b>：仅用于每月 1 日提醒你更新资产快照，可随时在系统设置中关闭。</>, <><b>相册（仅添加）</b>：仅在你主动保存分享图时，向相册写入一张图片。Coast 只申请「添加」权限，从不读取你的照片。</>]} />
      <H>购买</H>
      <P>Coast Pro 的订阅与买断均通过 Apple 的 App 内购买完成。支付由 Apple 处理，我们不接触你的任何支付信息。</P>
      <H>儿童隐私</H>
      <P>Coast 不收集任何用户数据，因此也不会收集儿童的个人信息。</P>
      <H>政策变更</H>
      <P>如本政策发生变更，我们会在此页面更新并调整生效日期。由于 Coast 的架构（无服务器、无数据收集），实质性变更的可能性很小。</P>
      <H>联系我们</H>
      <P>关于隐私的任何疑问，请发邮件至 {mail}。</P>
    </DocPage>
  )
}
