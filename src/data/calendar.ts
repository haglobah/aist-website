// Upcoming events, read at build time from the public "AIST Events" Google Calendar
// and the Luma calendar at https://luma.com/aistuebingen.
// The deploy workflow rebuilds the site daily, so new calendar entries appear within a day.
import ICAL from 'ical.js'
import type { EventTypeId } from './site'

export const calendarFeed = 'https://calendar.google.com/calendar/ical/5a9089b3c0a61d751daf541202612343d23f637d8e78a107222de5dfceb49ef2%40group.calendar.google.com/public/basic.ics'
export const lumaFeed = 'https://api.lu.ma/ics/get?entity=calendar&id=cal-0kHYwsmTHS1ymml'

// The list shows events up to and including 6 Feb 2027 (end of the winter semester); move this on for the next semester.
export const listUntil = new Date('2027-02-07T00:00:00+01:00')

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
  // Only the course itself; e.g. "Intro Talk" is a one-off event.
  ['introductory-course', /einführung|course|kurs/i],
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

// The reading groups' address is given in their description above the calendar, and the course room is not decided yet.
function eventPlace(title: string, type: EventTypeId, location: string) {
  if (/reading group|lesegruppe/i.test(title)) return ''
  if (type === 'introductory-course') return 'TBA'
  return location
}

// Lists events that have not ended yet and start before `until`, including occurrences of repeating events, sorted by start.
export function parseCalendar(ics: string, now = new Date(), until = listUntil): CalendarEvent[] {
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

  const occurrences: { item: ICAL.Event; start: ICAL.Time; end: ICAL.Time }[] = []
  for (const event of masters) {
    if (!event.isRecurring()) {
      occurrences.push({ item: event, start: event.startDate, end: event.endDate ?? event.startDate })
      continue
    }
    const iterator = event.iterator()
    for (let next = iterator.next(); next && next.toJSDate() < until; next = iterator.next()) {
      const details = event.getOccurrenceDetails(next)
      if (details.endDate.toJSDate() > now) occurrences.push({ item: details.item, start: details.startDate, end: details.endDate })
    }
  }

  return occurrences
    .filter(({ item, start, end }) => (end ?? start).toJSDate() > now && start.toJSDate() < until
      && item.component.getFirstPropertyValue('status') !== 'CANCELLED')
    .map(({ item, start, end }) => {
      const begins = start.toJSDate()
      const local = berlinParts(begins)
      const description = String(item.description ?? '')
      const url = String(item.component.getFirstPropertyValue('url') ?? '')
      const title = (item.summary ?? '').trim()
      const type = eventType(title)
      return {
        start: begins.toISOString(),
        end: (end ?? start).toJSDate().toISOString(),
        date: start.isDate ? start.toString().slice(0, 10) : local.date,
        time: start.isDate ? undefined : local.time,
        type,
        title,
        place: eventPlace(title, type, (item.location ?? '').trim()),
        description: sanitizeDescription(description),
        registerUrl: registerUrl(url, description),
      }
    })
    .sort((a, b) => a.start.localeCompare(b.start))
}

// An event listed in both calendars shows once, as written in the Google Calendar.
// Luma descriptions only repeat the event link and address, so they are dropped.
export function mergeCalendars(google: CalendarEvent[], luma: CalendarEvent[]): CalendarEvent[] {
  const listed = (e: CalendarEvent) => google.some(g => (e.registerUrl && g.registerUrl === e.registerUrl)
    || (g.start === e.start && g.title === e.title))
  return [...google, ...luma.filter(e => !listed(e)).map(e => ({ ...e, description: '' }))]
    .sort((a, b) => a.start.localeCompare(b.start))
}

async function fetchCalendar(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load the event calendar ${url} (${response.status} ${response.statusText})`)
  return parseCalendar(await response.text())
}

// Fetched once per build; the dev server refetches every few minutes.
let cached: { at: number; events: Promise<CalendarEvent[]> } | undefined

export function loadCalendar(): Promise<CalendarEvent[]> {
  if (!cached || Date.now() - cached.at > 5 * 60_000) {
    const events = Promise.all([fetchCalendar(calendarFeed), fetchCalendar(lumaFeed)])
      .then(([google, luma]) => mergeCalendars(google, luma))
    cached = { at: Date.now(), events }
    events.catch(() => { cached = undefined })
  }
  return cached.events
}
