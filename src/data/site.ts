// Site content. Placeholder copy, based on the paper mock.

export type EventTypeId = 'technical-ai-safety' | 'ai-governance' | 'introductory-course' | 'events'

export interface EventType {
  id: EventTypeId
  name: string
  schedule?: { weekday: number; dayLabel: string; time: string; place: string }
  description: string
  foodUrl: string
  feedbackUrl: string
}

export interface CalendarEntry {
  date?: string // ISO date override; otherwise use the next regular occurrence
  time?: string
  type: EventTypeId
  title: string
  place: string
}

export const site = {
  name: 'AI Safety Tübingen',
  url: 'https://aisafetytuebingen.com',
}

export const hero = {
  heading: 'Let’s make sure AI development happens safely.',
  text: 'AI Safety Tübingen is a student-led initiative dedicated to reducing the risks posed by advanced AI Systems. Together, we want to learn about current research in AI Safety, develop relevant skills, and connect students with the international research community.',
}

export const links = [
  { label: 'About us', href: '#about-us', note: 'The people behind AI Safety Tübingen' },
  { label: 'Resources', href: '#resources', note: 'Reading lists, courses, tools' },
]

export const hangout = {
  heading: "Come join us!",
  text: 'Want to discuss an idea, get feedback on a project, or simply meet someone from the group? We’ll make time.',
  actions: [
    { label: 'Join our WhatsApp group', href: 'https://chat.whatsapp.com/LDB5MYKqpsN17pzGBwrKwv' },
    { label: 'Book a 1:1', href: '#one-on-one' },
    { label: 'Contact us', href: '#contact' },
  ],
}

export const eventTypes: EventType[] = [
  {
    id: 'technical-ai-safety',
    name: 'Technical AI Safety Group',
    schedule: { weekday: 1, dayLabel: 'Mondays', time: '18:00', place: 'Maria-von-Linden-Straße 1' },
    description:
      'We read a paper beforehand, get a small presentation, and then discuss and eat.',
    foodUrl: '#food-technical-ai-safety',
    feedbackUrl: '#feedback-technical-ai-safety',
  },
  {
    id: 'ai-governance',
    name: 'AI Governance Group',
    schedule: { weekday: 4, dayLabel: 'Thursdays', time: '18:00', place: 'irgendwo unten in der Stadt?' },
    description:
      'A group member or guest introduces a topic, followed by questions, debate, and discussion.',
    foodUrl: '#food-ai-governance',
    feedbackUrl: '#feedback-ai-governance',
  },
  {
    id: 'introductory-course',
    name: 'Introductory Course',
    description:
      'Hands-on: we build, evaluate, or red-team a model. Bring your laptop; we provide compute.',
    foodUrl: '#food-introductory-course',
    feedbackUrl: '#feedback-introductory-course',
  },
  {
    id: 'events',
    name: 'Other events',
    description: 'No agenda, just people. Eat, drink, and chat. New faces are always welcome.',
    foodUrl: '#food-events',
    feedbackUrl: '#feedback-events',
  },
]

export const calendar: CalendarEntry[] = [
  { type: 'technical-ai-safety', title: 'Sleeper Agents (Hubinger et al.)', place: 'Location TBA' },
  { date: '2026-09-29', time: '18:30', type: 'events', title: 'Social meetup', place: 'Location TBA' },
  { type: 'ai-governance', title: 'How do we measure deception in language models?', place: 'Location TBA' },
  { date: '2026-10-17', time: '10:00', type: 'introductory-course', title: 'Interpretability hack day', place: 'Location TBA' },
  { type: 'technical-ai-safety', title: 'Scalable Oversight, Part 1', place: 'Location TBA' },
  { date: '2026-10-27', time: '18:30', type: 'events', title: 'Social meetup', place: 'Location TBA' },
  { type: 'ai-governance', title: 'Guest talk: AI regulation in the EU', place: 'Location TBA' },
  { type: 'technical-ai-safety', title: 'Scalable Oversight, Part 2', place: 'Location TBA' },
]

export const contact = {
  heading: 'Get in touch',
  text: 'Drop by an event or send us a message first. Either works.',
  email: 'hello@example.org',
  socials: [
    { label: 'Email', href: 'mailto:hello@example.org' },
    { label: 'Mastodon', href: '#mastodon' },
  ],
}

// Helpers

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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
      throw new Error(`Event "${entry.title}" needs an explicit date and time without a regular schedule`)
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
    if (!date) throw new Error(`Missing date for "${entry.title}"`)
    previous.set(entry.type, date > (previous.get(entry.type) ?? '') ? date : previous.get(entry.type)!)
    return { ...entry, date, time, index }
  }).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
}
