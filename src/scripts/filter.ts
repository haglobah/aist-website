// Event-type filter. Markup contract:
//   <div data-filter-group>
//     Clicking the selected category again restores all events.
//     Hovering previews matching events; only an active filter retains its highlight.
//     <li data-filter-card="technical-ai-safety">
//       <button data-filter="technical-ai-safety">…</button>
//     </li>
//   </div>
//   <ul data-filter-target>
//     <li data-event-type="technical-ai-safety">…</li>
//   </ul>
//   <p data-filter-empty hidden>…</p>  (optional)

function setup(group: HTMLElement) {
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'))
  const cards = Array.from(group.querySelectorAll<HTMLElement>('[data-filter-card]'))
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-filter-target] [data-event-type]'))
  const empties = Array.from(document.querySelectorAll<HTMLElement>('[data-filter-empty]'))

  function apply(value: string) {
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.filter === value))
    let visible = 0
    for (const t of targets) {
      const show = value === 'all' || t.dataset.eventType === value
      t.hidden = !show
      if (show) visible++
    }
    for (const e of empties) e.hidden = visible > 0
    group.dataset.active = value
  }

  let hoveredCard: HTMLElement | undefined

  function highlight() {
    const highlighted = (type: string | undefined) => type === hoveredCard?.dataset.filterCard || type === group.dataset.active
    for (const card of cards) card.dataset.highlighted = String(highlighted(card.dataset.filterCard))
    for (const target of targets) target.dataset.highlighted = String(highlighted(target.dataset.eventType))
  }

  for (const card of cards) {
    card.addEventListener('mouseenter', () => {
      hoveredCard = card
      highlight()
    })
    card.addEventListener('mouseleave', () => {
      hoveredCard = undefined
      highlight()
    })
  }

  for (const b of buttons) {
    b.addEventListener('click', () => {
      b.focus({ preventScroll: true })
      const value = b.dataset.filter ?? 'all'
      apply(group.dataset.active === value ? 'all' : value)
      hoveredCard = undefined
      highlight()
    })
  }

  apply('all')
}

document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach(setup)
