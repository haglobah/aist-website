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

// Hover reveals an event's description; clicking the title keeps it open, e.g. on touch screens.
document.querySelectorAll<HTMLButtonElement>('[data-calendar-toggle]').forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'))
}))
