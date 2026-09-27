// Organizers, shown in About us and as small portraits next to “Call us maybe!”.
import type { Localized } from '../i18n'

export interface Person {
  name: string
  role: Localized
  image?: string // until a photo exists, initials stand in
  href?: string
  bio: Localized
}

export const people: Person[] = [
  {
    name: 'Johannes Koch',
    role: 'Co-founder & Advisor',
    image: `${import.meta.env.BASE_URL}people/johannes-koch.jpg`,
    href: 'https://www.linkedin.com/in/johannes-koch-5b4620259/?locale=en_US',
    bio: {
      en: 'Fellowship Manager at Safe AI Germany. Previously co-founded and led the AI Safety Tübingen student group, while studying Machine Learning.',
      de: 'Fellowship Manager bei Safe AI Germany. Hat zuvor neben dem Machine-Learning-Studium die Studierendengruppe AI Safety Tübingen mitgegründet und geleitet.',
    },
  },
  {
    name: 'Katharina Deckenbach',
    role: 'Co-founder & Director',
    image: `${import.meta.env.BASE_URL}people/katharina-deckenbach.jpg`,
    href: 'https://www.linkedin.com/in/katharina-deckenbach/',
    bio: {
      en: 'PhD student in Sahar Abdelnabi’s COMPASS group, with a background in Cognitive Science and Machine Learning. Previously organized AI safety events in Stockholm.',
      de: 'Promoviert in Sahar Abdelnabis COMPASS-Gruppe, mit Hintergrund in Kognitionswissenschaft und Machine Learning. Hat zuvor Events zu KI-Sicherheit in Stockholm organisiert.',
    },
  },
  {
    name: 'Aleksandra Shcherbakova',
    role: 'Governance Lead & Pathfinder Fellow',
    image: `${import.meta.env.BASE_URL}people/aleksandra-shcherbakova.jpg`,
    href: 'https://www.linkedin.com/in/sasha-shcherbakova/',
    bio: {
      en: 'Researches middle-power AISIs as a SPAR fellow and works on the Cambridge Commentary of the AI Act at the Institute for Law and AI. Previously studied law.',
      de: 'Forscht als SPAR Fellow an middle-power AISIs und arbeitet am Cambridge Commentary of the AI Act beim Institute for Law and AI. Hat zuvor Rechtswissenschaften studiert.',
    },
  },
]
