import { parts, resolveCalendar } from '../data/site'
import { defaultLang, isLang } from '../i18n'

const lang = isLang(document.documentElement.lang) ? document.documentElement.lang : defaultLang

// Static HTML is a build-time fallback; refresh on every visit and while open.
function refreshCalendar() {
  const list = document.querySelector('#calendar-events')
  if (!list) return
  for (const entry of resolveCalendar()) {
    const row = list.querySelector<HTMLElement>(`[data-calendar-index="${entry.index}"]`)
    if (!row) continue
    const date = parts(entry.date, lang)
    row.querySelector('time')!.dateTime = entry.date
    row.querySelector('time b')!.textContent = `${date.weekday} ${date.day}`
    row.querySelector('[data-calendar-month]')!.textContent = date.monthShort
    row.querySelector('[data-calendar-time]')!.textContent = entry.time
    list.append(row)
  }
}

refreshCalendar()
setInterval(refreshCalendar, 60_000)

// Hover reveals an event's description; clicking the title keeps it open, e.g. on touch screens.
document.querySelectorAll<HTMLButtonElement>('[data-calendar-toggle]').forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'))
}))
