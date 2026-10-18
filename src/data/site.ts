// Site content. Placeholder copy, based on the paper mock.
import type { Lang, Localized } from '../i18n'

export type EventTypeId = 'technical-ai-safety' | 'ai-governance' | 'introductory-course' | 'events'

export interface EventType {
  id: EventTypeId
  name: Localized
  schedule?: { weekday: number; dayLabel: Localized; time: string; place: Localized; language: Localized }
  info?: Localized // shown instead of the schedule while it is not fixed
  description: Localized
}

export const site = {
  name: 'AI Safety Tübingen',
  url: 'https://aisafetytuebingen.com',
}

export const hero = {
  heading: {
    en: 'Let’s talk about AI Safety!',
    de: 'Let’s talk about AI Safety!',
  },
  text: {
    en: 'AI is the fastest developing technology humanity has ever built. Let us try to understand how it works, how it can affect our lives in order to implement safeguards and prevent harmful events from happening. Let’s do a better job than the guys who brought us the industrial revolution.',
    de: 'KI ist die sich am schnellsten entwickelnde Technologie, die die Menschheit je gebaut hat. Lasst uns versuchen, zu verstehen, wie sie funktioniert und wie sie unser Leben beeinflussen könnte. Lasst uns Vorkehrungen treffen, um schlimme Dinge zu verhindern. Lasst uns einen besseren Job machen als die Jungs, die uns die industrielle Revolution gebracht haben.',
  },
  listIntro: {
    en: 'The events we organize',
    de: 'Dazu veranstalten wir Events,',
  },
  points: [
    {
      en: '**teach** the **basics** and open the room for discussing all the uncertainties and insecurities',
      de: 'die die **Basics** von KI-Sicherheit **erklären** und den Raum für Ungewissheit und Unsicherheit öffnen',
    },
    {
      en: '**build a community** of people who want to get a **deep understanding** of the field of AI safety',
      de: 'die Menschen **vernetzen**, die ein **tiefes Verständnis** von KI-Sicherheit entwickeln wollen',
    },
    {
      en: 'support you to pivot your **career** towards AI Safety.',
      de: 'die dich unterstützen, falls du überlegst, mit deiner **Karriere** zu KI-Sicherheit beizutragen.',
    },
  ] satisfies Localized[],
  closing: {
    en: 'And by the way, we solemnly swear that snacks will be provided!',
    de: 'Achso, und kein Event ohne Snacks, wir schwören!',
  },
}

export const links = [
  { label: { en: 'Contact', de: 'Kontakt' }, href: '#contact' },
  { label: 'Events', href: '#events' },
  { label: { en: 'Gallery', de: 'Galerie' }, href: '#gallery' },
  { label: { en: 'About us', de: 'Über uns' }, href: '#about-us' },
  { label: { en: 'Resources', de: 'Ressourcen' }, href: '#resources' },
  { label: 'Fellowships', href: '#fellowships' },
]

// Event registration, linked above the calendar.
export const registerUrl = 'https://luma.com/aistuebingen'

// Messages from the contact forms are delivered to this address via FormSubmit.
export const contactEmail = 'aistuebingen@gmail.com'

export const hangout = {
  heading: { en: 'Contact form', de: 'Kontaktformular' },
  contact: {
    en: '**Feedback**, **event suggestions**, **food suggestions**, **collaborations**!',
    de: '**Feedback**, **Event-Vorschläge**, **Essensvorschläge**, **Kollaborationen**!',
  },
  stayUpToDate: { en: '**Stay up to date:**', de: '**Sei up to date:**' },
  coffee: {
    en: '**Book a 1:1** to chat about career planning',
    de: '**Buche ein 1:1** für Career Planning',
  },
}

export type SocialId = 'whatsapp' | 'linkedin' | 'instagram'

// Channels without a URL render as a muted "link coming soon" icon.
export const socials: { id: SocialId; label: string; href?: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/LDB5MYKqpsN17pzGBwrKwv' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/112304971/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/aistuebingen/' },
]

export const eventTypes: EventType[] = [
  {
    id: 'technical-ai-safety',
    name: { en: 'Technical reading group', de: 'Technische Lesegruppe' },
    schedule: {
      weekday: 1, dayLabel: { en: 'Mondays', de: 'Montags' }, time: '18:00', place: { en: 'Maria-von-Linden-Str. 1, room 4.01', de: 'Maria-von-Linden-Str. 1, Raum 4.01' },
      language: { en: 'in English', de: 'auf Englisch' },
    },
    description: {
      en: 'Join us as we grab dinner and chat about a recently published paper. Some papers require you to have an understanding of machine learning, others do not. Check the paper beforehand. When in doubt – reach out to us or be brave and just come by!',
      de: 'Komm vorbei auf die Besprechung eines aktuellen Papers bei leckerem Abendessen. Manche Paper erfordern Vorkenntnisse in Machine Learning, andere nicht: Schau dir das konkrete Paper vorher an und wenn du nicht sicher bist – schreib uns an oder sei mutig und komm so rum!',
    },
  },
  {
    id: 'introductory-course',
    name: { en: 'Introductory Course: a three-part course', de: 'Einführung in KI-Sicherheit: ein dreiteiliger Kurs' },
    info: {
      en: 'Room TBA | in German',
      de: 'Raum TBA | auf Deutsch',
    },
    description: {
      en: 'Over the course of three weeks we will learn the fundamentals of: how an AI works – what happens during your interaction with it – what it can and can’t do – in which ways it carries risks – what we can do about them. No technical background required!',
      de: 'In drei aufeinanderfolgenden Wochen besprechen wir die Basics von: Wie funktioniert KI – was passiert bei deiner Anfrage – was können KIs und was nicht – welche Risiken bergen sie – was können wir dagegen tun. Kein technisches Vorwissen erforderlich!',
    },
  },
  {
    id: 'ai-governance',
    name: { en: 'Weekly AI Governance Group', de: 'Wöchentliche Governance-Lesegruppe' },
    info: {
      en: 'Starting in the week of 23 November | Wilhelmstr. 22, first floor | in German',
      de: 'Ab der Woche vom 23. November | Wilhelmstr. 22, erster Stock | auf Deutsch',
    },
    description: {
      en: 'Join us as we grab dinner and check out different proposals on how to govern AI – the position of middle powers – international treaties – legal challenges and so on. No previous knowledge required. The reading list is not set in stone – tell us what you would like to learn about!',
      de: 'Komm dazu, wenn wir bei einem Abendessen in KI-Governance eintauchen. Wir besprechen Regulierungsansätze, die Stellung der Mittelmächte, internationale Verträge, rechtliche Herausforderungen und so weiter. Keine Vorkenntnisse erforderlich.',
    },
  },
  {
    id: 'events',
    name: { en: 'One-off events', de: 'Einmalige Events' },
    description: {
      en: 'Conferences, application-thons, public viewings, discussion panels and so on…',
      de: 'Konferenzen, Bewerbungsmarathons, Diskussionspanels und so weiter…',
    },
  },
]

// Helpers

const weekdays: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
}
const months: Record<Lang, string[]> = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  de: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ],
}

export function parts(iso: string, lang: Lang = 'en') {
  const d = new Date(iso + 'T12:00:00')
  return {
    weekday: weekdays[lang][d.getDay()],
    day: d.getDate(),
    month: months[lang][d.getMonth()],
    monthShort: months[lang][d.getMonth()].slice(0, 3),
    year: d.getFullYear(),
    dayPadded: String(d.getDate()).padStart(2, '0'),
    monthPadded: String(d.getMonth() + 1).padStart(2, '0'),
  }
}

export function typeById(id: EventTypeId): EventType {
  return eventTypes.find((t) => t.id === id)!
}
