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

export interface CalendarEntry {
  date?: string // ISO date override; otherwise use the next regular occurrence
  time?: string
  type: EventTypeId
  title: Localized
  place: Localized
  description: Localized // revealed on hover or click
  registerUrl?: string // until set, the entry says registration opens soon
}

export const site = {
  name: 'AI Safety Tübingen',
  url: 'https://aisafetytuebingen.com',
}

export const hero = {
  heading: {
    en: 'How come you have never heard of AI Safety?',
    de: 'Wie, du hast noch nicht von KI-Sicherheit gehört?',
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
      en: 'assist you in forwarding more **careers** into AI Safety.',
      de: 'die unterstützen bei **Karriereplanung**, die einen Bezug zu KI-Sicherheit hat.',
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

export const hangout = {
  heading: { en: 'Contact form', de: 'Kontaktformular' },
  contact: {
    en: '**Contact us** for suggestions, feedback, collabs and everything else',
    de: '**Vorschläge** für Essen und Themen, **Feedback**, **Collabs**, …',
  },
  stayUpToDate: { en: '**Stay up to date:**', de: '**Sei up to date:**' },
  coffee: {
    en: '**Book a 1:1** to chat about career planning',
    de: '**Buche ein 1:1** für Career Planning',
  },
  other: { en: '**Other requests**', de: '**Sonstige Anliegen**' },
}

export type SocialId = 'whatsapp' | 'linkedin' | 'instagram'

// Channels without a URL render as a muted "link coming soon" icon.
export const socials: { id: SocialId; label: string; href?: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/LDB5MYKqpsN17pzGBwrKwv' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/112304971/' },
  { id: 'instagram', label: 'Instagram' },
]

export const eventTypes: EventType[] = [
  {
    id: 'technical-ai-safety',
    name: { en: 'Technical reading group', de: 'Technische Lesegruppe' },
    schedule: {
      weekday: 1, dayLabel: { en: 'Mondays', de: 'Montags' }, time: '18:00', place: 'Maria-von-Linden-Str. 1',
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
      en: 'Date and place TBA | separate events in English and German',
      de: 'Zeit und Ort TBA | separat auf Deutsch und Englisch',
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
      en: 'Starting in the week of 23 November | date and place TBA | in German',
      de: 'Ab der Woche vom 23. November | Zeit und Ort TBA | auf Deutsch',
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

const tba = { en: 'Location TBA', de: 'Ort folgt' }
const socialMeetup = {
  title: { en: 'Social meetup', de: 'Gemeinsames Treffen' },
  description: {
    en: 'Food, drinks and good conversations. New faces are always welcome.',
    de: 'Essen, Getränke und gute Gespräche. Neue Gesichter sind immer willkommen.',
  },
}

export const calendar: CalendarEntry[] = [
  {
    type: 'technical-ai-safety', title: 'Sleeper Agents (Hubinger et al.)', place: tba,
    description: {
      en: 'We discuss how language models can keep deceptive behaviour hidden through safety training, and what that means for AI safety.',
      de: 'Wir besprechen, wie Sprachmodelle täuschendes Verhalten trotz Sicherheitstraining verborgen halten können und was das für KI-Sicherheit bedeutet.',
    },
  },
  { date: '2026-09-29', time: '18:30', type: 'events', place: tba, ...socialMeetup },
  {
    type: 'technical-ai-safety', title: { en: 'Scalable Oversight, Part 1', de: 'Scalable Oversight, Teil 1' }, place: tba,
    description: {
      en: 'How can humans supervise AI systems that outperform them at a task? We start with debate and recursive reward modelling.',
      de: 'Wie können Menschen KI-Systeme beaufsichtigen, die bei einer Aufgabe besser sind als sie? Wir beginnen mit Debate und Recursive Reward Modelling.',
    },
  },
  { date: '2026-10-27', time: '18:30', type: 'events', place: tba, ...socialMeetup },
  {
    type: 'technical-ai-safety', title: { en: 'Scalable Oversight, Part 2', de: 'Scalable Oversight, Teil 2' }, place: tba,
    description: {
      en: 'We continue with weak-to-strong generalisation and recent empirical results.',
      de: 'Weiter geht es mit Weak-to-Strong Generalisation und aktuellen empirischen Ergebnissen.',
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

// Resolve in local calendar time so daylight-saving changes preserve the meeting hour.
export function resolveCalendar(entries: CalendarEntry[] = calendar, now = new Date()) {
  const local = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(part => [part.type, part.value]))
  const today = `${local.year}-${local.month}-${local.day}`
  const currentTime = `${local.hour}:${local.minute}:${local.second}`
  const previous = new Map<EventTypeId, string>()

  return entries.map((entry, index) => {
    const schedule = typeById(entry.type).schedule
    const time = entry.time ?? schedule?.time
    if (!time || (!entry.date && !schedule)) {
      throw new Error(`Event "${JSON.stringify(entry.title)}" needs an explicit date and time without a regular schedule`)
    }
    let date = entry.date
    if (!date && schedule) {
      const candidate = new Date(`${today}T00:00:00Z`)
      candidate.setUTCDate(candidate.getUTCDate() + (schedule.weekday - candidate.getUTCDay() + 7) % 7)
      date = candidate.toISOString().slice(0, 10)
      while ((date === today && `${time}:00` < currentTime) || date <= (previous.get(entry.type) ?? '')) {
        candidate.setUTCDate(candidate.getUTCDate() + 7)
        date = candidate.toISOString().slice(0, 10)
      }
    }
    if (!date) throw new Error(`Missing date for "${JSON.stringify(entry.title)}"`)
    previous.set(entry.type, date > (previous.get(entry.type) ?? '') ? date : previous.get(entry.type)!)
    return { ...entry, date, time, index }
  }).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
}
