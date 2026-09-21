export default async function testFeedback(page, baseURL = 'http://localhost:4321') {
  const check = (value, message) => { if (!value) throw new Error(message) }
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(baseURL)
    const message = page.locator('#feedback-message')
    const cards = page.locator('[data-filter-card]')
    const close = async () => {
      if (width >= 768) await page.locator('#feedback-modal [data-modal-close]').click()
    }
    let draft = ''
    for (const card of await cards.all()) {
      const name = (await card.locator('.activity-title').textContent()).trim()
      await card.locator('[data-feedback-open]').click()
      check(await message.inputValue() === `${name}:\n${draft}`, 'Feedback must start with the selected event type and preserve the draft')
      check(await message.evaluate(el => el === document.activeElement), 'Message must receive focus')
      draft = 'My feedback\nAnother line'
      await message.fill(`${name}:\n${draft}`)
      await close()
      await card.locator('[data-feedback-open]').click()
      check(await message.inputValue() === `${name}:\n${draft}`, 'Reopening must not duplicate the heading')
      await close()
    }
  }
  return 'Feedback prefills, draft preservation, reopening and focus passed on desktop and mobile.'
}
