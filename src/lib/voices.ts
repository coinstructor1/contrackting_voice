export interface VoiceOption {
  id: string
  label: string
  gender: 'männlich' | 'weiblich' | 'neutral'
  description: string
}

export const OPENAI_VOICES: VoiceOption[] = [
  { id: 'echo',    label: 'Echo',    gender: 'männlich', description: 'Klar, professionell' },
  { id: 'onyx',    label: 'Onyx',    gender: 'männlich', description: 'Tief, ruhig' },
  { id: 'fable',   label: 'Fable',   gender: 'männlich', description: 'Warm, erzählerisch' },
  { id: 'ash',     label: 'Ash',     gender: 'männlich', description: 'Direkt, prägnant' },
  { id: 'verse',   label: 'Verse',   gender: 'männlich', description: 'Ausdrucksstark' },
  { id: 'nova',    label: 'Nova',    gender: 'weiblich', description: 'Energetisch, freundlich' },
  { id: 'shimmer', label: 'Shimmer', gender: 'weiblich', description: 'Sanft, einladend' },
  { id: 'coral',   label: 'Coral',   gender: 'weiblich', description: 'Lebendig, jugendlich' },
  { id: 'sage',    label: 'Sage',    gender: 'weiblich', description: 'Ruhig, kompetent' },
  { id: 'alloy',   label: 'Alloy',   gender: 'neutral',  description: 'Ausgewogen, vielseitig' },
  { id: 'ballad',  label: 'Ballad',  gender: 'neutral',  description: 'Melodisch, fließend' },
]

export const DEFAULT_VOICE = 'echo'
export const DEFAULT_AGENT_NAME = 'Luca'
