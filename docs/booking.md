# Booking calls

“Book a 1:1” opens a reusable modal on desktop (48rem and wider). On mobile it
scrolls to the booking section at the bottom of the page, matching the contact
form. One picker moves between these locations so selection survives resizing.
Page and container scrolling is smooth unless reduced motion is requested. The three
organizers are explicitly placeholders. No external booking resources load for
these stubs.

Edit `src/data/organizers.ts` to replace names, introductions and booking settings:

```ts
booking: { provider: 'calendly', url: 'https://calendly.com/your-name/chat' }
```

Supported providers are `google`, `calendly`, `cal`, `savvycal`, and `link`.
Use `pending` without a URL until the booking page is ready. `link` opens other
services in a new tab. Every configured provider has a direct-link fallback.
Google requires the full iframe URL from its appointment schedule’s website
embed option, not a `calendar.app.google` short link. Custom domains can use
`link`; the embedded adapters accept the standard provider domains.

The selected form loads on demand. Switching organizer or closing the modal
removes it. Provider scripts load once per page, with a visible fallback if they
fail. No booking completion is inferred from an iframe load.

Provider references: [Google](https://support.google.com/calendar/answer/10733297?hl=en),
[Calendly](https://developer.calendly.com/api-docs/overview/embedding/getting-started),
[Cal.com](https://cal.com/embed),
[SavvyCal](https://docs.savvycal.com/article/6-embedding-links-on-your-website).

## Reusing the modal

`Modal.astro` only owns the dialog shell and dismissal behavior. Its default slot
accepts arbitrary content. Give each modal a unique ID and connect a button:

```astro
<button type="button" data-modal-open="example" aria-haspopup="dialog" aria-controls="example">
  Open example
</button>
<Modal id="example" title="Example">
  <p>Any content can go here.</p>
</Modal>
```

It uses the native dialog’s modal focus behavior and Escape handling, restores
focus to its trigger, locks page scrolling, and supports a close button and
backdrop dismissal. The header remains visible while content scrolls.

## Verification

Run `node --test tests/*.test.mjs` and `npm run build`.
`tests/browser/booking.mjs` exports a browser regression check taking a Playwright
`Page`, with the dev server available at `http://localhost:4321`. It covers modal
controls, focus restoration, inert background, three stubs, narrow desktop sizing,
provider initialization, switching, delayed responses and script failure.
Provider responses are mocked; real appointment submission requires organizer
links and has not been tested. `tests/browser/booking-responsive.mjs` covers the
mobile section, desktop modal, resizing with a selection, and reduced motion.

Existing content issues outside this change: About us and Resources point to
missing sections.
