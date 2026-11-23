// Links to single events, e.g. /#2026-11-25-compute-governance (ids: withIds in data/calendar.ts).
// The linked event is highlighted and its description opened. The link button next to an event goes there and copies the link.
// Markup contract:
//   <li id="2026-11-25-compute-governance" data-event>
//     <button data-calendar-toggle>…</button> <a data-event-link href="#2026-11-25-compute-governance">…</a>
//   </li>
//   <ol data-event-archive="/archive/">  (on the home page: where ended events are)

const events = () => Array.from(document.querySelectorAll<HTMLElement>('[data-event]'))

// An event that is no longer on the home page has ended: it is in the archive. A link whose event has been renamed
// since still finds it by its date, when that day has only one event.
function find(id: string) {
  const exact = document.getElementById(id)
  if (exact?.matches('[data-event]')) return exact
  const date = id.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  const sameDay = date ? events().filter(e => e.id.startsWith(date)) : []
  return sameDay.length === 1 ? sameDay[0] : undefined
}

function show() {
  const id = decodeURIComponent(location.hash.slice(1))
  // The event linked before closes again.
  for (const e of events()) if (e.dataset.linked) {
    delete e.dataset.linked
    e.querySelector('[data-calendar-toggle]')?.setAttribute('aria-expanded', 'false')
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(id)) return
  const event = find(id)
  const archive = document.querySelector<HTMLElement>('[data-event-archive]')?.dataset.eventArchive
  if (!event) {
    if (archive) location.replace(`${archive}#${id}`)
    return
  }
  if (event.id !== id) history.replaceState(null, '', `#${event.id}`)
  // A filter that hides the event is cleared.
  if (event.hidden) document.querySelector<HTMLButtonElement>('[data-filter][aria-pressed="true"]')?.click()
  event.dataset.linked = 'true'
  event.querySelector('[data-calendar-toggle]')?.setAttribute('aria-expanded', 'true')
  // After the calendar list has been fitted; scrolls the list and the page.
  requestAnimationFrame(() => event.scrollIntoView({ block: 'center' }))
}

async function copy(link: HTMLAnchorElement) {
  const url = `${location.origin}${location.pathname}${link.getAttribute('href')}`
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    return // e.g. no clipboard on plain http; the address bar has the link
  }
  const status = link.querySelector('[data-event-link-status]')
  if (status) status.textContent = link.dataset.copiedLabel ?? ''
  link.dataset.copied = 'true'
  clearTimeout(Number(link.dataset.copiedTimer))
  link.dataset.copiedTimer = String(setTimeout(() => {
    delete link.dataset.copied
    if (status) status.textContent = ''
  }, 1600))
}

document.addEventListener('click', event => {
  const link = (event.target as Element).closest?.<HTMLAnchorElement>('a[data-event-link]')
  if (!link) return
  event.preventDefault()
  const hash = link.getAttribute('href')!
  if (location.hash === hash) show()
  else location.hash = hash
  copy(link)
})

window.addEventListener('hashchange', show)
show()
// Fonts and the calendar's fitting move the event after the first paint.
window.addEventListener('load', () => { if (document.querySelector('[data-linked]')) show() })
