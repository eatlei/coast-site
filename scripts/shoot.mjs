// 用系统 Chrome 按真实视口截图：支持滚动到指定位置、等动效跑完。用法：
//   node scripts/shoot.mjs <url> <outPrefix> [width] [height] [y1,y2,...]
import puppeteer from "puppeteer-core"
const [url, out, w = "1280", h = "800", ys = "0"] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true })
const page = await browser.newPage()
if (process.env.DARK) await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }])
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 768, hasTouch: +w < 768 })
await page.goto(url, { waitUntil: "networkidle0" })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500))
let i = 0
for (const y of ys.split(",").map(Number)) {
  // 分步滚动，让 ScrollTrigger 按真实滚动路径更新（pin / scrub 才会到位）
  await page.evaluate(async (target) => {
    const step = 200
    let cur = window.scrollY
    while (Math.abs(target - cur) > step) { cur += Math.sign(target - cur) * step; window.scrollTo(0, cur); await new Promise((r) => requestAnimationFrame(r)) }
    window.scrollTo(0, target)
  }, y)
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: `${out}-${i++}.png` })
}
console.log(await page.evaluate(() => ({ h: document.body.scrollHeight, w: document.documentElement.scrollWidth })))
await browser.close()
