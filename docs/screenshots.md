# App screenshots

Updated 2026-10-19 from Coast **1.1.0 (1201)**, App source commit
`8cdc4c1d` (current checkout, including the existing localization working copy).
Captured on a dedicated iPhone 17 Pro / iOS 26.5 simulator from a fresh build.

All images are real App screenshots, with the built-in `--seed-showcase`
example ledger, Pro enabled, light appearance and 9:41 status bar. iCloud was
turned off on the dedicated simulator. Each language was seeded separately
from a fresh installation so account and entry names match the UI language.

| Asset | App screen / state | Website placement |
| --- | --- | --- |
| `screen-fire` | FIRE, What-If collapsed | Home hero; guide: FIRE cards |
| `screen-fire-pro` | FIRE, What-If expanded | Home features and screenshot gallery |
| `screen-ledger` | Entries, current month | Home features/gallery; guide: Entries |
| `screen-assets` | Assets overview, asset weather and account groups | Home features/gallery; guide: Assets |
| `screen-budget` | Budget detail and spending pace | Home features/gallery |
| `screen-recurring` | Discover recurring entries | Home gallery |
| `screen-templates` | Template picker | Home gallery; guide: adding entries |

Every asset has `.zh.webp` and `.en.webp` variants, 640 px wide, resized
without cropping or compositing. Paths are shared through `screen()` in
`src/lib/i18n.tsx`; its version query prevents old browser-cached images from
being shown after replacement. Update that version whenever the images change.

Keep screenshot captions in both languages aligned with the actual state:
`fire-pro` shows What-If rather than a dedicated Coast FIRE detail page;
Assets now shows an overview and weather metrics, with breakdown inside the
overview detail. Avoid fixed countdown values in screenshot descriptions.
