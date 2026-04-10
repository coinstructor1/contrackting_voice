'use client'

import { useEffect, useRef } from 'react'
import type { TranscriptRole } from '@/lib/supabase'

export interface TranscriptMessage {
  id: string
  role: TranscriptRole
  content: string
  timestamp: Date
}

interface TranscriptViewProps {
  messages: TranscriptMessage[]
}

export default function TranscriptView({ messages }: TranscriptViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-ct-secondary text-sm">
        Transkript erscheint hier während des Gesprächs...
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-ct-label mt-1 w-12 text-center">
            {msg.role === 'agent' ? 'Agent' : 'User'}
          </span>
          <div
            className={`rounded-xl px-4 py-2.5 text-sm max-w-[80%] ${
              msg.role === 'agent'
                ? 'bg-ct-teal text-white'
                : 'bg-ct-border text-white'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
