import type { Organizer } from '../data/organizers'
import { bookingTarget } from './booking-target'

type EmbedCommand = (command: string, options?: Record<string, unknown>) => void
declare global {
  interface Window { Cal?: EmbedCommand; SavvyCal?: EmbedCommand }
}

const scripts = new Map<string, Promise<void>>()
// Both SDKs consume the command queue installed by their official embed snippet.
function commandQueue() {
  const api = Object.assign((...args: unknown[]) => { api.q.push(args) }, {
    q: [] as unknown[][],
    ns: {},
  })
  return api
}

function loadScript(src: string) {
  if (!scripts.has(src)) {
    scripts.set(src, new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      const timeout = window.setTimeout(fail, 15000)
      function fail() {
        window.clearTimeout(timeout)
        script.remove()
        scripts.delete(src)
        reject(new Error(`Could not load booking script: ${src}`))
      }
      script.src = src
      script.async = true
      script.onload = () => { window.clearTimeout(timeout); resolve() }
      script.onerror = fail
      document.head.append(script)
    }))
  }
  return scripts.get(src)!
}

let widgetId = 0
class OrganizerBooking extends HTMLElement {
  private initialized = false

  connectedCallback() {
    if (this.initialized) return
    this.initialized = true
    const buttons = this.querySelectorAll<HTMLButtonElement>('[data-organizer]')
    const heading = this.querySelector<HTMLElement>('[data-booking-heading]')!
    const status = this.querySelector<HTMLElement>('[data-booking-status]')!
    const link = this.querySelector<HTMLAnchorElement>('[data-booking-link]')!
    const embed = this.querySelector<HTMLElement>('[data-booking-embed]')!
    let version = 0

    const reset = () => {
      version++
      embed.replaceChildren()
      link.hidden = true
      link.removeAttribute('href')
      buttons.forEach(button => button.setAttribute('aria-pressed', 'false'))
      heading.textContent = 'Make time for a conversation'
      status.textContent = 'Select someone to see their booking availability.'
    }
    // The picker can move between an inline section and a dialog on resize.
    document.addEventListener('close', (event) => {
      if (event.target instanceof HTMLDialogElement && event.target.contains(this)) reset()
    }, true)

    buttons.forEach(button => button.addEventListener('click', async () => {
      const organizer: Organizer = JSON.parse(button.dataset.organizer!)
      reset()
      const selection = version
      button.setAttribute('aria-pressed', 'true')
      heading.textContent = `Book with ${organizer.name}`
      try {
        const target = bookingTarget(organizer.booking, window.location.host)
        if (target.kind === 'pending') {
          status.textContent = 'Booking link coming soon. Please check back later.'
          return
        }
        if (organizer.booking.provider === 'pending') return
        link.href = organizer.booking.url
        link.hidden = false
        if (target.kind === 'link') {
          status.textContent = 'Use the booking page to choose a time.'
          return
        }
        status.textContent = 'Choose a time below. If the form does not appear, open the booking page in a new tab.'
        if (target.kind === 'iframe') {
          const iframe = document.createElement('iframe')
          iframe.title = `Book a call with ${organizer.name}`
          iframe.src = target.url
          embed.append(iframe)
          return
        }
        const mount = document.createElement('div')
        mount.id = `booking-widget-${++widgetId}`
        mount.className = 'min-h-[650px] bg-white'
        embed.append(mount)
        if (target.kind === 'cal') {
          window.Cal ??= commandQueue()
          await loadScript('https://app.cal.com/embed/embed.js')
          if (selection !== version || !this.isConnected) return
          if (!window.Cal) throw new Error('Cal.com embed unavailable')
          window.Cal('init', { origin: 'https://cal.com' })
          window.Cal('inline', { elementOrSelector: mount, calLink: target.link })
        } else {
          window.SavvyCal ??= commandQueue()
          await loadScript('https://embed.savvycal.com/v1/embed.js')
          if (selection !== version || !this.isConnected) return
          if (!window.SavvyCal) throw new Error('SavvyCal embed unavailable')
          window.SavvyCal('init')
          window.SavvyCal('inline', { link: target.link, selector: `#${mount.id}` })
        }
      } catch (error) {
        console.error('Booking form could not be opened', error)
        if (selection !== version) return
        embed.replaceChildren()
        status.textContent = 'The booking form could not load. Please use the booking page or try again.'
      }
    }))
  }
}
customElements.define('organizer-booking', OrganizerBooking)
