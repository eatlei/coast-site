import * as React from "react"
import { Shuffle } from "lucide-react"
import { DocPage } from "@/components/site/Shell"
import { BASE, useLang } from "@/lib/i18n"
import { REDUCED, gsap, useGSAP } from "@/lib/gsap"

/** [中文标题, 中文说明, 英文标题, 英文说明]；说明可为空 */
type Item = [string, string, string, string]
type Section = { title: [string, string]; items: Item[] }
type Version = { v: string; date: [string, string]; intro: [string, string]; sections: Section[] }

const VERSIONS: Version[] = [
  {
    v: "1.0.8",
    date: ["2026 年 10 月", "Oct 2026"],
    intro: [
      "iPad 终于用上了整块屏幕；快捷记账能当场选账户、写备注；跨币种转账记下实际到账；标签可以分组；资产页能排序、能把账户排除在净资产之外。大账本打开更快，导入也修了几个坑。",
      "Coast finally uses the whole iPad screen. Quick Capture lets you pick the account and add a note on the spot. Cross-currency transfers keep the amount that actually arrived. Tags can be grouped, and accounts can be reordered or left out of net worth. Large ledgers open faster, and several import issues are fixed.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["iPad 铺满全屏", "左边一条窄图标栏；账单页左边是本月预算、财务自由、分类构成和快速入口，右边是账单流；资产页选一个账户，右边直接看它的详情；数据页、FIRE 页按屏幕宽度排成两列或三列。账单详情改成弹窗，不再摊满一整屏。", "Full-screen iPad", "A slim icon bar on the left. Entries shows this month's budget, freedom goal, category breakdown and shortcuts on the left with your entries on the right; on Assets, pick an account and its details open alongside; Data and FIRE lay out in two or three columns depending on width. Entry details open in a sheet instead of filling the screen."],
        ["快捷记账当场改", "iOS 26 上确认时弹一张卡片：点常用分类、点账户、加备注，或者交给 Coast 打开记账面板改完再存。iOS 18 上选完分类可以接着选账户、加备注。", "Edit as you capture", "On iOS 26, confirming shows a card: tap a frequent category or an account, add a note, or hand it to Coast to finish in the entry panel. On iOS 18 you can pick the account and add a note after choosing the category."],
        ["跨币种转账记实际到账", "人民币转进美元账户，转入那边可以填银行实际到的数（比如 $1,380），之后汇率怎么变，美元账户的历史余额都不跟着漂，跟银行流水对得上。不填就按当时的汇率算好记下来。", "Cross-currency transfers keep what arrived", "Moving CNY into a USD account? Enter the amount that actually landed (say $1,380), and that account's history no longer drifts with exchange rates — it matches your bank. Leave it blank and the rate at the time is used and saved."],
        ["标签分组", "标签可以分组，选标签变成按组排的胶囊，最近用过的在最上面，还能搜索、就地新建。标签管理里点「编辑」就能新建分组、换组、调顺序。", "Tag groups", "Group your tags. The tag picker now shows them as chips by group, with recent ones on top, search, and create-on-the-spot. In Manage Tags, tap Edit to create groups, move tags and reorder."],
        ["账户排序与「不计入净资产」", "资产页「整理账户」：拖动调整账户顺序、调整资产类型的先后。某个账户（比如替家人管的卡）可以设成不计入净资产：余额照常显示，但不进净资产、走势和 FIRE。", "Account order and \"Exclude from net worth\"", "Arrange Accounts on the Assets tab: drag accounts and reorder asset types. Mark an account — say, a card you manage for family — as excluded from net worth: its balance still shows, but it stays out of net worth, trends and FIRE."],
        ["账户详情看来龙去脉", "每个账户都有近 12 个月的余额走势（按账户自己的币种）和每次校准的记录：校准前算出来多少、校准成多少、差了多少。", "Account history", "Every account now shows a 12-month balance trend in its own currency, plus each reconciliation: what was expected, what you set, and the difference."],
        ["预算可以用外币设", "预算编辑器多了币种，比如每月 10 万日元——存的就是 10 万日元，汇率变了预算本身不变，用的时候再按当前汇率折算。", "Budgets in any currency", "Choose a currency in the budget editor — e.g. ¥100,000 JPY a month. The budget stays in that currency and is converted at the current rate when compared."],
        ["选账户按资产分组", "记账、转账、报销时选账户，按现金、投资、应收、负债分段排，顺序跟资产页一样。", "Accounts grouped when picking", "When choosing an account for an entry, transfer or reimbursement, accounts are grouped by cash, investments, receivables and liabilities, in your Assets order."],
        ["每天的展开收起记得住", "账单页收起的那几天，下次打开还是收起的（只存在这台设备上）。", "Collapsed days stay collapsed", "Days you collapse on the entry list stay that way next time (stored on this device only)."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["大账本打开更快", "启动时的整理工作挪到了后台，没改动的数据不再反复写入；几千笔账单的账本打开后不会再连续卡顿。", "Faster with large ledgers", "Startup housekeeping now runs in the background and unchanged data is no longer rewritten, so ledgers with thousands of entries no longer stutter after opening."],
        ["通知记账认得更准", "「有一笔 42.00 元的支出」这种金额在前的写法也认得了，不会再去抓后面广告、积分里的数字。", "Smarter notification capture", "Amount-first wording like \"a ¥42.00 payment\" is now understood, and numbers from ads or reward points later in the message are ignored."],
        ["数据页数字滚出来", "第一次打开数据页，收支统计的几个数从 0 滚到真实值。", "Numbers roll in on Data", "The first time you open Data, the income and spending figures roll up from zero."],
        ["预算缺汇率不再显示「超支」", "外币预算还没拿到汇率时，不再当成 0 显示超支，而是写明缺哪种币的汇率。", "No false \"over budget\"", "A foreign-currency budget without an exchange rate no longer shows as over budget; it says which rate is missing."],
        ["单笔报销缺汇率时说清楚", "跨币种报销缺汇率时，会说明缺哪种币，并提示可以手填冲销金额，不再默默变灰。", "Clearer reimbursements without a rate", "A cross-currency reimbursement missing a rate now says which currency, and lets you type the amount to offset instead of silently greying out."],
        ["快速入口和选账户不再无故截断", "旁边明明有空，名字却显示成「招行储…」的问题修好了；小屏放不下时整排去掉图标，字号不缩。", "No more needless truncation", "Names like \"China Merchants…\" no longer cut off when there's room; on small screens shortcuts drop their icons together instead of shrinking the text."],
        ["英文界面排版", "卡片标题、指标标签单行显示，长译文改短，账户页按钮等宽。", "English layout", "Card titles and metric labels stay on one line, long translations are shorter, and account buttons are equal width."],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["导入时提示「没有解析到有效账单行」（Windows / Excel 导出的表格）", "", "Imports from Windows / Excel files said \"no valid rows found\"", ""],
        ["导入的收入被记成支出", "", "Imported income could be recorded as spending", ""],
        ["导入两位数年份的表格后，一打开就闪退", "", "The app crashed on launch after importing dates with two-digit years", ""],
        ["通知记账把 42 元记成 19.90 元、3 元", "", "Notification capture recorded ¥42 as ¥19.90 or ¥3", ""],
        ["展开、收起某一天时，日期头先飘上去、不跟卡片走", "", "Day headers drifted instead of moving with the card when expanding or collapsing", ""],
      ] },
    ],
  },
  {
    v: "1.0.7",
    date: ["2026 年 10 月", "Oct 2026"],
    intro: [
      "付完款不用打开 Coast 也能记一笔：截图记账回来了，iOS 27 起付款通知也能自动记；账单能批量改了；设置重新分了组、能搜；全部币种可选；分类图标还能换形状。",
      "Record a payment without opening Coast: Screenshot Capture is back, and on iOS 27 payment notifications can record themselves. Batch-edit entries, a regrouped and searchable Settings, every currency to choose from — and new shapes for category icons.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["截图记账", "一键添加快捷指令，绑到轻点背面、操作按钮或控制中心。停在支付宝、微信、云闪付的付款成功页触发一下，金额、商户、付款卡自动认出来。识别全在手机本地，截图不上传。设置 → 快捷记账。", "Screenshot Capture", "Add the shortcut in one tap and bind it to Back Tap, the Action button or Control Center. Trigger it on a payment success screen in Alipay, WeChat or UnionPay and the amount, merchant and card are read automatically — all on your iPhone, nothing uploaded. Settings → Quick Capture."],
        ["记之前选分类", "默认弹一个分类列表：猜的那个排第一，后面是你最近常用的，点哪个记哪个，不用事后再去改。也可以改成只确认、打开记账面板，或者直接记。", "Pick the category as you capture", "By default you get a short list — the best guess first, then your recent favorites — and tap to record. Or switch to confirm-only, open the entry panel, or record straight away."],
        ["通知记账（iOS 27）", "支付宝、微信、银行的付款通知一到就自动记一笔，不用截屏。设置里有一步一步的搭建教程；验证码、快递、促销这些不是付款的通知会自动跳过。", "Notification Capture (iOS 27)", "Payment notifications from Alipay, WeChat or your bank record themselves — no screenshot needed. Settings has a step-by-step guide; verification codes, deliveries and promotions are skipped automatically."],
        ["快捷记账按你的规则记", "默认记到哪个分类、按卡号尾号认哪个账户、给「零钱」这类叫法配匹配词；在快捷指令里还能单独指定方向、分类、账户、标签和备注，比如「公司卡」那条固定打上报销标签。", "Quick Capture, your way", "Set default categories, match accounts by card number or by names like \"Balance\", and in Shortcuts override direction, category, account, tags and note per shortcut — e.g. a Company Card shortcut that always tags Reimbursable."],
        ["批量修改账单", "多选之后一次改分类、账户、标签、备注、日期或报销状态。不动钱的改动有几秒撤销；转账、AA 这类改不得的会跳过并告诉你为什么。", "Batch edit", "Select several entries and change category, account, tags, note, date or reimbursement in one go. Changes that don't move money can be undone for a few seconds; transfers, splits and others that can't be changed are skipped with a reason."],
        ["设置能搜了", "设置重新分成记账、分类与币种、预算与目标、外观、通用、支持六组；顶部搜索框搜「汇率」「默认账户」「图标」都能直达。", "Search in Settings", "Settings is regrouped into six sections, with a search field on top — search \"exchange rate\", \"default account\" or \"icons\" and jump straight there."],
        ["全部币种可选", "全部 ISO 币种都能搜到，南非兰特也有了；可以设自己的常用币种，选择器里排在最前面。", "Every currency", "Every ISO currency is searchable (South African rand included), and your frequent currencies sit at the top of the picker."],
        ["AA 联系人自己管", "在 AA 联系人页就能新增、改名、改备注、归档，不用等到分账时才加人。", "Manage split contacts", "Add, rename, annotate and archive contacts right on the Split Contacts page."],
        ["分类规则能编辑", "点一条规则就能改关键词和分类，「已自动归类 N 笔」的记录还在。", "Edit category rules", "Tap a rule to change its keyword or category; its match count is kept."],
        ["分类图标换个形状", "记账面板里二级分类的图标底座可以换成圆形、圆角方形、叶片、水滴或花朵。设置 → 外观 → 图标。", "Category icon shapes", "Give subcategory icons in the entry panel a circle, rounded square, leaf, drop or flower backing. Settings → Appearance → Icons."],
        ["我的图标一次传多张", "上传自定义图标时可以一次选多张（最多 30 张），按选的顺序加进来。", "Upload several icons at once", "Pick up to 30 images at once when adding your own icons; they're added in the order you chose."],
        ["演示模式里体验会员功能", "用示例数据体验时，会员功能全部打开，并标着「会员」，先看看再决定。", "Try Pro in demo mode", "With sample data, every Pro feature is open and marked Pro, so you can see it before deciding."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["缺汇率不再瞎算", "原来缺汇率的外币按 1:1 当人民币算（1 美元当 1 元、100 万越南盾当 100 万元）。现在先不计入，并在首页、数据、FIRE、预算、资产页明说缺哪几种币、几笔没算进去，点一下就能补；新加的币种会立刻去拉汇率。", "No more guessing missing rates", "Currencies without an exchange rate used to count 1:1 as CNY ($1 as ¥1, ₫1,000,000 as ¥1,000,000). Now they're left out of totals, and Home, Data, FIRE, Budget and Assets say exactly which currencies and how many entries are missing, with one tap to fix it. New currencies fetch their rate right away."],
        ["账单页搜索不再「一拉就跳」", "下拉先露出搜索框，点了再进搜索页。", "Gentler search on the entry list", "Pulling down reveals a search field; tap it to search."],
        ["同类操作只有一种做法", "选分类、选账户、选币种、选日期、输金额，各处都是同一套弹层；分类、标签、规则、模板、AA 联系人这些管理页统一成右上角新增、左滑归档或删除、长按编辑。", "One way to do each thing", "Picking a category, account, currency or date, and entering an amount, now work the same everywhere; the category, tag, rule, template and contact pages all share add-at-top-right, swipe to archive or delete, and long-press to edit."],
        ["记账面板功能行", "开着的功能（报销、AA、小费……）自动排到账户后面，不用滑到最后找；账户和功能标签一样高。", "Entry panel options", "Active options (Reimburse, Split, Tip…) move up next to the account so you don't have to scroll for them; all chips are the same height."],
        ["导入更省心", "映射分类时能搜索、能直接新建；币种列写「RMB」「人民币」「¥」也认得。", "Smoother import", "Search or create categories while mapping, and \"RMB\", \"人民币\" and \"¥\" are recognized as CNY."],
        ["首页快速入口排得更整齐", "三个以内平分整行、一样宽一样高，小屏也显示得全；多于三个时左右滑。", "Tidier shortcuts on Home", "Three or fewer share the row evenly at the same size, even on small screens; more than three scroll sideways."],
        ["账单页记住列表还是日历", "切到日历，下次打开还是日历。", "Entry list remembers List or Calendar", "Switch to Calendar and it stays that way next time."],
        ["一级分类那一排更干净", "左右滑到屏幕边，不再在边上被切掉一截；选中的那个也不再带一圈光晕。", "Cleaner category row", "It scrolls to the screen edge instead of being cut off, and the selected category no longer glows."],
        ["「关于」里能找到我", "设置 → 关于 → 联系我：邮箱、X、小红书。", "Find me in About", "Settings → About → Get in Touch: email, X and Xiaohongshu."],
        ["英文界面翻译修订", "", "English translations revised", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["iCloud 同步出错时，打开 App 或连续记几笔会卡住好几秒", "", "The app could freeze for several seconds on launch or after adding entries when iCloud sync hit an error", ""],
        ["桌面和锁屏小组件不更新", "", "Home and Lock Screen widgets didn't update", ""],
        ["新建贷款点保存没反应（现在会说缺什么）", "", "Saving a new loan did nothing (it now says what's missing)", ""],
        ["记账时切到「收入」，账户没用收入的默认账户", "", "Switching to Income didn't use your default income account", ""],
        ["计划、预算、小组件、借贷里部分外币没按汇率换算", "", "Some foreign-currency amounts in plans, budgets, widgets and loans weren't converted", ""],
        ["周期账单和分期不能选二级分类", "", "Recurring bills and installments couldn't use subcategories", ""],
        ["编辑旧计划后币种被改成人民币", "", "Editing an older plan could switch its currency to CNY", ""],
        ["删除二级分类时，同名的收入账单被改成支出；规则、模板、周期计划没跟着迁移", "", "Deleting a subcategory could turn same-named income into spending, and rules, templates and plans weren't moved along", ""],
        ["导入 Excel 时日期认不出，整表失败", "", "Excel imports failed when dates were stored as serial numbers", ""],
        ["折合金额改汇率后差几块钱", "", "Back-calculated exchange rates were off by a few units on large amounts", ""],
      ] },
    ],
  },
  {
    v: "1.0.6",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "新功能「时薪换算」：看看每笔花销要上多久的班；AA 分账合成一套，统一在记账面板里分；记账面板整体重新整理了一遍。",
      "New: Hours of Work — see how long each expense takes to earn. Split bills are now one flow, right in the entry panel. And the entry panel got a full tidy-up.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["时薪换算", "按你记的工资（固定收入 + 其他收入，不含利息分红）自动算出时薪，只需填每月上几天班、每天几小时，也可以直接填每月总时长。时薪取近一年平均，发年终奖那个月不会让外套突然「变便宜」。数据页 → 时薪换算。", "Hours of Work", "Your hourly rate is worked out from the pay you record (fixed and other income, not interest or dividends) — just enter your working days and hours, or a monthly total. It uses a one-year average, so a bonus month doesn't make everything look cheaper. Data tab → Hours of Work."],
        ["时薪看板", "这段时间的支出折合几个工作日、占了多少工作时间，外加近一年每月时薪的柱状图。账单详情里每笔支出也会显示「≈ 3.5 小时工作」。", "Hours card", "How many workdays your spending took, its share of your working time, and a year of monthly hourly rates. Every expense's detail page shows \"≈ 3.5 hours of work\" too."],
        ["想买的东西值几小时（Pro）", "把想买的东西列进清单，每样都标着要上多久的班，可以改、可以删。", "Wish list in hours (Pro)", "List what you're thinking of buying; each item shows how many hours of work it costs. Edit or delete anytime."],
        ["记账时看工时（Pro）", "记账面板里，金额旁边直接显示这笔要工作多久；设置里可以关掉。", "Hours while adding (Pro)", "See how long an expense takes to earn right next to the amount in the entry panel. Can be turned off in Settings."],
        ["AA 逐人录入", "不知道总额也能分：每人填自己点了多少，合计自动填回金额；服务费、税费按各人点的多少比例摊进去，零头算你的。", "Split by what each person had", "No total yet? Enter what each person ordered and the sum becomes the amount. Service charge and tax are shared in proportion to what each person had; leftover cents go to you."],
        ["导入模板与 AI 转格式", "导入页新增一张 Coast 一定认得的模板表，可以存成文件；还有一段能一键复制的提示词：把它和原来的账单（PDF、截图、表格都行）一起发给 AI，拿回模板格式的 CSV 就能导入。", "Import template and AI conversion", "The import page now has a template Coast always recognizes, which you can save as a file, plus a one-tap prompt: send it to an AI along with your old statement (PDF, screenshot or spreadsheet) and import the CSV it returns."],
        ["分账中心能回看、能撤销", "新增「已结清」记录；标错了可以只撤销某一个人的结清；可以设默认收款账户，结算时不用每次选。", "Split Center: history and undo", "A new Settled tab; undo a single person's settlement; set a default receiving account so you don't pick one every time."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["AA 合成一套", "原来记账面板里的「快速 AA」和长按「＋」的 AA 分账是两套，待收还分在两个地方。现在只有一套，在记账面板里点「AA 分账」就能分，长按「＋」选 AA 也是打开记账面板。旧的快速 AA 账单会自动转成新版，已收回的钱一分不变。", "Split bills, unified", "The in-panel Quick Split and the long-press split used to be separate, with money owed tracked in two places. Now there's one: tap Split Bill in the entry panel (long-press + opens the same panel). Old Quick Split entries convert automatically, with money already received untouched."],
        ["AA 支持外币", "分账跟着记账面板的币种走，出国聚餐不再被记成人民币。", "Splits in any currency", "Splits follow the entry panel's currency — dinners abroad are no longer recorded in CNY."],
        ["记账面板功能行平铺", "账户、报销、AA、分期、组合支付、小费……全部平铺在一行，左右滑，最后是「自定义」；开着的功能统一显示对号和状态（如「AA·4人」「12 期」），不用再点「更多」。", "Entry options laid out flat", "Account, Reimburse, Split Bill, Installments, Combined Payment, Tip and more sit in one scrollable row, with Custom at the end. Active options all show a check and their status (\"Split · 4 people\", \"12 payments\") — no more \"More\" menu."],
        ["账户选择更紧凑", "两列小方块，半屏就能看到十来个账户，点一下即选中。", "A more compact account picker", "Two columns of tiles — a dozen accounts at a glance, one tap to pick."],
        ["组合支付更顺手", "只列用到的账户，可以添加、删除，一键补齐差额。", "Easier combined payments", "Only the accounts you use, add or remove them, and fill the remaining amount in one tap."],
        ["小费、服务费、税费常用比例一点即得", "原来的滑杆换成常用比例按钮，也可以直接输金额。", "One-tap tip, service and tax", "Common percentages replace the slider; you can still type an amount."],
        ["AA、分期、组合支付、附加项面板样式统一", "", "Consistent sheets for splits, installments, combined payments and extras", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["组合支付金额、分期手续费、转账手续费输入算式（如 100+50）后被当成 0", "", "Combined-payment amounts and installment/transfer fees entered as arithmetic (e.g. 100+50) were saved as 0", ""],
        ["编辑「别人付」的 AA 账单后，我的份额变成全额", "", "Editing a split someone else paid set your share to the full amount", ""],
        ["AA 外币账单被按人民币记录", "", "Foreign-currency splits were recorded in CNY", ""],
      ] },
    ],
  },
  {
    v: "1.0.5",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "报销终于能「后退」了；账单列表的标题和副标题由你定；触感反馈更讲究；冷启动和切页更稳。",
      "Reimbursements can finally go back. You decide what each entry's title and subtitle show. Haptics got more deliberate, and launch and tab switching are steadier.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["报销能后退", "报销中心里可以对一笔或一批账单选「不报销」，误点几秒内能撤销；已报销的账单也能点进去修改或重新挂回待报销。只有一条规则：不报销只处理还没收回的部分，已到账的钱一分不动。", "Reimbursements can go back", "In the Reimbursement Center, mark one or many entries as Don't Reimburse and undo within seconds; reimbursed entries can be opened, edited or put back to pending. One rule: only the part not yet received is touched — money already in your account never changes."],
        ["账单列表自定义", "标题显示备注还是二级分类，副标题里的备注、一级分类、二级分类各自开关，设置时实时预览。设置 → 记账偏好 → 账单列表显示。", "Customize the entry list", "Choose whether the title shows the note or the subcategory; toggle note, category and subcategory in the subtitle, with a live preview. Settings → Entry Preferences → List Display."],
        ["方向感的触感", "FIRE 试算滑块按有利 / 不利方向给不同的震动和颜色；撤销、删除各有自己的反馈。", "Directional haptics", "The FIRE what-if sliders vibrate and color differently for favorable vs. unfavorable moves; undo and delete have their own feedback."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["冷启动和切页更稳", "首页、资产、数据三页不再「先画一版再跳一下」；顶部卡片出来就是最终数字；iCloud 同步期间的卡顿明显减少。", "Steadier launch and tab switching", "Home, Assets and Data no longer draw once and jump; the top card shows final numbers from the first frame; stutter during iCloud sync is much reduced."],
        ["切换标签只震一次", "原来点一下会震两下，点「+」会震四下。", "Tab switches vibrate once", "They used to vibrate twice — four times on +."],
        ["首页第二张卡改叫「财务自由目标」", "与 FIRE 页「距离财务自由」用词一致。", "Home card renamed \"Financial Freedom Goal\"", "Matches the wording on the FIRE tab."],
        ["语言设置移到「通用」", "", "Language setting moved to General", ""],
        ["模块与排序页的图标与卡片头一致", "", "Module icons now match the card headers", ""],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["AA 结清的账单被算成「剩余自付」", "", "Settled split bills counted as \"self-paid remainder\"", ""],
        ["资产变化图的零线与柱脚错开", "", "Zero line on the asset-change chart misaligned with the bars", ""],
        ["批量删除账单震动两次", "", "Batch delete vibrated twice", ""],
        ["报销中心勾选后从面板取消标记，底栏残留", "", "Bottom bar lingered after unmarking a selected entry from its sheet", ""],
        ["截图记账入口暂时下线，标为「施工中」", "", "Screenshot Capture is temporarily offline, marked Under Construction", ""],
      ] },
    ],
  },
  {
    v: "1.0.4",
    date: ["2026 年 9 月", "Sep 2026"],
    intro: [
      "标签从「只能打」升级到「能改、能归档、能看花了多少」；多币种转为免费；图表统一了一遍。",
      "Tags grow up: rename, archive, and see where each tag's money went. Multi-currency is now free. Charts got a consistency pass.",
    ],
    sections: [
      { title: ["新增", "New"], items: [
        ["标签升级", "标签能改名、合并、归档、加图标了。数据页 → 标签卡 → 管理。", "Tags, upgraded", "Rename, merge, archive and add icons. Data tab → Tags card → Manage."],
        ["标签详情", "点任一标签，按月 / 年 / 全部看这个标签的支出、笔数和跨月柱图；下方「花在哪」按分类列出金额和占比，待报销也算进去。", "Tag detail", "Tap any tag to see its spending, entry count and a month-by-month bar chart; \"Where it went\" below breaks it down by category, pending reimbursements included."],
        ["多币种转为免费", "多币种账户与每日汇率不再需要 Pro。", "Multi-currency is now free", "Multi-currency accounts and daily rates no longer require Pro."],
        ["净资产卡新增三项", "投资占比、月均支出、应急金能撑几个月。资产页顶部卡片。", "Three new net-worth metrics", "Investment share, average monthly spending, and how many months your emergency fund covers. Top card on the Assets tab."],
        ["负债水位有了档位", "健康 / 稳健……以及离下一档还有多远。", "Debt level tiers", "Healthy, Steady… and how far to the next one."],
        ["设置页新增入口", "使用指南、FAQ、更新日志一键直达。", "Links in Settings", "Guide, FAQ and changelog, one tap away."],
      ] },
      { title: ["改进", "Improved"], items: [
        ["图表统一", "实色柱、超阈值换色、真零基线、柱宽封顶，各页图表同一套画法。", "Charts, unified", "Solid bars, threshold colors, a true zero baseline, capped bar width — one style across every tab."],
        ["动效更利落", "29 处动画曲线改回统一档位；开启「减弱动态效果」后只淡入不位移。", "Snappier motion", "29 animations back on the standard curves; with Reduce Motion on, cards fade in without moving."],
      ] },
      { title: ["修复", "Fixed"], items: [
        ["年视图里月份标签与柱子错位、折线末端不到当月（iOS 27）", "", "Month labels misaligned with bars in year view, and the line ending short of the current month (iOS 27)", ""],
        ["关掉设置弹窗后底部标签栏发灰", "", "Tab bar stayed dimmed after closing Settings", ""],
        ["iCloud 同步把已报销的 AA 账单清成未报销", "", "iCloud sync reset settled split bills to unsettled", ""],
        ["自动备份漏了五张表和四处字段", "", "Automatic backups missed five tables and four fields", ""],
        ["英文界面里露出半句中文", "", "Stray Chinese text in the English interface", ""],
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

/** 开发计划：写在更新日志顶部。只写大功能和它的思路，不写修修补补；
 *  免费 / 会员的划分是产品决定（2026-09-21 定案），不是按实现难度分的 */
const ROADMAP: { tier: "free" | "pro"; zh: [string, string]; en: [string, string] }[] = [
  { tier: "pro", zh: ["AI 分析", "不是把数字再念一遍，而是替你读懂它：「本月弹性支出比均值多 ¥2,400，自由日往后推了 11 天」；哪一笔偏离了你的习惯、哪个分类在悄悄长大，它先看见。想问什么就问：「去年在衣服上花了多少」，直接给答案，不用翻账。"], en: ["AI insights", "Not a recap of numbers — a read on what they mean: \"flexible spending ran ¥2,400 over your average this month; your freedom date moved 11 days.\" It spots the entry that broke your pattern and the category quietly growing. Ask anything — \"how much on clothes last year?\" — and get the answer, not a spreadsheet."] },
  { tier: "free", zh: ["多维度分析", "分类、账户、标签、时段，任意两个维度交叉着看：出差标签下的餐饮，信用卡上的固定支出，今年 vs 去年同期。同一份账，想从哪个角度切都行——数据本来就是你的，怎么看也该由你定。"], en: ["Analysis in every dimension", "Cross any two of category, account, tag and period: dining under the Business Trip tag, fixed costs on the credit card, this year against last. One ledger, any angle — it's your data; how you look at it should be your call."] },
  { tier: "pro", zh: ["投资持仓与收益", "FIRE 的分子是资产，可现在投资账户只是一个手填的余额。持仓、成本、收益率记进来，被动收入就有了真实来源——「被动收入覆盖率」不再是估的，自由日也跟着更准。"], en: ["Holdings and returns", "Assets are the numerator of FIRE, yet today an investment account is just a balance you type in. Track positions, cost and return, and passive income finally has a real source — coverage stops being an estimate, and so does your freedom date."] },
  { tier: "pro", zh: ["家庭共享账本", "两个人一本账，一个自由日。各记各的，合起来看；谁付了什么、家里的净资产、离目标还有多远，两台手机上是同一个数——通过 iCloud 共享，数据仍然不经过任何服务器。"], en: ["Shared household ledger", "Two people, one ledger, one freedom date. Log separately, see it together: who paid what, the household's net worth, how far to go — the same numbers on both phones, shared through iCloud with no server in between."] },
  { tier: "free", zh: ["储蓄目标", "自由日太远，中间得有里程碑：六个月的应急金、一笔首付、下一次旅行。每个目标一条进度、一个日期，和总目标用同一套算法——你会知道这个月的每一笔存款，具体在推动哪一个。"], en: ["Savings goals", "Freedom is far; you need milestones on the way: six months of emergency fund, a down payment, the next trip. Each goal gets its own progress and date, on the same math as the big one — so you know exactly which goal this month's savings just moved."] },
  { tier: "free", zh: ["年度总结", "一年过去，一页说清：花了多少、存了多少、哪个月最克制、自由日往前挪了几天。做成可以分享的样子——给自己复盘，也给别人看看你走了多远。"], en: ["Year in review", "A year, on one page: what you spent, what you saved, your most disciplined month, how many days your freedom date moved. Made to share — a review for you, and proof of how far you've come."] },
  { tier: "free", zh: ["AA 分账：拍照识别", "一张小票拍下来，菜品自动逐行认出，谁点了什么勾一下就分好——不用再手动敲每一项。识别在手机本地完成，不上传。"], en: ["Split bills from a photo", "Snap the receipt, every line item is recognised, tick who had what and the split is done — no more typing each item. Recognition runs on your phone; nothing is uploaded."] },
]

/** 一次只看一张：点「换一个」随机换到另一张（不会连着出同一张），下面的点能直接跳。
 *  平铺占大半屏、横滑又像在翻商品——这里想要的是「随手抽一张看看在做什么」。
 *  七张叠在同一格里、只显示一张，高度自动取最高的那张——换到哪张下面都不跳。
 *
 *  「酷一点」的部分（都只在 hover 设备上、且尊重减弱动态效果）：
 *  跟鼠标走的 3D 倾斜（同首页 TiltCard 的手法）、跟鼠标走的一束光、
 *  Pro 卡是镭射卡：彩虹描边色相跟鼠标转、卡面一层跟鼠标走的虹彩，正文底色仍是实色保证可读；换卡时从侧面翻进来。
 *  （试过 1px 渐变描边 + 右下角大水印序号：描边在 3D 倾斜下边缘发虚、水印压住了正文——都撤了） */
function Roadmap() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  const n = ROADMAP.length
  const [i, setI] = React.useState(() => Math.floor(Math.random() * n))
  const [spin, setSpin] = React.useState(0)
  const go = (next: number) => setI(((next % n) + n) % n)
  const shuffle = () => { let next = i; while (next === i) next = Math.floor(Math.random() * n); go(next); setSpin((x) => x + 1) }

  const stage = React.useRef<HTMLDivElement>(null)
  const fx = React.useRef<{ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null)
  useGSAP(() => {
    const el = stage.current!
    gsap.set(el, { transformPerspective: 1000, transformOrigin: "50% 50%" })
    const opt = { duration: 0.5, ease: "power3" }
    fx.current = { rx: gsap.quickTo(el, "rotationX", opt), ry: gsap.quickTo(el, "rotationY", opt) }
  }, { scope: stage })
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    el.style.setProperty("--mx", `${px * 100}%`)
    el.style.setProperty("--my", `${py * 100}%`)
    // 镭射描边的色相跟着鼠标转一圈：横向走一遍 = 转 360°
    el.style.setProperty("--angle", `${Math.round(px * 360)}deg`)
    const f = fx.current; if (!f || matchMedia("(hover: none)").matches || matchMedia(REDUCED).matches) return
    f.ry(((e.clientX - r.left) / r.width - 0.5) * 10); f.rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const leave = () => { const f = fx.current; if (!f) return; f.rx(0); f.ry(0) }

  return (
    <section id="roadmap" className="grid gap-6 py-12 first:pt-2 md:grid-cols-[200px_1fr] md:gap-12">
      <div className="md:sticky md:top-24 md:self-start">
        <div className="font-heading text-[44px] leading-none">{t("计划中", "Next")}</div>
        <div className="mt-2 text-sm text-muted-foreground">{t("接下来要做的大功能", "What's coming")}</div>
      </div>
      <div className="min-w-0">
        <p className="max-w-[640px] leading-relaxed text-muted-foreground">{t("只列大功能和做它的理由。顺序不代表先后，做到哪一步会在这里更新。", "Only the big ones, and why. Order isn't priority; this list updates as each one lands.")}</p>
        <div className="roadmap-stage mt-6 max-w-[640px]">
          <div ref={stage} onMouseMove={move} onMouseLeave={leave} className="grid">
            {ROADMAP.map((r, k) => (
              <div key={r.zh[0]} aria-hidden={k !== i} className={`col-start-1 row-start-1 relative overflow-hidden rounded-2xl p-6 md:p-8 ${r.tier === "pro" ? "roadmap-holo" : "border border-rule bg-card"} ${k === i ? "roadmap-card" : "invisible"}`}>
                <div className="roadmap-light" aria-hidden />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="num text-xs text-muted-foreground">{String(k + 1).padStart(2, "0")}</span>
                    <div className="text-lg font-medium">{z ? r.zh[0] : r.en[0]}</div>
                  </div>
                  <span className={`tag rounded-full px-2 py-0.5 text-[11px] ${r.tier === "pro" ? "roadmap-holo-pill" : "bg-muted text-muted-foreground"}`}>{r.tier === "pro" ? "Pro" : t("免费", "Free")}</span>
                </div>
                <p className="relative mt-3 text-[15px] leading-relaxed text-muted-foreground">{z ? r.zh[1] : r.en[1]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex max-w-[640px] flex-wrap items-center gap-4">
          <button type="button" onClick={shuffle} className="inline-flex h-9 items-center gap-2 rounded-full border border-rule bg-card px-4 text-sm font-medium transition-colors hover:border-primary/40">
            <Shuffle key={spin} className={`size-4 ${spin ? "roadmap-dice" : ""}`} />{t("换一个", "Show me another")}
          </button>
          <div className="flex items-center gap-1.5" aria-label={t("第几个", "Which one")}>
            {ROADMAP.map((x, k) => (
              <button key={x.zh[0]} type="button" onClick={() => go(k)} aria-label={z ? x.zh[0] : x.en[0]} className={`h-2 rounded-full transition-all ${k === i ? "w-5 bg-foreground" : "w-2 bg-border hover:bg-muted-foreground/60"}`} />
            ))}
          </div>
          <span className="num text-xs text-muted-foreground">{i + 1} / {n}</span>
          <a href={`${BASE}contact.html`} className="tag ml-auto text-primary hover:underline">{t("还有想要的功能？告诉我 →", "Want something else? Tell me →")}</a>
        </div>
      </div>
    </section>
  )
}

export default function Changelog() {
  const { t, lang } = useLang()
  const z = lang === "zh"
  return (
    <DocPage wide title={t("更新日志", "Changelog")} subtitle={t("每一次更新，都离自由更近一步。", "Every update, one step closer to freedom.")}>
      <div className="divide-y divide-border">
        <Roadmap />
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
