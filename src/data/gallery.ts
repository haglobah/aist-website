// Photos for the gallery section, shown in this order. Add files to src/assets/gallery/ and list them here.
import type { ImageMetadata } from 'astro'
import eagLondon from '../assets/gallery/eag-london.jpg'
import screening from '../assets/gallery/screening.jpg'
import readingGroup from '../assets/gallery/reading-group.jpg'
import posterSkillInject from '../assets/gallery/poster-skill-inject.jpg'
import posterSessionTeam from '../assets/gallery/poster-session-team.jpg'
import nightOut from '../assets/gallery/night-out.jpg'
import dinner from '../assets/gallery/dinner.jpg'

export const gallery: ImageMetadata[] = [
  eagLondon,
  screening,
  readingGroup,
  posterSkillInject,
  posterSessionTeam,
  nightOut,
  dinner,
]
