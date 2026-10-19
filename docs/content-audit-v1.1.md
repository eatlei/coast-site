# Coast 1.1 website content audit — 2026-10-19

Source: App checkout `8cdc4c1d`, v1.1.0 (1201). This is an audit of implemented
features and access gates, not a claim that every external integration or
purchase was tested live.

## Evidence and corrected coverage

| Website coverage | App evidence | Access / correction |
| --- | --- | --- |
| Holdings, price lookup, contributions / returns | `Features/Assets/HoldingViews.swift`, `AccountDetailView.swift`, `Core/Purchase/ProFeature.swift` | Pro; manual / on-request updates, not brokerage sync |
| Custom top-level categories | `Features/Settings/CategoryManagementView.swift`, `CategoryEditorSheets.swift` | Pro; FI roles stay independent from display groups |
| Account groups and details | `Features/Assets/AccountGroupsSheet.swift`, `AccountDetailView.swift` | Free; Entries / Overview / Notes; type-specific overviews |
| Credit-card limits, statement / due dates | `AccountDetailView.swift`, `Core/MetricsEngine/AccountInsights.swift` | Free; not bank autopay |
| Asset weather and styles | `PersonalAssetWeatherCard.swift`, `AssetWeatherStyle.swift` | Free; five independent metrics, Unrated for missing inputs |
| Spending simulator | `Features/Insights/SpendIdeaDetailView.swift`, `SpendSimulatorView.swift`, `Purchase/PlanComparison.swift` | Date delay and work hours Free; full analysis, cooling-off and decision lists Pro |
| Scenario simulator | `Core/Purchase/ProFeature.swift`, scenario views | Pro; actual amounts and saved comparisons; separate from purchase lists |
| Received-payment rows, no-account logging | refund / reimbursement views, received-payment rows, `QuickAddSheet.swift` | Free; receipts are not duplicate income; no account means no account-balance change |
| Transfers and combined payments | `QuickAddSheet.swift`, transfer / receipt services, v1.1 release notes | Free; available balance / All, fees and actual receipt |
| Quick Capture currencies, discounts and withdrawals | `App/QuickCaptureIntent.swift`, `FIRETests/CaptureCurrencyTests.swift`, capture tests | Free; remove obsolete foreign-currency rejection claim; confirm transfer accounts |
| Widgets | `FIREWidgets`, v1.1 widget QA | Free; asset weather, Lock Screen runway / quick entry; refresh timing belongs to OS |
| Text size, navigation order, account app-icon search | Settings and account editing views; `ProFeature` | Free; alternate themes / app icons are Pro |
| All Free / Pro boundaries | `Features/Purchase/PlanComparison.swift`, `Core/Purchase/ProFeature.swift` | Fix sliders previously marked Free; distinguish neutral countdown, summary vs full review, total vs category budgets, base vs full spending simulator; retain eligible legacy access |
| Themes | `Shared/Theme/ThemePalette.swift` | Three themes, not six; remove obsolete app-icon quantity claim |
| Pricing / purchase FAQ | `Resources/Coast.storekit`, `Core/Purchase/Entitlement.swift` | Reference USD prices, regional price and trial eligibility in purchase sheet; valid entitlement / grace period controls access |
| Privacy / sync / backups | App privacy policy, purchase services, sync / backup services | Ledger sync to private iCloud is not "never uploaded"; developer does not receive entries; latest 10 backups; no fixed sync timing promise |

## Published locations

- Home: dedicated v1.1 section with ten feature links; corrected existing
  feature cards, pricing summaries and privacy / backup wording.
- Guide: six new feature pages; revised categories, account detail, capture,
  scenarios, work-hours, personalization and FIRE access descriptions.
- FAQ: fourteen bilingual questions covering new features, access and limits.
- Changelog: complete v1.1 highlights plus UI, capture and widget improvements.
- `src/content/product.ts`: shared bilingual access table, summary lists and
  v1.1 highlights. Home, Guide and Changelog consume the same source.

Historical changelog entries retain their historical descriptions; current
v1.1 instructions and FAQ state current behavior.

## Verification

- Production build and lint completed; lint retains existing repository warnings.
- 80 browser cases: Chinese / English, 390 / 1440 px, Home, FAQ, Changelog,
  the six new guide pages, the access table, and ten revised guide pages.
- Verified all ten new-feature links, all fourteen FAQ expand / collapse
  actions, 24 comparison rows and the critical Free / Pro gates against App
  sources. No runtime errors or horizontal overflow in the checked cases.
- English pages checked for untranslated Chinese; the historical Changelog's
  quoted `人民币` import-token example is intentionally preserved.
- Desktop and mobile screenshots inspected for the new section and table.
