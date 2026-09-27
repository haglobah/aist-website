// Past events, adapted from https://aisafetytuebingen.com/events/ (newest first).
import type { Localized } from '../i18n'

export type PastEventKind = 'paper' | 'talk' | 'social' | 'other'

export interface PastEvent {
  date: string // ISO date
  kind: PastEventKind
  title: string
  by?: string
  links?: { label: string; href: string }[]
}

export interface Photo {
  src: string // path under public/, e.g. 'archive/pubquiz.webp'
  alt: Localized
  caption?: Localized
}

export const kindLabels: Record<PastEventKind, Localized> = {
  paper: { en: 'Paper discussion', de: 'Paper-Diskussion' },
  talk: { en: 'Talk', de: 'Vortrag' },
  social: { en: 'Social', de: 'Social' },
  other: { en: 'Event', de: 'Event' },
}

export const pastEvents: PastEvent[] = [
  { date: '2026-07-27', kind: 'social', title: 'Summer social at Neckawa!' },
  { date: '2026-07-20', kind: 'paper', title: 'AI Welfare: Is it bullshit or should we take it seriously?', by: 'Jeanne Salle' },
  { date: '2026-07-13', kind: 'talk', title: 'AI Control: Overview and ResearchArena paper', by: 'Lena Libon' },
  { date: '2026-06-29', kind: 'social', title: 'AI Safety Pubquiz' },
  { date: '2026-06-22', kind: 'talk', title: 'Models That Know How Evaluations Are Designed Score Safer', by: 'Katharina Deckenbach' },
  { date: '2026-06-15', kind: 'paper', title: 'Europe2031 – What getting AI wrong means for us' },
  { date: '2026-06-08', kind: 'talk', title: 'Unlearning as an Asymmetric Generalization Problem', by: 'Amit Peleg' },
  { date: '2026-05-26', kind: 'social', title: 'Watchparty – The AI Doc: Or how I became an Apocaloptimist' },
  { date: '2026-05-21', kind: 'other', title: 'MATS Q&A with three recent MATS alumni' },
  { date: '2026-05-11', kind: 'talk', title: 'Claudini: Autoresearch Discovers State-of-the-Art Adversarial Attack Algorithms for LLMs', by: 'Alexander Panfilov' },
  { date: '2026-05-04', kind: 'social', title: 'AI Calibration Game' },
  { date: '2026-04-27', kind: 'paper', title: 'Claude Mythos System Card' },
  { date: '2026-04-13', kind: 'talk', title: 'Compute Governance', by: 'Yannick Mühlhäuser (FLI)' },
  { date: '2026-03-30', kind: 'paper', title: 'Legal Alignment for Safe and Ethical AI', by: 'Kolt et al. (2026)', links: [{ label: 'arXiv', href: 'https://arxiv.org/pdf/2601.04175' }] },
  { date: '2026-03-23', kind: 'paper', title: 'The Artificial Self: Characterising the landscape of AI identity', by: 'Douglas et al. (2026)' },
  { date: '2026-03-16', kind: 'talk', title: 'AI Personas', by: 'Daniel Tan' },
  // The old page links two papers here; both are kept until someone checks which one was discussed.
  { date: '2026-03-09', kind: 'paper', title: 'Who’s in Charge? Disempowerment Patterns in Real-World LLM Usage', by: 'Sharma et al. (2026)', links: [{ label: 'arXiv 2510.04340', href: 'https://arxiv.org/pdf/2510.04340' }, { label: 'arXiv 2601.19062', href: 'https://arxiv.org/pdf/2601.19062' }] },
  { date: '2026-03-02', kind: 'talk', title: 'From Machine Psychology to AI Safety: Studying Deception, Emergent Misalignment, and Self-Awareness in LLMs', by: 'Thilo Hagendorff (Group Leader at University of Stuttgart)' },
  { date: '2026-02-23', kind: 'social', title: 'Speed-Friending & What are you working on?' },
  { date: '2026-02-16', kind: 'social', title: 'Casual Dinner @ Irish Pub Tübingen' },
  { date: '2026-02-09', kind: 'talk', title: 'SKILL-INJECT: Measuring Agent Vulnerability to Skill File Attacks', by: 'David Schmotz' },
  { date: '2026-02-02', kind: 'talk', title: 'Measuring and Forecasting Autonomous Capabilities', by: 'Jeanne Salle', links: [{ label: 'METR blog post', href: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/' }] },
  { date: '2026-01-26', kind: 'paper', title: 'Alignment Pretraining: AI Discourse Causes Self-Fulfilling (Mis)alignment', links: [{ label: 'alignmentpretraining.ai', href: 'https://alignmentpretraining.ai/' }] },
  { date: '2026-01-19', kind: 'paper', title: 'Spilling the beans – Teaching LLMs to Self-Report Their Hidden Objectives, and its predecessor: Teaching Models to Verbalize Reward Hacking in Chain-of-Thought Reasoning', links: [{ label: 'arXiv 2511.06626', href: 'https://arxiv.org/abs/2511.06626v2' }, { label: 'arXiv 2506.22777', href: 'https://arxiv.org/abs/2506.22777' }] },
  { date: '2026-01-12', kind: 'paper', title: 'Activation Oracles: Training and Evaluating LLMs as General-Purpose Activation Explainers', links: [{ label: 'Anthropic', href: 'https://alignment.anthropic.com/2025/activation-oracles/' }] },
  { date: '2025-12-15', kind: 'talk', title: 'Intro to Scalable Oversight', by: 'Ameya Prabhu (Bethgelab)' },
  { date: '2025-12-01', kind: 'paper', title: 'Quick introduction + Natural Emergent Misalignment in Production RL (Anthropic)', links: [{ label: 'Anthropic', href: 'https://www.anthropic.com/research/emergent-misalignment-reward-hacking' }] },
]

// Add event photos to public/archive/ and list them here; the section appears once there is one.
export const photos: Photo[] = []
