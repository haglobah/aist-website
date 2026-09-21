# Styling revision — 2026-09-20

Beat rejected the initial redesign's startup styling. This revision follows that feedback: PT Serif for the main headings, sans-serif body text, no negative tracking, no invented logo or speech-bubble decoration, no CSS arrow, no colored icon chips, no repeated rounded cards, no sticky calendar or date badges, and no decorative shadows or press animations.

The original green palette was explicitly not restored. The revision uses neutral off-white and charcoal with one rust accent. The headline spans the introduction and invitation; activity descriptions remain beside the calendar. Text and interaction scripts are unchanged.

Typography and spacing use Tailwind's standard scale through utilities and `@apply`. Font families and semantic colors are defined once in `@theme`. Controls and dialogs share `rounded-sm`; content surfaces are square. Component styles use `@reference` to share the theme.

## Verification

- Production build and existing site/filter tests pass.
- Browser layout checks passed at 320, 390, 768, 1024, and 1440px with no horizontal overflow.
- Inspected desktop and mobile screenshots.
- Booking and feedback dialogs, draft preservation across viewport changes, filter/reset, and reduced-motion scrolling passed.
- The final font query initially also matched Astro toolbar headings. Narrowing it to `.hero-heading` confirmed PT Serif is loaded.
- Source scan found no arbitrary font sizes, weights, tracking, radii, or shadows in the revised styles.

## Existing issues outside this change

- About us and Resources link to missing `#about-us` and `#resources` targets.
- All four food-voting links point to missing fragment targets.
- Booking profiles and links remain placeholders; feedback sending remains unavailable.
- The site data no longer defines `tagline`, although layout metadata and the header still reference it.

Copy revisions and additional section labels remain deferred at Beat's request.

# Visual pass — 2026-09-20 (later)

Beat asked for a near-white grey background, the Stocherkahn drawing in the background, and the logo in the header.

- Palette is neutral: grey paper `#efefed`, a whiter sheet `#fbfbfa` for the calendar, dialogs and inputs, black ink, and one river-blue accent `#23596c` for links and the primary action. The rust accent is gone.
- Body text is PT Sans, self-hosted like PT Serif, so headings and body come from one type family.
- `public/logo.webp` is the logo trimmed to black ink with transparency, shown at header height with the site name as alt text. The brand text and the undefined tagline are gone; the page description now uses the hero text.
- `public/stocherkahn.webp` is the drawing converted to black ink with transparency (1400px, lossy). It sits fixed in the centre of the viewport at 20% opacity behind the whole page, per Beat's direction; content surfaces such as the calendar sheet cover it. The hero keeps the earlier arrangement: heading across, intro left, invitation right.
- `public/stocherkahn-monochrome.png` (2 MB) and `public/ais-tue-logo-final-final.png` are the untouched sources and are no longer referenced. They still ship with the build while they stay in `public/`.

## Verification

- `npm run build` and `node --test tests/*.test.mjs` pass.
- Headless Chromium screenshots at 390, 1440 and 1920px: hero, full page, both modals, mobile inline booking and contact sections, calendar filter. Headless capture omits the dialog backdrop; its computed style was confirmed as `rgba(29, 29, 27, 0.6)`.

# About us and Resources — 2026-09-20

- Added About us followed by Resources below the events, resolving both navigation targets.
- Adapted organizer biographies, portraits, LinkedIn links, and the Pathfinder supporter logo from the original About us page.
- Preserved all 40 resource destinations from the original Resources page. Used six topic groups, a separate fellowship surface, and career advice, with the existing fonts and palette.
- Production build and `git diff --check` pass. Compared the built links against the source HTML: no resource URLs missing. Chrome checks passed at 320, 390, 768, and 1280px without horizontal overflow; inspected desktop/mobile screenshots and confirmed navigation and the advice link's desktop dialog/mobile contact behavior.
- Existing limitation: booking still uses placeholder organizer profiles, separate from the new About us profiles. Contact sending is still unavailable; the advice link opens that existing contact UI.
