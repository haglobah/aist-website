// Upcoming events, read at build time from the public "AIST Events" Google Calendar
// and the Luma calendar at https://luma.com/aistuebingen.
// The deploy workflow rebuilds the site daily, so new calendar entries appear within a day.
import ICAL from 'ical.js'
import type { EventTypeId } from './site'

export const calendarFeed = 'https://calendar.google.com/calendar/ical/5a9089b3c0a61d751daf541202612343d23f637d8e78a107222de5dfceb49ef2%40group.calendar.google.com/public/basic.ics'
export const lumaFeed = 'https://api.lu.ma/ics/get?entity=calendar&id=cal-0kHYwsmTHS1ymml'

// The list shows events up to and including 6 Feb 2027 (end of the winter semester); move this on for the next semester.
export const listUntil = new Date('2027-02-07T00:00:00+01:00')

// What an event is, for the archive's label. Calendar titles are often prefixed, e.g. "[Talk] ..." or "[Social] ...".
export type EventKind = 'paper' | 'talk' | 'social' | 'course' | 'governance' | 'other'

export interface CalendarEvent {
  start: string // ISO instant
  end: string // ISO instant; the event leaves the list once it has ended
  date: string // YYYY-MM-DD in Berlin time
  time?: string // HH:MM in Berlin time; missing for all-day events
  type: EventTypeId
  kind: EventKind // worked out from the Google title, which survives merging with Luma
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

export function eventKind(title: string, type: EventTypeId): EventKind {
  if (/^\[talk\]|\btalk\b/i.test(title)) return 'talk'
  if (/^\[social\]|social|pub quiz|watch party|dinner/i.test(title)) return 'social'
  if (/^\[(paper discussion|technical reading group)\]/i.test(title) || type === 'technical-ai-safety') return 'paper'
  if (type === 'introductory-course') return 'course'
  if (type === 'ai-governance') return 'governance'
  return 'other'
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

// The reading groups' address is given in their description above the calendar; the course always meets in the same room.
function eventPlace(title: string, type: EventTypeId, location: string) {
  if (/reading group|lesegruppe/i.test(title)) return ''
  if (type === 'introductory-course') return 'Wilhelmstraße 22, Raum 106'
  return location
}

// Lists events that have not ended yet and start before `until`, including occurrences of repeating events, sorted by start.
// With `past`, lists the events that have already ended instead, newest first.
export function parseCalendar(ics: string, now = new Date(), until = listUntil, { past = false } = {}): CalendarEvent[] {
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
    const limit = past ? now : until
    for (let next = iterator.next(); next && next.toJSDate() < limit; next = iterator.next()) {
      const details = event.getOccurrenceDetails(next)
      if ((details.endDate.toJSDate() > now) !== past) occurrences.push({ item: details.item, start: details.startDate, end: details.endDate })
    }
  }

  return occurrences
    .filter(({ item, start, end }) => past
      ? (end ?? start).toJSDate() <= now
      : (end ?? start).toJSDate() > now && start.toJSDate() < until)
    .filter(({ item }) => item.component.getFirstPropertyValue('status') !== 'CANCELLED')
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
        kind: eventKind(title, type),
        title,
        place: eventPlace(title, type, (item.location ?? '').trim()),
        description: sanitizeDescription(description),
        registerUrl: registerUrl(url, description),
      }
    })
    .sort((a, b) => past ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start))
}

// The same event in both calendars: the same registration link, or the same start (titles are written differently).
const sameEvent = (a: CalendarEvent, b: CalendarEvent) => a.start === b.start || (!!a.registerUrl && a.registerUrl === b.registerUrl)

// An event listed in both calendars shows once: the Luma title and registration link with the Google description and place.
// The type comes from the Google title, which carries the keywords (e.g. "[Intro Course]"). Luma-only events keep no
// description, as it only repeats the event link and address.
// Sorted like the inputs: `newestFirst` for past events.
export function mergeCalendars(google: CalendarEvent[], luma: CalendarEvent[], newestFirst = false): CalendarEvent[] {
  const lumaOnly = luma.filter(l => !google.some(g => sameEvent(g, l)))
  const merged = google.map(g => {
    const match = luma.find(l => sameEvent(g, l))
    return match ? { ...g, title: match.title, registerUrl: match.registerUrl ?? g.registerUrl } : g
  })
  const order = (a: CalendarEvent, b: CalendarEvent) => newestFirst ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)
  return [...merged, ...lumaOnly.map(e => ({ ...e, description: '' }))].sort(order)
}

async function fetchFeed(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load the event calendar ${url} (${response.status} ${response.statusText})`)
  return response.text()
}

// Feeds are fetched once per build (the dev server refetches every few minutes) and parsed for both lists.
let cached: { at: number; feeds: Promise<[string, string]> } | undefined

function feeds() {
  if (!cached || Date.now() - cached.at > 5 * 60_000) {
    const pending = Promise.all([fetchFeed(calendarFeed), fetchFeed(lumaFeed)])
    cached = { at: Date.now(), feeds: pending }
    pending.catch(() => { cached = undefined })
  }
  return cached.feeds
}

// Upcoming events for the home page.
export async function loadCalendar(): Promise<CalendarEvent[]> {
  const [google, luma] = await feeds()
  return mergeCalendars(parseCalendar(google), parseCalendar(luma))
}

// Events that have ended, newest first, for the archive page.
export async function loadPastEvents(): Promise<CalendarEvent[]> {
  const [google, luma] = await feeds()
  const options = { past: true }
  return mergeCalendars(parseCalendar(google, new Date(), listUntil, options), parseCalendar(luma, new Date(), listUntil, options), true)
}
