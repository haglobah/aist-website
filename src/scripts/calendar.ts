import { parts, resolveCalendar } from '../data/site'

// Static HTML is a build-time fallback; refresh on every visit and while open.
function refreshCalendar() {
  const list = document.querySelector('#calendar-events')
  if (!list) return
  for (const entry of resolveCalendar()) {
    const row = list.querySelector<HTMLElement>(`[data-calendar-index="${entry.index}"]`)
    if (!row) continue
    const date = parts(entry.date)
    row.querySelector('time')!.dateTime = entry.date
    row.querySelector('time b')!.textContent = `${date.weekday} ${date.day}`
    row.querySelector('[data-calendar-month]')!.textContent = date.monthShort
    row.querySelector('[data-calendar-time]')!.textContent = entry.time
    list.append(row)
  }
}

refreshCalendar()
setInterval(refreshCalendar, 60_000)
