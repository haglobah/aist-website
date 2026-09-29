// Photos for the gallery section, shown in this order. Add files to src/assets/gallery/ and list them here.
import type { ImageMetadata } from 'astro'
import type { Localized } from '../i18n'
import eagLondon from '../assets/gallery/eag-london.jpg'
import screening from '../assets/gallery/screening.jpg'
import readingGroup from '../assets/gallery/reading-group.jpg'
import posterSkillInject from '../assets/gallery/poster-skill-inject.jpg'
import posterSessionTeam from '../assets/gallery/poster-session-team.jpg'
import nightOut from '../assets/gallery/night-out.jpg'
import dinner from '../assets/gallery/dinner.jpg'

export interface GalleryPhoto {
  src: ImageMetadata
  alt: Localized
}

export const gallery: GalleryPhoto[] = [
  {
    src: eagLondon,
    alt: {
      en: 'Group photo at EAG London in front of a window with the Canary Wharf skyline',
      de: 'Gruppenfoto bei der EAG London vor einem Fenster mit der Skyline von Canary Wharf',
    },
  },
  {
    src: screening,
    alt: {
      en: 'Audience watching an interview on a large screen in a lecture room',
      de: 'Publikum schaut in einem Hörsaal ein Interview auf einer großen Leinwand',
    },
  },
  {
    src: readingGroup,
    alt: {
      en: 'Reading group around a table while a presenter discusses results on a screen',
      de: 'Lesegruppe am Tisch, während eine Vortragende Ergebnisse auf einem Bildschirm bespricht',
    },
  },
  {
    src: posterSkillInject,
    alt: {
      en: 'A researcher explains the Skill-Inject poster to a visitor',
      de: 'Ein Forscher erklärt einem Besucher das Skill-Inject-Poster',
    },
  },
  {
    src: posterSessionTeam,
    alt: {
      en: 'Five people next to the AI Safety Tübingen roll-up banner at a poster session',
      de: 'Fünf Personen neben dem Roll-up-Banner von AI Safety Tübingen bei einer Postersession',
    },
  },
  {
    src: nightOut,
    alt: {
      en: 'Four people in AI Safety Tübingen T-shirts by a river at night',
      de: 'Vier Personen in AI-Safety-Tübingen-T-Shirts nachts an einem Fluss',
    },
  },
  {
    src: dinner,
    alt: {
      en: 'A large group at a long table having dinner together',
      de: 'Eine große Gruppe beim gemeinsamen Abendessen an einer langen Tafel',
    },
  },
]
