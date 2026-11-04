import assert from 'node:assert/strict'
import test from 'node:test'
import { eventKind, eventType, mergeCalendars, parseCalendar, sanitizeDescription } from '../src/data/calendar.ts'
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
      'SUMMARY:Paper discussion', 'LOCATION:Maria-von-Linden-Str. 1',
      'DESCRIPTION:Sign up: <a href="https://luma.com/abc">here</a>'],
  ), now)
  assert.equal(rest.length, 0)
  assert.equal(event.date, '2026-10-12')
  assert.equal(event.time, '18:00')
  assert.equal(event.title, 'Paper discussion')
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

test('reading groups list no place and the introductory course always lists its room', () => {
  const [reading, governance, course, talk] = parseCalendar(ics(
    ['UID:r', 'DTSTART:20261012T160000Z', 'DTEND:20261012T180000Z', 'SUMMARY:Technical Reading Group', 'LOCATION:Maria-von-Linden-Str. 1'],
    ['UID:g', 'DTSTART:20261013T160000Z', 'DTEND:20261013T180000Z', 'SUMMARY:AI Governance Reading Group', 'LOCATION:Wilhelmstr. 22'],
    ['UID:c', 'DTSTART:20261014T160000Z', 'DTEND:20261014T180000Z', 'SUMMARY:Intro Course: Part 1', 'LOCATION:Maria-von-Linden-Str. 1'],
    ['UID:t', 'DTSTART:20261015T160000Z', 'DTEND:20261015T180000Z', 'SUMMARY:Intro Talk', 'LOCATION:Maria-von-Linden-Str. 1'],
  ), now)
  assert.equal(reading.place, '')
  assert.equal(governance.place, '')
  assert.equal(course.place, 'Wilhelmstraße 22, Raum 106')
  assert.equal(talk.place, 'Maria-von-Linden-Str. 1')
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

test('only the intro course counts as the introductory course', () => {
  assert.equal(eventType('Intro-Course Part 1'), 'introductory-course')
  assert.equal(eventType('Intro Course: Part 2'), 'introductory-course')
  assert.equal(eventType('Intro Talk: What is AI Safety?'), 'events')
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
  assert.deepEqual(merged.map(e => e.title), ['Intro Talk', 'Panel + Q&A', 'Social'])
  assert.equal(merged[0].registerUrl, 'https://luma.com/intro')
  assert.equal(merged[0].description, '', 'Luma descriptions only repeat the link and address')
})

test('past mode lists ended events newest first, dropping upcoming and cancelled ones', () => {
  const text = ics(
    ['UID:old', 'DTSTART:20260901T160000Z', 'DTEND:20260901T170000Z', 'SUMMARY:Old talk'],
    ['UID:older', 'DTSTART:20260801T160000Z', 'DTEND:20260801T170000Z', 'SUMMARY:Older talk'],
    ['UID:gone', 'DTSTART:20260905T160000Z', 'DTEND:20260905T170000Z', 'SUMMARY:Cancelled', 'STATUS:CANCELLED'],
    ['UID:next', 'DTSTART:20261020T160000Z', 'DTEND:20261020T170000Z', 'SUMMARY:Upcoming'],
  )
  const options = { past: true }
  assert.deepEqual(parseCalendar(text, now, undefined, options).map(e => e.title), ['Old talk', 'Older talk'])
  assert.deepEqual(parseCalendar(text, now).map(e => e.title), ['Upcoming'])
})

test('past mode only lists repeating occurrences that have ended', () => {
  const events = parseCalendar(ics(
    ['UID:rep', 'DTSTART:20260928T160000Z', 'DTEND:20260928T170000Z', 'SUMMARY:Reading group', 'RRULE:FREQ=WEEKLY;COUNT=4'],
  ), now, undefined, { past: true })
  assert.deepEqual(events.map(e => e.date), ['2026-10-05', '2026-09-28'])
})

test('a Luma event with the same start as a Google event takes over its title and link, keeping the Google description', () => {
  const google = parseCalendar(ics(
    ['UID:g', 'DTSTART:20261026T170000Z', 'DTEND:20261026T183000Z', 'SUMMARY:Panel', 'DESCRIPTION:Our panel on governance'],
    ['UID:g2', 'DTSTART:20261030T170000Z', 'DTEND:20261030T180000Z', 'SUMMARY:Social'],
  ), now)
  const luma = parseCalendar(ics(
    ['UID:l', 'DTSTART:20261026T170000Z', 'DTEND:20261026T183000Z', 'SUMMARY:Panel + Q&A', 'DESCRIPTION:https://luma.com/panel'],
    ['UID:l2', 'DTSTART:20261030T170000Z', 'DTEND:20261030T180000Z', 'SUMMARY:Pub quiz', 'DESCRIPTION:https://luma.com/quiz'],
  ), now)
  const merged = mergeCalendars(google, luma)
  assert.deepEqual(merged.map(e => e.title), ['Panel + Q&A', 'Pub quiz'])
  assert.equal(merged[0].registerUrl, 'https://luma.com/panel')
  assert.match(merged[0].description, /Our panel/)
  assert.equal(merged[1].description, '')
})

test('event kinds come from the title prefix, falling back to the event type', () => {
  const kind = title => eventKind(title, eventType(title))
  assert.equal(kind('[Talk] Compute Governance, Yannick Mühlhäuser'), 'talk')
  assert.equal(kind('[Social] AI Safety Pub Quiz'), 'social')
  assert.equal(kind('[Paper Discussion] Activation Oracles'), 'paper')
  assert.equal(kind('Intro Talk: What is AI Safety?'), 'talk')
  assert.equal(kind('AI Governance Reading Group'), 'governance')
  assert.equal(kind('Dies Universitatis'), 'other')
})
