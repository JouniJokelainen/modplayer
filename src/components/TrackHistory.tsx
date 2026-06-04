import { Track } from '../store/playback'

interface Props {
  history: Track[]
  onPlay: (track: Track) => void
}

export function TrackHistory({ history, onPlay }: Props) {
  if (history.length === 0) return null

  return (
    <div>
      <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Recently played</h2>
      <ul className="space-y-1">
        {history.map((track) => (
          <li key={track.url}>
            <button
              onClick={() => onPlay(track)}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 transition-colors"
            >
              <p className="text-zinc-300 text-sm truncate">{track.name}</p>
              <p className="text-zinc-500 text-xs truncate">{track.creator}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
