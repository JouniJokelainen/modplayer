import { Track } from '../store/playback'
import { DownloadLink } from './DownloadLink'

interface Props {
  favourites: Track[]
  onPlay: (track: Track) => void
  onRemove: (track: Track) => void
}

export function Favourites({ favourites, onPlay, onRemove }: Props) {
  return (
    <div className="border border-retro-border bg-retro-dark">
      <div className="px-2 py-1 border-b border-retro-border bg-retro-panel">
        <span className="text-retro-text text-xs uppercase tracking-widest">FAVOURITES</span>
      </div>
      {favourites.length === 0 ? (
        <p className="text-retro-muted text-xs uppercase px-2 py-2">NO FAVOURITES YET.</p>
      ) : (
        <ul>
          {favourites.map((track, i) => (
            <li key={track.url} className={i < favourites.length - 1 ? 'border-b border-retro-border' : ''}>
              <div className="flex items-center group">
                <button
                  onClick={() => onPlay(track)}
                  className="flex-1 min-w-0 text-left px-2 py-1.5 hover:bg-[#0a2a0a]"
                >
                  <p className="text-retro-cyan text-xs uppercase truncate font-mono group-hover:text-retro-accent">
                    {track.name}
                  </p>
                  <p className="text-retro-muted text-xs uppercase truncate font-mono">{track.creator}</p>
                </button>
                <DownloadLink url={track.url} name={track.name} />
                <button
                  onClick={() => onRemove(track)}
                  title="Remove from favourites"
                  className="shrink-0 px-2 self-stretch text-sm text-retro-accent hover:text-retro-text"
                >
                  ★
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
