'use client'

interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      <span className="mt-0.5 shrink-0">⚠️</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-red-400 hover:text-red-200 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
