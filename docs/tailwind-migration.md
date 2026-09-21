# Tailwind migration verification

Layout and static styles use Tailwind utilities. Animation and transition rules
remain in CSS: shared motion and the animated card underline in `global.css`,
modal entrance/exit motion in `Modal.astro`, and link-label transitions in
`OuterLink.astro`. Their reduced-motion handling also remains in CSS.
The modal scrollbar width remains a runtime CSS variable because it depends on
the browser's measured scrollbar width.

Verification on 2026-09-20:

- Production build and whitespace checks passed.
- Sampled computed styles matched the baseline at 390, 800, and 1280 pixels.
- Browser checks passed for card clicks, highlighting, keyboard activation,
  secondary links, feedback drafts, and responsive booking.
- Checked the card focus outline, modal open and closed states, and reduced motion.

Existing test issues outside this styling change:

- Three filter unit tests fail with `TypeError: b.focus is not a function`.
  Their button mock lacks the `focus()` method called by the existing script.
- The responsive booking browser check failed once at “Resize must preserve
  selection,” then passed in a focused check and a full rerun. The contributing
  factors have not been established; the test may be timing-sensitive.
