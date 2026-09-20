// Event-type filter. Markup contract:
//   <div data-filter-group>
//     <button data-filter="all" aria-pressed="true">…</button>
//     <button data-filter="lesekreis">…</button>
//   </div>
//   <ul data-filter-target>
//     <li data-event-type="lesekreis">…</li>
//   </ul>
//   <p data-filter-empty hidden>…</p>  (optional)

function setup(group: HTMLElement) {
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'))
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

  for (const b of buttons) b.addEventListener('click', () => apply(b.dataset.filter ?? 'all'))
}

document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach(setup)
