// Shared content for all design variants. Placeholder copy, based on the paper mock.

export type EventTypeId = 'lesekreis' | 'vortrag' | 'workshop' | 'stammtisch'

export interface EventType {
  id: EventTypeId
  name: string
  rhythm: string
  description: string
  foodUrl: string
  feedbackUrl: string
}

export interface CalendarEntry {
  date: string // ISO date
  time: string
  type: EventTypeId
  title: string
  place: string
}

export const site = {
  name: 'AIS',
  tagline: 'AI Safety in Bonn',
  url: 'https://example.org',
}

export const hero = {
  heading: 'Was ist AIS?',
  text: 'AIS ist eine offene Gruppe in Bonn, die sich mit der Sicherheit von KI-Systemen beschäftigt. Wir lesen Paper, hören Vorträge, bauen kleine Experimente und kochen zusammen. Vorwissen brauchst du nicht, Neugier schon.',
}

export const links = [
  { label: 'Wer sind wir', href: '#wer', note: 'Die Leute hinter AIS' },
  { label: 'Ressourcen', href: '#ressourcen', note: 'Leselisten, Kurse, Werkzeuge' },
  { label: 'Galerie alter Events', href: '#galerie', note: 'Fotos und Folien' },
]

export const hangout = {
  heading: "Let's hang out!",
  text: 'Du willst über ein Thema reden, brauchst Feedback zu einem Projekt oder willst einfach jemanden von uns kennenlernen? Wir nehmen uns Zeit.',
  actions: [
    { label: '1:1 buchen', href: '#eins-zu-eins' },
    { label: 'Feedback holen', href: '#feedback' },
  ],
}

export const eventTypes: EventType[] = [
  {
    id: 'lesekreis',
    name: 'Lesekreis',
    rhythm: 'Alle zwei Wochen, donnerstags',
    description:
      'Wir lesen vorab ein Paper oder ein Kapitel und besprechen es gemeinsam. Etwa 90 Minuten, danach oft noch Pizza.',
    foodUrl: '#essen-lesekreis',
    feedbackUrl: '#feedback-lesekreis',
  },
  {
    id: 'vortrag',
    name: 'Vortrag',
    rhythm: 'Einmal im Monat',
    description:
      'Jemand aus der Gruppe oder ein Gast stellt ein Thema vor. Danach Fragen, Widerspruch und Diskussion.',
    foodUrl: '#essen-vortrag',
    feedbackUrl: '#feedback-vortrag',
  },
  {
    id: 'workshop',
    name: 'Workshop',
    rhythm: 'Samstags, ganztägig',
    description:
      'Hands-on: Wir bauen, evaluieren oder red-teamen ein Modell. Laptop mitbringen, wir stellen Rechenzeit.',
    foodUrl: '#essen-workshop',
    feedbackUrl: '#feedback-workshop',
  },
  {
    id: 'stammtisch',
    name: 'Stammtisch',
    rhythm: 'Letzter Dienstag im Monat',
    description: 'Kein Programm, nur Leute. Essen, trinken, reden. Neue Gesichter sind ausdrücklich willkommen.',
    foodUrl: '#essen-stammtisch',
    feedbackUrl: '#feedback-stammtisch',
  },
]

export const calendar: CalendarEntry[] = [
  { date: '2026-09-24', time: '19:00', type: 'lesekreis', title: 'Sleeper Agents (Hubinger et al.)', place: 'Raum 1.014, Uni Bonn' },
  { date: '2026-09-29', time: '18:30', type: 'stammtisch', title: 'Stammtisch', place: 'Brauhaus Bönnsch' },
  { date: '2026-10-08', time: '19:00', type: 'vortrag', title: 'Wie misst man Täuschung in Sprachmodellen?', place: 'Hörsaal 2, Uni Bonn' },
  { date: '2026-10-17', time: '10:00', type: 'workshop', title: 'Interpretability-Hackday', place: 'Coworking Altstadt' },
  { date: '2026-10-22', time: '19:00', type: 'lesekreis', title: 'Scalable Oversight, Teil 1', place: 'Raum 1.014, Uni Bonn' },
  { date: '2026-10-27', time: '18:30', type: 'stammtisch', title: 'Stammtisch', place: 'Brauhaus Bönnsch' },
  { date: '2026-11-05', time: '19:00', type: 'vortrag', title: 'Gastvortrag: KI-Regulierung in der EU', place: 'Hörsaal 2, Uni Bonn' },
  { date: '2026-11-19', time: '19:00', type: 'lesekreis', title: 'Scalable Oversight, Teil 2', place: 'Raum 1.014, Uni Bonn' },
]

export const contact = {
  heading: 'Get in touch',
  text: 'Komm einfach zu einem Termin vorbei oder schreib uns vorher. Beides ist gut.',
  email: 'hallo@example.org',
  socials: [
    { label: 'E-Mail', href: 'mailto:hallo@example.org' },
    { label: 'Signal-Gruppe', href: '#signal' },
    { label: 'Discord', href: '#discord' },
    { label: 'Mastodon', href: '#mastodon' },
  ],
}

export const designs = [
  { slug: '1-aushang', n: 1, name: 'Aushang', note: 'Der Mock eins zu eins: zwei Spalten, Kalender rechts, Tinte auf Papier.' },
  { slug: '2-lesespalte', n: 2, name: 'Lesespalte', note: 'Eine schmale Textspalte, Termine hängen im Rand. Ruhig und lesbar.' },
  { slug: '3-stundenplan', n: 3, name: 'Stundenplan', note: 'Kalender zuerst: Monatsraster mit einer Farbe pro Event-Typ.' },
  { slug: '4-plakat', n: 4, name: 'Plakat', note: 'Große Schrift, vier schwere Blöcke, Termine als Tabelle.' },
  { slug: '5-karteikarte', n: 5, name: 'Karteikarte', note: 'Linierte Karteikarten mit Reitern. Schreibtisch statt Website.' },
]

// Helpers

const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const months = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

export function parts(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return {
    weekday: weekdays[d.getDay()],
    day: d.getDate(),
    month: months[d.getMonth()],
    monthShort: months[d.getMonth()].slice(0, 3),
    year: d.getFullYear(),
    dayPadded: String(d.getDate()).padStart(2, '0'),
    monthPadded: String(d.getMonth() + 1).padStart(2, '0'),
  }
}

export function typeById(id: EventTypeId): EventType {
  return eventTypes.find((t) => t.id === id)!
}
