// Run with a Playwright Page against the dev server. Provider documents are mocked;
// this checks our integration, not the providers' appointment submission flows.
export default async function testBooking(page) {
  const check = (condition, message) => { if (!condition) throw new Error(message) }
  const open = () => page.getByRole('button', { name: 'Book a 1:1', exact: true }).click()
  const dialog = page.locator('#one-on-one')
  const choices = dialog.locator('[data-organizer]')
  const configure = (provider, url) => choices.first().evaluate((button, booking) => {
    const organizer = JSON.parse(button.dataset.organizer)
    organizer.booking = booking
    button.dataset.organizer = JSON.stringify(organizer)
  }, { provider, url })

  await page.goto('http://localhost:4321')
  await open()
  check(await dialog.evaluate(el => el.matches(':modal')), 'Dialog must be modal')
  check(await choices.count() === 3, 'Expected three organizers')
  check(await dialog.locator('iframe').count() === 0, 'Must not load bookings before selection')
  check(await page.locator('nav a').first().evaluate(el => {
    el.focus()
    return document.activeElement !== el
  }), 'Background must remain inert')
  for (let index = 0; index < 3; index++) {
    await choices.nth(index).click()
    check(await dialog.locator('[data-booking-heading]').textContent() === `Book with Organizer ${index + 1}`, 'Wrong organizer selected')
    check(await dialog.locator('[data-booking-status]').textContent() === 'Booking link coming soon. Please check back later.', 'Missing stub message')
    check(await dialog.locator('[aria-pressed=true]').count() === 1, 'Selection must be exclusive')
    check(!await dialog.locator('[data-booking-link]').isVisible(), 'Stubs must not have booking links')
  }
  await page.keyboard.press('Escape')
  check(!await dialog.isVisible(), 'Escape must close the modal')
  check(await page.getByRole('button', { name: 'Book a 1:1', exact: true }).evaluate(el => document.activeElement === el), 'Focus must return to trigger')
  await open()
  check(await dialog.locator('[aria-pressed=true]').count() === 0, 'Reopening must reset booking selection')
  await dialog.getByRole('button', { name: 'Close Book a 1:1' }).click()
  check(!await dialog.isVisible(), 'Close button must dismiss the modal')
  await open()
  await page.mouse.click(2, 2)
  check(!await dialog.isVisible(), 'Backdrop must dismiss the modal')

  await page.setViewportSize({ width: 800, height: 844 })
  await open()
  check(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().height <= innerHeight), 'Narrow desktop dialog must fit')
  await page.keyboard.press('Escape')

  // Minimal SDK doubles enforce each provider's bootstrap contract.
  await page.route('https://**/*', async route => {
    const url = route.request().url()
    if (url === 'https://app.cal.com/embed/embed.js' || url === 'https://embed.savvycal.com/v1/embed.js') {
      const name = url.includes('savvycal') ? 'SavvyCal' : 'Cal'
      await route.fulfill({ contentType: 'text/javascript', body: `
        if (!window.${name}?.q) throw new Error('Missing ${name} queue');
        window.${name} = (command, options) => {
          if (command !== 'inline') return;
          const element = options.elementOrSelector || document.querySelector(options.selector);
          const frame = document.createElement('iframe');
          frame.title = '${name} test booking';
          element.append(frame);
        };
      ` })
    } else {
      await route.fulfill({ contentType: 'text/html', body: '<h1>Test booking page</h1>' })
    }
  })
  try {
    await page.reload()
    await open()
    for (const [provider, url] of [
      ['google', 'https://calendar.google.com/calendar/appointments/schedules/example'],
      ['calendly', 'https://calendly.com/example/chat'],
      ['cal', 'https://cal.com/example/chat'],
      ['savvycal', 'https://savvycal.com/example/chat'],
    ]) {
      await configure(provider, url)
      await choices.first().click()
      await dialog.locator('[data-booking-embed] iframe').waitFor({ state: 'attached' })
      check(await dialog.locator('[data-booking-embed] iframe').count() === 1, 'Previous booking must be removed')
      check(await dialog.locator('[data-booking-link]').getAttribute('href') === url, 'Direct booking fallback must match organizer')
    }
    await configure('link', 'https://example.com/book')
    await choices.first().click()
    check(await dialog.locator('iframe').count() === 0, 'Link-only providers must not be embedded')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => document.querySelector('#one-on-one [data-booking-link]').getAttribute('href') === null)
    check(await dialog.locator('[data-booking-link]').getAttribute('href') === null, 'Closing must clear booking details')
  } finally {
    await page.unrouteAll({ behavior: 'wait' })
  }

  // A late provider response must not overwrite a newer organizer selection.
  let release
  const gate = new Promise(resolve => { release = resolve })
  await page.route('https://app.cal.com/embed/embed.js', async route => {
    await gate
    await route.fulfill({ contentType: 'text/javascript', body: "window.Cal = () => { throw new Error('Stale selection mounted') }" })
  })
  try {
    await page.reload()
    await open()
    await configure('cal', 'https://cal.com/example/chat')
    const requested = page.waitForRequest('https://app.cal.com/embed/embed.js')
    await choices.first().click()
    await requested
    await choices.nth(1).click()
    const response = page.waitForResponse('https://app.cal.com/embed/embed.js')
    release()
    await response
    check(await dialog.locator('[data-booking-heading]').textContent() === 'Book with Organizer 2', 'Late response changed organizer')
    check(await dialog.locator('[data-booking-embed]').textContent() === '', 'Late response mounted a booking form')
  } finally {
    release()
    await page.unrouteAll({ behavior: 'wait' })
  }

  await page.route('https://app.cal.com/embed/embed.js', route => route.abort())
  try {
    await page.reload()
    await open()
    await configure('cal', 'https://cal.com/example/chat')
    await choices.first().click()
    await dialog.getByText('The booking form could not load. Please use the booking page or try again.').waitFor()
    check(await dialog.locator('[data-booking-link]').isVisible(), 'Load failure must keep direct fallback')
  } finally {
    await page.unrouteAll({ behavior: 'wait' })
    await page.goto('http://localhost:4321')
    await page.setViewportSize({ width: 1280, height: 900 })
  }
  return 'Modal, organizer selection, mobile layout, provider integrations, cancellation and failure fallback passed.'
}
