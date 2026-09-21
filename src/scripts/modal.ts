// Native dialogs provide focus containment, Escape dismissal and focus restoration.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return
  const trigger = event.target.closest<HTMLElement>('[data-modal-open]')
  if (!trigger) return
  const dialog = document.getElementById(trigger.dataset.modalOpen ?? '')
  if (dialog instanceof HTMLDialogElement && !dialog.open) {
    event.preventDefault()
    dialog.showModal()
  }
})

document.querySelectorAll<HTMLDialogElement>('dialog[data-modal]').forEach((dialog) => {
  dialog.addEventListener('beforetoggle', (event) => {
    if ((event as ToggleEvent).newState !== 'open' || document.querySelector('dialog[data-modal][open]')) return
    // Measure before the open attribute locks scrolling and removes the scrollbar.
    document.documentElement.style.setProperty(
      '--modal-scrollbar-width',
      `${window.innerWidth - document.documentElement.clientWidth}px`,
    )
  })
  dialog.querySelector('[data-modal-close]')?.addEventListener('click', () => dialog.close())
  // Require both ends of the click to be outside, so dragging from content won't dismiss it.
  let startedOnBackdrop = false
  dialog.addEventListener('pointerdown', (event) => {
    startedOnBackdrop = event.target === dialog
  })
  dialog.addEventListener('click', (event) => {
    if (startedOnBackdrop && event.target === dialog) dialog.close()
    startedOnBackdrop = false
  })
})
