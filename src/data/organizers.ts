export type Booking =
  | { provider: 'pending' }
  | { provider: 'google' | 'calendly' | 'cal' | 'savvycal' | 'link'; url: string }

export interface Organizer {
  id: string
  name: string
  introduction: string
  booking: Booking
}

// Replace these stubs with organizer names, introductions and public booking links.
// Google requires the full iframe src from Share → Website embed, not a short link.
export const organizers: Organizer[] = [
  { id: 'organizer-1', name: 'Organizer 1', introduction: 'Introduction coming soon.', booking: { provider: 'pending' } },
  { id: 'organizer-2', name: 'Organizer 2', introduction: 'Introduction coming soon.', booking: { provider: 'pending' } },
  { id: 'organizer-3', name: 'Organizer 3', introduction: 'Introduction coming soon.', booking: { provider: 'pending' } },
]
