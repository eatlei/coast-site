export type BookSnapshot = { left: HTMLElement; right: HTMLElement; full: HTMLElement }

export function captureBook(paper: HTMLElement): BookSnapshot {
  const leaves = paper.querySelectorAll<HTMLElement>(":scope > .booklet-leaf")
  return {
    left: leaves[0].cloneNode(true) as HTMLElement,
    right: leaves[1].cloneNode(true) as HTMLElement,
    full: paper.cloneNode(true) as HTMLElement,
  }
}

/** The old sheet turns over the new spread, hinged at the spine. */
export function turnBookPage(paper: HTMLElement, snapshot: BookSnapshot, direction: number, done: () => void) {
  const stage = paper.parentElement!
  const mobile = matchMedia("(max-width: 767px)").matches
  const overlay = document.createElement("div")
  overlay.className = `booklet-turn-overlay ${direction > 0 ? "turn-forward" : "turn-backward"}${mobile ? " turn-single" : ""}`
  overlay.setAttribute("aria-hidden", "true")
  overlay.inert = true
  const leaf = document.createElement("div")
  leaf.className = "booklet-turn-sheet"
  const front = document.createElement("div")
  front.className = "booklet-turn-face booklet-turn-front"
  const back = document.createElement("div")
  back.className = "booklet-turn-face booklet-turn-back"
  const shade = document.createElement("div")
  shade.className = "booklet-turn-shade"
  if (mobile) {
    front.append(snapshot.full)
  } else {
    const fixed = document.createElement("div")
    fixed.className = "booklet-turn-fixed"
    fixed.append(direction > 0 ? snapshot.left : snapshot.right)
    overlay.append(fixed)
    front.append(direction > 0 ? snapshot.right : snapshot.left)
    const target = paper.children[direction > 0 ? 0 : 1].cloneNode(true) as HTMLElement
    back.append(target)
  }
  leaf.append(front, back, shade)
  overlay.append(leaf)
  // Decorative copies must not create duplicate IDs or accessibility references.
  overlay.querySelectorAll("[id], [aria-labelledby]").forEach(node => {
    node.removeAttribute("id")
    node.removeAttribute("aria-labelledby")
  })
  stage.append(overlay)
  const duration = 620
  const animation = leaf.animate([
    { transform: "rotateY(0deg)" },
    { transform: `rotateY(${direction > 0 ? -180 : 180}deg)` },
  ], { duration, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" })
  const shadow = shade.animate([{ opacity: 0 }, { opacity: 0.24, offset: 0.5 }, { opacity: 0 }], { duration, fill: "forwards" })
  let removed = false
  const remove = () => {
    if (removed) return
    removed = true
    animation.cancel()
    shadow.cancel()
    overlay.remove()
  }
  animation.onfinish = () => { remove(); done() }
  return remove
}
