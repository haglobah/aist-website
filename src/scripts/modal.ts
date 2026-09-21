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
