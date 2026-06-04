import { Play } from 'lucide-react'

interface Props {
  tracks: string[]
  creator: string
  currentUrl: string | null
  onPlay: (name: string) => void
}

export function TrackList({ tracks, creator, currentUrl, onPlay }: Props) {
  if (tracks.length === 0) return <p className="text-zinc-500 text-sm">No tracks found.</p>

  return (
    <ul className="space-y-1">
      {tracks.map((name) => {
        const url = `/modland/pub/modules/Protracker/${encodeURIComponent(creator)}/${encodeURIComponent(name)}`
        const active = currentUrl === url
        return (
          <li key={name}>
            <button
              onClick={() => onPlay(name)}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors ${
                active
                  ? 'bg-zinc-600 text-white'
                  : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <Play size={12} className="shrink-0" />
              {name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
