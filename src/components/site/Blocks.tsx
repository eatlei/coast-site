import * as React from "react"

/* ---------- 版式原语：整站只用这几样，不用卡片 ---------- */
export function Tag({ children }: { children: React.ReactNode }) {
  return <div className="tag">{children}</div>
}
export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-5 max-w-[620px] text-[30px] leading-[1.15] md:text-[42px] ${className}`}>{children}</h2>
}
export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted-foreground">{children}</p>
}
export function Section({ id, className = "", children, innerRef }: { id?: string; className?: string; children: React.ReactNode; innerRef?: React.Ref<HTMLElement> }) {
  return <section id={id} ref={innerRef} className={`rule px-6 py-20 md:px-10 md:py-28 ${className}`}>{children}</section>
}
