import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 bg-ct-hero">
      <div className="max-w-xl w-full space-y-10 text-center">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ct-label">
            Internal Testing Tool
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Coin<span className="text-ct-primary">Tracking</span> Voice Agent
          </h1>
          <p className="text-ct-secondary">
            AI-gestützter Sales Agent zum Testen und Vergleichen von Voice-Providern.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/call"
            className="flex flex-col gap-2 rounded-xl border border-ct-border bg-ct-dark p-6 text-left hover:border-ct-primary transition-all"
          >
            <span className="text-2xl">🎙️</span>
            <span className="font-medium text-white">Neuer Call</span>
            <span className="text-sm text-ct-secondary">
              Provider wählen und Gespräch starten.
            </span>
          </Link>

          <Link
            href="/config"
            className="flex flex-col gap-2 rounded-xl border border-ct-border bg-ct-dark p-6 text-left hover:border-ct-primary transition-all"
          >
            <span className="text-2xl">⚙️</span>
            <span className="font-medium text-white">Config</span>
            <span className="text-sm text-ct-secondary">
              System Prompt und RAG-Inhalte bearbeiten.
            </span>
          </Link>

          <Link
            href="/history"
            className="flex flex-col gap-2 rounded-xl border border-ct-border bg-ct-dark p-6 text-left hover:border-ct-primary transition-all"
          >
            <span className="text-2xl">📋</span>
            <span className="font-medium text-white">History</span>
            <span className="text-sm text-ct-secondary">
              Vergangene Sessions und Bewertungen.
            </span>
          </Link>
        </div>

        <Link
          href="/call"
          className="inline-block bg-ct-primary hover:bg-ct-primary-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Call starten
        </Link>
      </div>
    </div>
  );
}
