// Upcoming events, read from the public Google Calendar of aistuebingen@gmail.com at build time.
// The deploy workflow rebuilds the site daily, so new calendar entries appear within a day.
import ICAL from 'ical.js'
import type { EventTypeId } from './site'

export const calendarFeed = 'https://calendar.google.com/calendar/ical/aistuebingen%40gmail.com/public/basic.ics'

export interface CalendarEvent {
  start: string // ISO instant
  end: string // ISO instant; the event leaves the list once it has ended
  date: string // YYYY-MM-DD in Berlin time
  time?: string // HH:MM in Berlin time; missing for all-day events
  type: EventTypeId
  title: string
  place: string
  description: string // sanitised HTML, empty when the calendar entry has none
  registerUrl?: string
}

// The calendar has no categories, so the event type (for the filter) comes from the title.
const typeKeywords: [EventTypeId, RegExp][] = [
  ['ai-governance', /governance/i],
  ['introductory-course', /intro|einführung|course|kurs/i],
  ['technical-ai-safety', /reading group|lesegruppe|paper|technical|technisch/i],
]

export function eventType(title: string): EventTypeId {
  return typeKeywords.find(([, pattern]) => pattern.test(title))?.[0] ?? 'events'
}

const berlin = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

function berlinParts(date: Date) {
  const p = Object.fromEntries(berlin.formatToParts(date).map(part => [part.type, part.value]))
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` }
}

const allowedTags = new Set(['a', 'b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li'])
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const linkAttributes = 'target="_blank" rel="noopener noreferrer"'

// Google stores descriptions as HTML, or as plain text when written in some apps. Keep only simple formatting and links.
export function sanitizeDescription(raw: string) {
  const text = raw.trim()
  if (!/<\/?(a|b|br|div|em|i|li|ol|p|span|strong|u|ul)\b[^>]*>/i.test(text)) {
    return escape(text)
      .replace(/https?:\/\/[^\s<]+/g, url => `<a href="${url}" ${linkAttributes}>${url}</a>`)
      .replace(/\r?\n/g, '<br>')
  }
  return text
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (_, closing: string, tag: string, attributes: string) => {
      tag = tag.toLowerCase()
      if (!allowedTags.has(tag)) return ''
      if (tag !== 'a' || closing) return `<${closing}${tag}>`
      const href = attributes.match(/href\s*=\s*"([^"]*)"/i)?.[1] ?? attributes.match(/href\s*=\s*'([^']*)'/i)?.[1]
      return href && /^(https?:|mailto:)/i.test(href) ? `<a href="${escape(href)}" ${linkAttributes}>` : '<a>'
    })
}

function registerUrl(...sources: string[]) {
  return sources.join(' ').match(/https?:\/\/(?:www\.)?(?:luma\.com|lu\.ma)\/[^\s"'<>]+/i)?.[0]
}

// Lists events that have not ended yet, including occurrences of repeating events, sorted by start.
export function parseCalendar(ics: string, now = new Date(), horizonDays = 365): CalendarEvent[] {
  const root = new ICAL.Component(ICAL.parse(ics))
  for (const zone of root.getAllSubcomponents('vtimezone')) ICAL.TimezoneService.register(zone)

  const components = root.getAllSubcomponents('vevent')
  const exceptions = components.filter(c => c.hasProperty('recurrence-id')).map(c => new ICAL.Event(c))
  const masters = components.filter(c => !c.hasProperty('recurrence-id')).map(c => new ICAL.Event(c))
  for (const exception of exceptions) {
    const master = masters.find(m => m.uid === exception.uid)
    if (master) master.relateException(exception)
    else masters.push(exception)
  }

  const horizon = new Date(now.getTime() + horizonDays * 86_400_000)
  const occurrences: { item: ICAL.Event; start: ICAL.Time; end: ICAL.Time }[] = []
  for (const event of masters) {
    if (!event.isRecurring()) {
      occurrences.push({ item: event, start: event.startDate, end: event.endDate ?? event.startDate })
      continue
    }
    const iterator = event.iterator()
    for (let next = iterator.next(); next && next.toJSDate() <= horizon; next = iterator.next()) {
      const details = event.getOccurrenceDetails(next)
      if (details.endDate.toJSDate() > now) occurrences.push({ item: details.item, start: details.startDate, end: details.endDate })
    }
  }

  return occurrences
    .filter(({ item, start, end }) => (end ?? start).toJSDate() > now && start.toJSDate() <= horizon
      && item.component.getFirstPropertyValue('status') !== 'CANCELLED')
    .map(({ item, start, end }) => {
      const begins = start.toJSDate()
      const local = berlinParts(begins)
      const description = String(item.description ?? '')
      const url = String(item.component.getFirstPropertyValue('url') ?? '')
      return {
        start: begins.toISOString(),
        end: (end ?? start).toJSDate().toISOString(),
        date: start.isDate ? start.toString().slice(0, 10) : local.date,
        time: start.isDate ? undefined : local.time,
        type: eventType(item.summary ?? ''),
        title: (item.summary ?? '').trim(),
        place: (item.location ?? '').trim(),
        description: sanitizeDescription(description),
        registerUrl: registerUrl(url, description),
      }
    })
    .sort((a, b) => a.start.localeCompare(b.start))
}

// Fetched once per build; the dev server refetches every few minutes.
let cached: { at: number; events: Promise<CalendarEvent[]> } | undefined

export function loadCalendar(): Promise<CalendarEvent[]> {
  if (!cached || Date.now() - cached.at > 5 * 60_000) {
    const events = fetch(calendarFeed).then(async response => {
      if (!response.ok) throw new Error(`Could not load the event calendar (${response.status} ${response.statusText})`)
      return parseCalendar(await response.text())
    })
    cached = { at: Date.now(), events }
    events.catch(() => { cached = undefined })
  }
  return cached.events
}
