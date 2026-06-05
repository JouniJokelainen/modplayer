interface Props {
  tracks: string[]
  creator: string
  currentUrl: string | null
  onPlay: (name: string) => void
}

export function TrackList({ tracks, creator, currentUrl, onPlay }: Props) {
  if (tracks.length === 0) {
    return <p className="text-retro-muted text-xs uppercase px-2 py-2">NO TRACKS FOUND.</p>
  }

  return (
    <ul>
      {tracks.map((name) => {
        const url = `/modland/pub/modules/Protracker/${encodeURIComponent(creator)}/${encodeURIComponent(name)}`
        const active = currentUrl === url
        return (
          <li key={name} className={`border-b border-retro-border ${active ? 'bg-retro-active' : 'bg-black/70'}`}>
            <button
              onClick={() => onPlay(name)}
              className={`w-full text-left px-2 py-1.5 font-mono text-xs uppercase tracking-wide flex items-center gap-2 transition-colors ${
                active
                  ? 'text-retro-accent font-bold'
                  : 'text-retro-text hover:text-retro-accent hover:bg-[#0a2a0a]'
              }`}
            >
              <span className={`w-3 shrink-0 font-bold ${active ? 'text-retro-accent' : 'text-retro-dark'}`}>
                {active ? '>' : ''}
              </span>
              {name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
