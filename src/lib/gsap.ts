import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

// 插件只注册一次；所有页面从这里 import gsap，避免各处重复 registerPlugin
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin)

export const EASE = "power3.out"
export const REDUCED = "(prefers-reduced-motion: reduce)"

export { gsap, useGSAP, ScrollTrigger, SplitText }
