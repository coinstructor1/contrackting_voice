export interface ModelOption {
  id: string
  label: string
  description: string
  tier: 'best' | 'balanced' | 'mini'
}

export const OPENAI_REALTIME_MODELS: ModelOption[] = [
  {
    id: 'gpt-realtime-1.5',
    label: 'GPT Realtime 1.5',
    description: 'Beste Qualität, höchste Kosten',
    tier: 'best',
  },
  {
    id: 'gpt-4o-realtime-preview',
    label: 'GPT-4o Realtime',
    description: 'Ausgewogen – Qualität & Kosten',
    tier: 'balanced',
  },
  {
    id: 'gpt-realtime-mini',
    label: 'GPT Realtime Mini',
    description: 'Günstig, für schnelle Tests',
    tier: 'mini',
  },
  {
    id: 'gpt-4o-mini-realtime-preview',
    label: 'GPT-4o Mini Realtime',
    description: 'Kostengünstig, gute Latenz',
    tier: 'mini',
  },
]

export const DEFAULT_MODEL = 'gpt-4o-realtime-preview'

const TIER_COLORS: Record<ModelOption['tier'], string> = {
  best:     '★',
  balanced: '◆',
  mini:     '◇',
}

export function tierIcon(tier: ModelOption['tier']) {
  return TIER_COLORS[tier]
}
