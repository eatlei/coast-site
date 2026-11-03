// Source: Apple lookup API across all 175 storefronts in Apple’s official localization list.
// Counts are summed; average is weighted by each storefront’s rating count.
export const APP_STORE_RATING = {
  "average": 4.826086956521739,
  "count": 23,
  "storefront": "worldwide",
  "storefrontsChecked": 175,
  "checkedAt": "2026-11-03"
} as const
// Source: Apple App Store CN customer-review RSS, fetched 2026-11-03.
// Excerpts are contiguous, verbatim passages. English copy is explicitly labelled as translated.
export const APP_STORE_RATING_SOURCE = "https://apps.apple.com/app/id6793885422"
export const APP_STORE_REVIEW_SOURCE = "https://apps.apple.com/cn/app/id6793885422?see-all=reviews"
export const APP_STORE_REVIEWS = [
  {
    "id": "14737783368",
    "author": "评论还要昵称那么麻烦",
    "rating": 5,
    "date": "2026-11-01T05:48:10-07:00",
    "quote": "这个app值得被更多人看见\n\n从一个用了9年的记账app换过来，觉得这个app实在是太舒服了",
    "en": "This app deserves to be seen by more people. After nine years with another tracking app, switching to this one feels so comfortable."
  },
  {
    "id": "14723753020",
    "author": "欧泡果奶噢噢噢",
    "rating": 5,
    "date": "2026-10-28T17:40:33-07:00",
    "quote": "分类功能做的很棒，尤其是功能行的部分，报销、分期、退款都特别实用",
    "en": "The categories are excellent, especially the feature row. Reimbursements, installments and refunds are all very useful."
  },
  {
    "id": "14644212256",
    "author": "xikr·",
    "rating": 5,
    "date": "2026-10-08T19:18:34-07:00",
    "quote": "让记账不只是记账，也是记录走向自由的距离",
    "en": "Tracking becomes more than recording expenses: it records the distance toward freedom."
  },
  {
    "id": "14572687847",
    "author": "取个昵称怎么tm这么难",
    "rating": 5,
    "date": "2026-09-20T08:19:54-07:00",
    "quote": "以前记账就只为知道花了多少钱，现在是一点开就知道距离财务自由（不是）还有多远，很直观，很有意思。",
    "en": "I used to track expenses just to see how much I spent. Now I can see how far I am from financial freedom (well, sort of) as soon as I open the app. It is intuitive and interesting."
  }
] as const
