import type { Booking } from '../data/organizers.ts'

export function bookingTarget(booking: Booking, host: string) {
  if (booking.provider === 'pending') return { kind: 'pending' } as const
  const url = new URL(booking.url)
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Booking links must use HTTPS')
  switch (booking.provider) {
    case 'google':
      if (url.hostname !== 'calendar.google.com' || !url.pathname.startsWith('/calendar/appointments/schedules/')) {
        throw new Error('Use the full Google appointment embed URL')
      }
      return { kind: 'iframe', url: url.href } as const
    case 'calendly':
      if (url.hostname !== 'calendly.com') throw new Error('Use a calendly.com booking link')
      url.searchParams.set('embed_domain', host)
      url.searchParams.set('embed_type', 'Inline')
      return { kind: 'iframe', url: url.href } as const
    case 'cal':
    case 'savvycal':
      if (url.hostname !== (booking.provider === 'cal' ? 'cal.com' : 'savvycal.com')) {
        throw new Error(`Unexpected booking host for ${booking.provider}`)
      }
      return { kind: booking.provider, link: url.pathname.replace(/^\/+|\/+$/g, '') + url.search } as const
    case 'link':
      return { kind: 'link' } as const
  }
}
