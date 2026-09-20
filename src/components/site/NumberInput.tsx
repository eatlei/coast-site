import * as React from "react"
import { Input } from "@/components/ui/input"

/**
 * 数字输入框。**文字和数字分开存**：输入过程中保留用户敲的原文，只有算数时才转成数字。
 *
 * 直接 `value={n} onChange={e => setN(Number(e.target.value) || 0)}` 有两个坑，都踩过：
 * 1. 清空时 `Number("")` 是 0，框里立刻冒出一个 0，再输入就接在它后面 → 「030」；
 * 2. 夹上下限之后，如果夹出来的数跟当前 state 相等，React 认为没变化就不回写 DOM，
 *    框里留着刚敲的那串（比如超上限的 9993），之后连删都删不动。
 *
 * 做法：onChange 只做「过滤非数字 + 去掉多余前导零」，空就让它空着；数字通过 onValueChange 往外给。
 * 外部值（「重置」按钮之类）只有在**不等于自己最后发出去的那个数**时才回写文字——
 * 否则清空时发出去的 0 会被当成外部更新，把空框又填成 0。
 *
 * 聚焦全选、失焦规整都挂在元素上用原生事件：这条路验证过（派发 focus 全选到 0-3、
 * 派发 blur 把超上限的 999997 夹回 999）。
 */
export function NumberInput({
  value, onValueChange, min = 0, max, className = "", "aria-label": ariaLabel,
}: {
  value: number
  onValueChange: (n: number) => void
  min?: number
  max?: number
  className?: string
  "aria-label"?: string
}) {
  const clamp = (n: number) => Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.max(min, n))
  const [text, setText] = React.useState(String(value))
  const emitted = React.useRef(value)
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value === emitted.current) return
    emitted.current = value
    setText(String(value))
  }, [value])

  // 失焦时要把文字补成合法的数，所以监听里要拿到最新的 text
  const textRef = React.useRef(text)
  textRef.current = text

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    // 排到下一个事件循环再全选：聚焦当帧选中会被输入框自身的光标定位覆盖
    const onFocus = () => setTimeout(() => el.select(), 0)
    const onBlur = () => {
      const t = textRef.current
      const n = t === "" ? min : clamp(Number(t))
      setText(String(n))
      emitted.current = n
      onValueChange(n)
    }
    el.addEventListener("focus", onFocus)
    el.addEventListener("blur", onBlur)
    return () => { el.removeEventListener("focus", onFocus); el.removeEventListener("blur", onBlur) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max])

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={text}
      aria-label={ariaLabel}
      className={className}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 9)
        setText(cleaned)
        const n = cleaned === "" ? min : clamp(Number(cleaned))
        emitted.current = n
        onValueChange(n)
      }}
    />
  )
}
