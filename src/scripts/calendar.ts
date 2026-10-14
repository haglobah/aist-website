// The list is built daily; between builds, drop events that have ended since.
function removeEndedEvents() {
  const list = document.querySelector('#calendar-events')
  if (!list) return
  for (const row of list.querySelectorAll<HTMLElement>('[data-calendar-end]')) {
    if (new Date(row.dataset.calendarEnd!) <= new Date()) row.remove()
  }
  if (!list.querySelector('[data-calendar-end]')) {
    document.querySelectorAll<HTMLElement>('[data-filter-empty]').forEach(empty => { empty.hidden = false })
  }
}

removeEndedEvents()
setInterval(removeEndedEvents, 60_000)

// At most ten events show at a time, and where the event types sit beside the calendar, the list ends level with them.
// The rest scroll inside the list.
const maxVisible = 10
const list = document.querySelector<HTMLElement>('#calendar-events')
const beside = document.querySelector<HTMLElement>('[data-calendar-limit]')
const sideBySide = window.matchMedia('(min-width: 48rem)')

function fitList() {
  if (!list) return
  list.style.maxHeight = ''
  const shown = Array.from(list.children).filter((row): row is HTMLElement => row instanceof HTMLElement && !row.hidden)
  const top = list.getBoundingClientRect().top
  const bottomOf = (index: number) => shown[Math.min(index, shown.length - 1)]?.getBoundingClientRect().bottom ?? top
  let limit = bottomOf(maxVisible - 1) - top
  if (sideBySide.matches && beside) {
    // Never shorter than three events, so the list stays usable next to short descriptions.
    limit = Math.max(Math.min(limit, beside.getBoundingClientRect().bottom - top), bottomOf(2) - top)
  }
  if (list.scrollHeight > limit + 1) list.style.maxHeight = `${limit}px`
}

if (list) {
  // Refit when the filter hides events, ended events are removed, or the layout changes.
  new MutationObserver(() => {
    list.scrollTop = 0
    fitList()
  }).observe(list, { childList: true, subtree: true, attributeFilter: ['hidden'] })
  if (beside) new ResizeObserver(fitList).observe(beside)
  window.addEventListener('resize', fitList)
  sideBySide.addEventListener('change', fitList)
  fitList()
}

// Hover reveals an event's description; clicking the title keeps it open, e.g. on touch screens.
document.querySelectorAll<HTMLButtonElement>('[data-calendar-toggle]').forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'))
}))
