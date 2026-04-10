'use client'

import type { Provider } from '@/lib/supabase'

interface ProviderSelectorProps {
  value: Provider
  onChange: (provider: Provider) => void
  disabled?: boolean
}

export default function ProviderSelector({ value, onChange, disabled }: ProviderSelectorProps) {
  return (
    <div className="flex rounded-lg border border-ct-border overflow-hidden">
      {(['openai', 'elevenlabs'] as Provider[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            value === p
              ? 'bg-ct-primary text-white'
              : 'bg-ct-dark text-ct-secondary hover:text-white hover:bg-ct-teal'
          }`}
        >
          {p === 'openai' ? 'OpenAI' : 'ElevenLabs'}
        </button>
      ))}
    </div>
  )
}
