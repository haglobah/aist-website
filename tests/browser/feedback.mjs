export default async function testFeedback(page, baseURL = 'http://localhost:4321') {
  const check = (value, message) => { if (!value) throw new Error(message) }
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(baseURL)
    const open = page.locator('#contact [data-feedback-open]')
    await page.locator('#contact details').first().locator('summary').click()
    const message = page.locator('#feedback-message')
    await open.click()
    check(await page.locator('#feedback-modal').evaluate(el => el.open), 'The button must open the feedback window')
    check(await message.evaluate(el => el === document.activeElement), 'Message must receive focus')
    await message.fill('My feedback\nAnother line')
    await page.locator('#feedback-modal [data-modal-close]').click()
    await open.click()
    check(await message.inputValue() === 'My feedback\nAnother line', 'Reopening must preserve the draft')
    await page.locator('#feedback-modal [data-modal-close]').click()
  }
  return 'Feedback window opening, focus and draft preservation passed on desktop and mobile.'
}
