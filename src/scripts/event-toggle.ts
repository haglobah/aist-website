// Hover reveals an event's description; clicking the title keeps it open, e.g. on touch screens.
document.querySelectorAll<HTMLButtonElement>('[data-calendar-toggle]').forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'))
}))
