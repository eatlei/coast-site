import * as React from "react"
import { gsap, useGSAP } from "@/lib/gsap"

/**
 * 亮点 12 条各配一个 44px 高的小动画。只用线和数字，不用插画。
 * 每个 Sketch 建一条暂停的 timeline：进入视口播一次，hover 再播一次。
 */
export type SketchId = "scan" | "refund" | "reconcile" | "recurring" | "rules" | "review" | "repeat" | "scenarios" | "widgets" | "currency" | "themes" | "privacy"

const mono = "font-mono text-[12px] tabular-nums"

function useSketch(build: (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void, deps: unknown[] = []) {
  const root = React.useRef<HTMLDivElement>(null)
  const tlRef = React.useRef<gsap.core.Timeline | null>(null)
  useGSAP((_ctx, contextSafe) => {
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } })
    build(tl, q)
    tlRef.current = tl
    const play = contextSafe!(() => { tl.restart() }) as () => void
    const el = root.current!
    el.addEventListener("mouseenter", play)
    // 进入视口时播一次
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { play(); io.disconnect() } }, { threshold: 0.6 })
    io.observe(el)
    return () => { el.removeEventListener("mouseenter", play); io.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, { scope: root, dependencies: deps })
  return root
}

function Scan() {
  const root = useSketch((tl, q) => {
    tl.set(q(".beam"), { x: 0, opacity: 1 }).set(q(".v"), { opacity: 0 })
      .to(q(".beam"), { x: 128, duration: 0.9, ease: "power1.inOut" })
      .to(q(".beam"), { opacity: 0, duration: 0.2 })
      .to(q(".v"), { opacity: 1, stagger: 0.12 }, "-=0.3")
  })
  return (
    <div ref={root} className="relative h-11 w-36 overflow-hidden rounded-[3px] border border-rule">
      <div className={`absolute left-2 top-2 ${mono} v text-muted-foreground`}>¥25.00</div>
      <div className={`absolute left-2 bottom-2 ${mono} v text-muted-foreground`}>楼下牛肉面</div>
      <div className="beam absolute inset-y-0 left-0 w-3 bg-primary/25" />
    </div>
  )
}

function Refund() {
  const root = useSketch((tl, q) => {
    tl.set(q(".part"), { opacity: 0, x: -8 }).set(q(".whole"), { opacity: 1 })
      .to(q(".whole"), { opacity: 0.3, duration: 0.3 }, 0.2)
      .to(q(".part"), { opacity: 1, x: 0, stagger: 0.18 }, 0.3)
  })
  return (
    <div ref={root} className={`flex h-11 items-center gap-2 ${mono}`}>
      <span className="whole">1000</span><span className="text-muted-foreground">→</span>
      <span className="part">500</span><span className="part text-muted-foreground">+</span><span className="part">200</span><span className="part text-muted-foreground">+</span><span className="part">300</span>
    </div>
  )
}

function Reconcile() {
  const root = useSketch((tl, q) => {
    tl.set(q(".stack"), { opacity: 0, y: 4 }).set(q(".ok"), { opacity: 0, scale: 0.6 })
      .to(q(".stack"), { opacity: 1, y: 0, stagger: 0.15 })
      .to(q(".ok"), { opacity: 1, scale: 1, ease: "back.out(2)" })
  })
  return (
    <div ref={root} className={`h-11 w-40 ${mono}`}>
      <div className="flex justify-between"><span className="text-muted-foreground">校准</span><span>¥12,340</span></div>
      <div className="stack flex justify-between text-muted-foreground"><span>+ 流水</span><span>+ ¥1,220</span></div>
      <div className="stack flex justify-between"><span>= 现在</span><span>¥13,560 <span className="ok text-success">✓</span></span></div>
    </div>
  )
}

function Recurring() {
  const root = useSketch((tl, q) => {
    tl.set(q(".it"), { opacity: 1, y: 0 }).set(q(".one"), { opacity: 0 })
      .to(q(".it"), { y: (i) => -i * 16, opacity: 0, stagger: 0.05, duration: 0.5 }, 0.3)
      .to(q(".one"), { opacity: 1 }, "-=0.2")
  })
  return (
    <div ref={root} className={`relative h-11 w-40 ${mono}`}>
      <div className="it flex justify-between"><span>Netflix</span><span className="text-muted-foreground">9/01</span></div>
      <div className="it flex justify-between"><span>Netflix</span><span className="text-muted-foreground">8/01</span></div>
      <div className="it flex justify-between"><span>Netflix</span><span className="text-muted-foreground">7/01</span></div>
      <div className="one absolute inset-x-0 top-0 flex justify-between"><span>Netflix</span><span className="text-primary">每月 ×3 ✓</span></div>
    </div>
  )
}

function Rules() {
  const root = useSketch((tl, q) => {
    tl.set(q(".ask"), { opacity: 0 }).set(q(".cat"), { opacity: 0.4 })
      .to(q(".cat"), { opacity: 1 }, 0.2)
      .to(q(".ask"), { opacity: 1 }, 0.5)
      .to(q(".ask"), { color: "var(--primary)" }, 1.1)
  })
  return (
    <div ref={root} className={`h-11 w-44 ${mono}`}>
      <div className="flex gap-2"><span>美团外卖</span><span className="text-muted-foreground">→</span><span className="cat">弹性 · 外食</span></div>
      <div className="ask mt-1 text-muted-foreground">下次自动这样归类？ 记住</div>
    </div>
  )
}

function Review() {
  const root = useSketch((tl, q) => {
    tl.set(q(".bar"), { scaleX: 0, transformOrigin: "0 50%" }).set(q(".say"), { opacity: 0 })
      .to(q(".bar"), { scaleX: 1, stagger: 0.1 })
      .to(q(".bar"), { opacity: 0 }, "+=0.2")
      .to(q(".say"), { opacity: 1 }, "-=0.2")
  })
  return (
    <div ref={root} className="relative h-11 w-44">
      <div className="bar mt-1 h-1 w-3/4 bg-foreground/60" /><div className="bar mt-1.5 h-1 w-1/2 bg-foreground/60" /><div className="bar mt-1.5 h-1 w-2/3 bg-foreground/60" />
      <div className={`say absolute inset-x-0 top-0 ${mono}`}>外食比上月多了 ¥620，占了超支的大头。</div>
    </div>
  )
}

function Repeat() {
  const root = useSketch((tl, q) => {
    const o = { n: 0 }
    tl.set(q(".sum"), { opacity: 0 })
      .to(o, { n: 14, duration: 0.9, ease: "power1.out", onUpdate: () => { q(".n")[0].textContent = String(Math.round(o.n)) } })
      .to(q(".sum"), { opacity: 1 })
  })
  return (
    <div ref={root} className={`h-11 w-44 ${mono}`}>
      <div className="flex justify-between"><span>Luckin</span><span>×<span className="n">0</span></span></div>
      <div className="sum flex justify-between text-muted-foreground"><span>一年</span><span>≈ ¥3,300</span></div>
    </div>
  )
}

function Scenarios() {
  const root = useSketch((tl, q) => {
    tl.fromTo(q(".a"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8 })
      .fromTo(q(".b"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8 }, 0.1)
      .from(q(".lbl"), { opacity: 0, stagger: 0.1 }, "-=0.3")
  })
  return (
    <div ref={root} className="relative h-11 w-44">
      <svg viewBox="0 0 176 44" className="h-full w-full" fill="none" strokeWidth="1.5">
        <path className="a" d="M0 40 C 50 36, 90 26, 130 8" stroke="var(--primary)" />
        <path className="b" d="M0 40 C 60 38, 110 32, 170 18" stroke="var(--rule)" />
      </svg>
      <span className={`lbl absolute right-9 top-0 ${mono} text-primary`}>换城市</span>
      <span className={`lbl absolute right-0 bottom-2 ${mono} text-muted-foreground`}>不变</span>
    </div>
  )
}

function Widgets() {
  const root = useSketch((tl, q) => {
    tl.from(q(".w"), { scale: 0.6, opacity: 0, stagger: 0.08, ease: "back.out(1.6)" })
  })
  return (
    <div ref={root} className={`grid h-11 w-44 grid-cols-3 gap-1.5 ${mono}`}>
      <div className="w rounded-[3px] border border-rule px-1.5 py-1 leading-tight"><div className="text-[9px] text-muted-foreground">还能花</div>¥2,585</div>
      <div className="w rounded-[3px] border border-rule px-1.5 py-1 leading-tight"><div className="text-[9px] text-muted-foreground">净资产</div>¥57.6万</div>
      <div className="w rounded-[3px] border border-rule px-1.5 py-1 leading-tight"><div className="text-[9px] text-muted-foreground">自由日</div>8y 7m</div>
    </div>
  )
}

function Currency() {
  const root = useSketch((tl, q) => {
    tl.set(q(".to"), { opacity: 0, y: 6 })
      .to(q(".to"), { opacity: 1, y: 0 }, 0.3)
      .from(q(".rate"), { opacity: 0 }, "-=0.2")
  })
  return (
    <div ref={root} className={`h-11 w-44 ${mono}`}>
      <div className="flex gap-2"><span>$100.00</span><span className="text-muted-foreground">→</span><span className="to">¥712.40</span></div>
      <div className="rate text-muted-foreground">今日 7.124 · 自动</div>
    </div>
  )
}

function Themes() {
  const root = useSketch((tl, q) => {
    tl.to(q(".sw"), { scale: 1.25, stagger: { each: 0.15, yoyo: true, repeat: 1 }, duration: 0.25 })
  })
  return (
    <div ref={root} className="flex h-11 items-center gap-2">
      {["#007AFF", "#D9538E", "#111111", "#2A9D5C", "#F0A020", "#7C5CFF"].map((c) => <span key={c} className="sw size-4 rounded-full" style={{ background: c }} />)}
    </div>
  )
}

function Privacy() {
  const root = useSketch((tl, q) => {
    tl.set(q(".real"), { opacity: 1 }).set(q(".mask"), { opacity: 0 })
      .to(q(".real"), { opacity: 0 }, 0.5).to(q(".mask"), { opacity: 1 }, 0.5)
  })
  return (
    <div ref={root} className={`relative h-11 w-44 ${mono}`}>
      <div className="real"><div className="flex justify-between"><span>本月支出</span><span>¥9,414.89</span></div><div className="flex justify-between text-muted-foreground"><span>净资产</span><span>¥574,907</span></div></div>
      <div className="mask absolute inset-0"><div className="flex justify-between"><span>本月支出</span><span>¥●,●●●.●●</span></div><div className="flex justify-between text-muted-foreground"><span>净资产</span><span>¥●●●,●●●</span></div></div>
    </div>
  )
}

const MAP: Record<SketchId, React.ComponentType> = { scan: Scan, refund: Refund, reconcile: Reconcile, recurring: Recurring, rules: Rules, review: Review, repeat: Repeat, scenarios: Scenarios, widgets: Widgets, currency: Currency, themes: Themes, privacy: Privacy }

export function Sketch({ id }: { id: SketchId }) {
  const C = MAP[id]
  return <div className="mt-3 text-foreground"><C /></div>
}
