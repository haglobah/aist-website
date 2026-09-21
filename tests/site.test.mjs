import assert from 'node:assert/strict'
import test from 'node:test'
import { calendar, eventTypes, typeById } from '../src/data/site.ts'

test('every calendar entry resolves to a displayed event category', () => {
  for (const entry of calendar) {
    const category = typeById(entry.type)
    assert.ok(category, `Missing category for ${entry.title}: ${entry.type}`)
    assert.ok(eventTypes.includes(category))
  }
})

const { resolveCalendar } = await import('../src/data/site.ts')
const regular = { type: 'technical-ai-safety', title: 'Discussion', place: 'Location TBA' }

test('regular entries use consecutive Mondays at 18:00, sorted with dated events', () => {
  const entries = resolveCalendar([regular, { ...regular, title: 'Next' }, {
    ...regular, type: 'events', date: '2026-09-23', time: '12:00',
  }], new Date('2026-09-20T12:00:00Z'))
  assert.deepEqual(entries.map(e => [e.date, e.time]), [
    ['2026-09-21', '18:00'], ['2026-09-23', '12:00'], ['2026-09-28', '18:00'],
  ])
})

test('next occurrence uses Berlin time and rolls forward after the start', () => {
  assert.equal(resolveCalendar([regular], new Date('2026-09-21T15:59:00Z'))[0].date, '2026-09-21')
  assert.equal(resolveCalendar([regular], new Date('2026-09-21T16:01:00Z'))[0].date, '2026-09-28')
  assert.equal(resolveCalendar([regular], new Date('2026-10-26T16:59:00Z'))[0].date, '2026-10-26')
  assert.equal(resolveCalendar([regular], new Date('2026-10-26T17:01:00Z'))[0].date, '2026-11-02')
})

test('date and time overrides take precedence independently', () => {
  const now = new Date('2026-09-21T16:30:00Z')
  assert.equal(resolveCalendar([{ ...regular, time: '19:00' }], now)[0].date, '2026-09-21')
  const [entry] = resolveCalendar([{ ...regular, date: '2026-09-25' }], now)
  assert.equal(entry.date, '2026-09-25')
  assert.equal(entry.time, '18:00')
  assert.equal(resolveCalendar([{ ...regular, date: '2026-09-25', time: '20:00' }], now)[0].time, '20:00')
})

test('events without a regular schedule require an explicit date and time', () => {
  assert.throws(() => resolveCalendar([{ ...regular, type: 'events' }]), /date and time/)
})
