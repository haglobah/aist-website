import assert from 'node:assert/strict'
import test from 'node:test'
import { eventType, mergeCalendars, parseCalendar, sanitizeDescription } from '../src/data/calendar.ts'
import { eventTypes, typeById } from '../src/data/site.ts'

const ics = (...events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0',
  'BEGIN:VTIMEZONE', 'TZID:Europe/Berlin',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
  'END:VTIMEZONE',
  ...events.flatMap(lines => ['BEGIN:VEVENT', ...lines, 'END:VEVENT']),
  'END:VCALENDAR',
].join('\r\n')

const now = new Date('2026-10-09T12:00:00Z')

test('lists upcoming events in Berlin time with the calendar fields', () => {
  const [event, ...rest] = parseCalendar(ics(
    ['UID:past', 'DTSTART:20261001T160000Z', 'DTEND:20261001T180000Z', 'SUMMARY:Past'],
    ['UID:next', 'DTSTART;TZID=Europe/Berlin:20261012T180000', 'DTEND;TZID=Europe/Berlin:20261012T200000',
      'SUMMARY:Paper reading group', 'LOCATION:Maria-von-Linden-Str. 1',
      'DESCRIPTION:Sign up: <a href="https://luma.com/abc">here</a>'],
  ), now)
  assert.equal(rest.length, 0)
  assert.equal(event.date, '2026-10-12')
  assert.equal(event.time, '18:00')
  assert.equal(event.title, 'Paper reading group')
  assert.equal(event.place, 'Maria-von-Linden-Str. 1')
  assert.equal(event.type, 'technical-ai-safety')
  assert.equal(event.registerUrl, 'https://luma.com/abc')
  assert.match(event.description, /<a href="https:\/\/luma.com\/abc" target="_blank"/)
})

test('events without description or place keep those fields empty', () => {
  const [event] = parseCalendar(ics(['UID:a', 'DTSTART:20261020T160000Z', 'DTEND:20261020T170000Z', 'SUMMARY:Social']), now)
  assert.equal(event.description, '')
  assert.equal(event.place, '')
  assert.equal(event.registerUrl, undefined)
  assert.equal(event.type, 'events')
})

test('repeating events are expanded, keeping moved and dropping cancelled occurrences', () => {
  const events = parseCalendar(ics(
    ['UID:weekly', 'DTSTART;TZID=Europe/Berlin:20261005T180000', 'DTEND;TZID=Europe/Berlin:20261005T200000',
      'RRULE:FREQ=WEEKLY;COUNT=5', 'EXDATE;TZID=Europe/Berlin:20261019T180000', 'SUMMARY:Weekly'],
    ['UID:weekly', 'RECURRENCE-ID;TZID=Europe/Berlin:20261026T180000',
      'DTSTART;TZID=Europe/Berlin:20261027T190000', 'DTEND;TZID=Europe/Berlin:20261027T210000', 'SUMMARY:Weekly (moved)'],
    ['UID:weekly', 'RECURRENCE-ID;TZID=Europe/Berlin:20261102T180000', 'STATUS:CANCELLED',
      'DTSTART;TZID=Europe/Berlin:20261102T180000', 'DTEND;TZID=Europe/Berlin:20261102T200000', 'SUMMARY:Weekly'],
  ), now)
  // 27 Oct is after the switch to winter time and still shows 19:00.
  assert.deepEqual(events.map(e => [e.date, e.time, e.title]), [
    ['2026-10-12', '18:00', 'Weekly'],
    ['2026-10-27', '19:00', 'Weekly (moved)'],
  ])
})

test('all-day events have a date but no time', () => {
  const [event] = parseCalendar(ics(['UID:day', 'DTSTART;VALUE=DATE:20261015', 'DTEND;VALUE=DATE:20261016', 'SUMMARY:Conference']), now)
  assert.equal(event.date, '2026-10-15')
  assert.equal(event.time, undefined)
})

test('descriptions keep simple formatting and links only', () => {
  assert.equal(sanitizeDescription('<b>Hi</b><img src=x onerror=alert(1)><script>bad()</script><a href="javascript:x">y</a>'), '<b>Hi</b><a>y</a>')
  assert.equal(sanitizeDescription('Line 1\nSee https://example.org <ok>'), 'Line 1<br>See <a href="https://example.org" target="_blank" rel="noopener noreferrer">https://example.org</a> &lt;ok&gt;')
})

test('every inferred event type is a displayed category', () => {
  for (const title of ['AI Governance Group', 'Intro course, part 1', 'Technical reading group', 'Social']) {
    assert.ok(eventTypes.includes(typeById(eventType(title))))
  }
})

test('Luma events join the Google Calendar once, sorted by start', () => {
  const google = parseCalendar(ics(
    ['UID:g1', 'DTSTART:20261026T170000Z', 'DTEND:20261026T183000Z', 'SUMMARY:Panel',
      'DESCRIPTION:Register at https://luma.com/panel'],
    ['UID:g2', 'DTSTART:20261030T170000Z', 'DTEND:20261030T180000Z', 'SUMMARY:Social'],
  ), now)
  const luma = parseCalendar(ics(
    ['UID:l1', 'DTSTART:20261022T160000Z', 'DTEND:20261022T173000Z', 'SUMMARY:Intro Talk',
      'DESCRIPTION:Get up-to-date information at: https://luma.com/intro'],
    ['UID:l2', 'DTSTART:20261026T170000Z', 'DTEND:20261026T183000Z', 'SUMMARY:Panel + Q&A',
      'DESCRIPTION:Get up-to-date information at: https://luma.com/panel'],
    ['UID:l3', 'DTSTART:20261030T170000Z', 'DTEND:20261030T180000Z', 'SUMMARY:Social'],
  ), now)
  const merged = mergeCalendars(google, luma)
  assert.deepEqual(merged.map(e => e.title), ['Intro Talk', 'Panel', 'Social'])
  assert.equal(merged[0].registerUrl, 'https://luma.com/intro')
  assert.equal(merged[0].description, '', 'Luma descriptions only repeat the link and address')
})
