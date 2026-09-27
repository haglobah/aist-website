// Adapted from https://aisafetytuebingen.com/resources/
import type { Localized } from '../i18n'

export interface Resource { label: Localized; href: string; note?: Localized }
export interface ResourceGroup { title: Localized; links: Resource[]; note?: Localized }

export const resourceGroups: ResourceGroup[] = [
  {
    "title": { "en": "Introduction & overview", "de": "Einführung & Überblick" },
    "links": [
      {
        "label": "AI Safety Map",
        "href": "https://www.aisafety.com/map"
      },
      {
        "label": "List of links for getting into AI Safety",
        "href": "https://www.lesswrong.com/posts/FkDuWGtiCTshovoTN/list-of-links-for-getting-into-ai-safety"
      },
      {
        "label": "List of AI Safety Newsletter & other resources",
        "href": "https://forum.effectivealtruism.org/posts/hsmh4fD8Dbkzvdehk/list-of-ai-safety-newsletters-and-other-resources"
      },
      {
        "label": "AISafety.info",
        "href": "https://aisafety.info/"
      }
    ]
  },
  {
    "title": { "en": "Courses", "de": "Kurse" },
    "links": [
      {
        "label": "BlueDot Impact",
        "href": "https://bluedot.org/courses"
      },
      {
        "label": "AI Safety Collab",
        "href": "https://lavish-raft-3ec.notion.site/AI-Safety-Collab-21ecc955fe3380729a53d88a300966e4"
      }
    ]
  },
  {
    "title": { "en": "Forums & discussion", "de": "Foren & Diskussion" },
    "links": [
      {
        "label": "LessWrong",
        "href": "https://www.lesswrong.com/"
      },
      {
        "label": "AlignmentForum",
        "href": "https://www.alignmentforum.org/"
      }
    ]
  },
  {
    "title": "Podcasts",
    "links": [
      {
        "label": "80,000 hours podcast",
        "href": "https://80000hours.org/podcast/"
      },
      {
        "label": "Dwarkesh Podcast",
        "href": "https://www.dwarkeshpatel.com/podcast"
      },
      {
        "label": "AI X-Risk Research Podcast",
        "href": "https://axrp.net/"
      },
      {
        "label": "Future of Life Institute Podcast",
        "href": "https://futureoflife.org/project/future-of-life-institute-podcast/"
      }
    ]
  },
  {
    "title": "Blogs",
    "links": [
      {
        "label": "Astral Codex Ten",
        "href": "https://www.astralcodexten.com/"
      },
      {
        "label": "Redwood Research Substack",
        "href": "https://blog.redwoodresearch.org/"
      }
    ],
    "note": { "en": "Many AI safety organizations and researchers also publish their own blogs and writing.", "de": "Viele Organisationen und Forschende im Bereich KI-Sicherheit veröffentlichen auch eigene Blogs und Texte." }
  },
  {
    "title": "YouTube",
    "links": [
      {
        "label": "Rob Miles AI Safety",
        "href": "https://www.youtube.com/c/robertmilesai"
      },
      {
        "label": "Rational Animations",
        "href": "https://www.youtube.com/@RationalAnimations"
      },
      {
        "label": "AI in Context",
        "href": "https://www.youtube.com/@AI_In_Context"
      }
    ]
  }
]

export const fellowshipGroups: ResourceGroup[] = [
  {
    "title": { "en": "Full-time", "de": "Vollzeit" },
    "links": [
      {
        "label": "MATS",
        "href": "https://www.matsprogram.org/"
      },
      {
        "label": "ERA",
        "href": "https://erafellowship.org/"
      },
      {
        "label": "Pivotal",
        "href": "https://www.pivotal-research.org/fellowship"
      },
      {
        "label": "MARS",
        "href": "https://caish.org/mars"
      },
      {
        "label": "PIBBSS",
        "href": "https://princint.ai/"
      },
      {
        "label": "Anthropic Fellows Program",
        "href": "https://alignment.anthropic.com/2024/anthropic-fellows-program/"
      }
    ],
    "note": { "en": "Typically 12 weeks", "de": "Meist 12 Wochen" }
  },
  {
    "title": { "en": "Part-time", "de": "Teilzeit" },
    "links": [
      {
        "label": "SPAR",
        "href": "https://sparai.org/"
      },
      {
        "label": "AI Safety Camp",
        "href": "https://www.aisafety.camp/"
      },
      {
        "label": "Algoverse",
        "href": "https://algoverseairesearch.org/ai-safety-fellowship"
      },
      {
        "label": "Athena",
        "href": "https://researchathena.org/",
        "note": { "en": "For women and non-binary people", "de": "Für Frauen und nicht-binäre Personen" }
      }
    ]
  },
  {
    "title": { "en": "Upskilling programs", "de": "Weiterbildungsprogramme" },
    "links": [
      {
        "label": "ARENA",
        "href": "https://www.arena.education/"
      },
      {
        "label": "ML4Good",
        "href": "https://www.ml4good.org/"
      },
      {
        "label": "ARBOx",
        "href": "https://oaisi.org/arbox3"
      }
    ]
  },
  {
    "title": "Governance",
    "links": [
      {
        "label": "GovAI",
        "href": "https://www.governance.ai/"
      },
      {
        "label": "Talos",
        "href": "https://www.talosnetwork.org/talos-fellowship"
      },
      {
        "label": "IAPS",
        "href": "https://www.iaps.ai/fellowship"
      }
    ]
  },
  {
    "title": { "en": "More opportunities", "de": "Weitere Möglichkeiten" },
    "links": [
      {
        "label": "Apart",
        "href": "https://apartresearch.com/fellowships",
        "note": { "en": "Fellowships & hackathons", "de": "Fellowships & Hackathons" }
      },
      {
        "label": "Tarbell",
        "href": "https://www.tarbellcenter.org/",
        "note": { "en": "Journalism", "de": "Journalismus" }
      },
      {
        "label": "Global Challenges Project",
        "href": "https://www.globalchallengesproject.org/"
      },
      {
        "label": "Future Impact Group",
        "href": "https://futureimpact.group/"
      },
      {
        "label": "Impact Academy Global AI Safety Fellowship",
        "href": "https://globalaisafetyfellowship.com/"
      },
      {
        "label": "EA conferences",
        "href": "https://www.effectivealtruism.org/ea-global/events",
        "note": { "en": "AI safety talks, collaborators & community", "de": "Vorträge zu KI-Sicherheit, Mitstreiter*innen & Community" }
      }
    ]
  }
]

export const careerAdvice: Resource = {"label": { "en": "80,000 hours career advice", "de": "Karriereberatung von 80,000 Hours" }, "href": "https://80000hours.org/speak-with-us/"}
