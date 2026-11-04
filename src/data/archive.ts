// Past events come from the calendar (see loadPastEvents in calendar.ts); only the labels and photos live here.
import type { Localized } from '../i18n'
import type { EventKind } from './calendar'

export interface Photo {
  src: string // path under public/, e.g. 'archive/pubquiz.webp'
  alt: Localized
  caption?: Localized
}

export const kindLabels: Record<EventKind, Localized> = {
  paper: { en: 'Paper discussion', de: 'Paper-Diskussion' },
  talk: { en: 'Talk', de: 'Vortrag' },
  social: { en: 'Social', de: 'Social' },
  course: { en: 'Introductory course', de: 'Einführungskurs' },
  governance: { en: 'Governance group', de: 'Governance-Gruppe' },
  other: { en: 'Event', de: 'Event' },
}

// Titles like "[Talk] Compute Governance" are labelled by kind already.
export const withoutPrefix = (title: string) => title.replace(/^\[[^\]]*\]\s*/, '')

// Add event photos to public/archive/ and list them here; the section appears once there is one.
export const photos: Photo[] = []
