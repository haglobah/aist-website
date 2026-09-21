import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

function fixture() {
  const types = ['technical-ai-safety', 'ai-governance', 'introductory-course', 'events']
  const buttons = types.map(filter => ({
    dataset: { filter },
    attributes: { 'aria-pressed': 'false' },
    setAttribute(key, value) { this.attributes[key] = value },
    addEventListener(event, handler) { this[event] = handler },
  }))
  const cards = types.map(filterCard => ({
    dataset: { filterCard },
    addEventListener(event, handler) { this[event] = handler },
  }))
  const targets = ['technical-ai-safety', 'ai-governance', 'technical-ai-safety'].map(eventType => ({ dataset: { eventType }, hidden: false }))
  const empty = { hidden: true }
  const group = { dataset: {}, querySelectorAll: selector => selector === '[data-filter-card]' ? cards : buttons }
  const document = { querySelectorAll(selector) {
    if (selector === '[data-filter-group]') return [group]
    if (selector === '[data-filter-empty]') return [empty]
    return targets
  } }
  runInNewContext(stripTypeScriptTypes(readFileSync(new URL('../src/scripts/filter.ts', import.meta.url), 'utf8')), { document })
  return { buttons, cards, targets, empty }
}

test('category selection switches the calendar and toggles back to all events', () => {
  const { buttons, targets } = fixture()
  buttons[0].click()
  assert.deepEqual(targets.map(t => t.hidden), [false, true, false])
  buttons[1].click()
  assert.deepEqual(targets.map(t => t.hidden), [true, false, true])
  assert.deepEqual(buttons.map(b => b.attributes['aria-pressed']), ['false', 'true', 'false', 'false'])
  buttons[1].click()
  assert.ok(targets.every(t => !t.hidden))
  assert.ok(buttons.every(b => b.attributes['aria-pressed'] === 'false'))
})

test('empty category shows the empty message and clearing restores events', () => {
  const { buttons, targets, empty } = fixture()
  buttons[2].click()
  assert.ok(targets.every(t => t.hidden))
  assert.equal(empty.hidden, false)
  buttons[2].click()
  assert.equal(empty.hidden, true)
  assert.ok(targets.every(t => !t.hidden))
})

test('whole-card hover highlights only matching events and leaving clears the highlight', () => {
  const { buttons, cards, targets, empty } = fixture()
  for (const card of cards) {
    card.mouseenter()
    assert.deepEqual(targets.map(t => t.dataset.highlighted), targets.map(t => String(t.dataset.eventType === card.dataset.filterCard)))
    assert.ok(targets.every(t => !t.hidden))
    assert.ok(buttons.every(b => b.attributes['aria-pressed'] === 'false'))
    assert.equal(empty.hidden, true)
    card.mouseleave()
    assert.ok(targets.every(t => t.dataset.highlighted === 'false'))
  }
})

test('hovering another category preserves the selected filter', () => {
  const { buttons, cards, targets } = fixture()
  buttons[0].click()
  cards[1].mouseenter()
  cards[1].mouseleave()
  assert.deepEqual(targets.map(t => t.hidden), [false, true, false])
  assert.equal(buttons[0].attributes['aria-pressed'], 'true')
})
