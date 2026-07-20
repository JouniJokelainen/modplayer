import { DownloadLink } from './DownloadLink'
import { trackUrl } from '../modland'

interface Props {
  tracks: string[]
  creator: string
  currentUrl: string | null
  favouriteUrls: Set<string>
  favouritesFull: boolean
  onPlay: (name: string) => void
  onToggleFavourite: (name: string) => void
}

export function TrackList({
  tracks,
  creator,
  currentUrl,
  favouriteUrls,
  favouritesFull,
  onPlay,
  onToggleFavourite,
}: Props) {
  if (tracks.length === 0) {
    return <p className="text-retro-muted text-xs uppercase px-2 py-2">NO TRACKS FOUND.</p>
  }

  return (
    <ul>
      {tracks.map((name) => {
        const url = trackUrl(creator, name)
        const active = currentUrl === url
        const fav = favouriteUrls.has(url)
        const lockedOut = !fav && favouritesFull
        return (
          <li key={name} className={`border-b border-retro-border ${active ? 'bg-retro-active' : 'bg-black/70'}`}>
            <div className="flex items-center">
              <button
                onClick={() => onPlay(name)}
                className={`flex-1 min-w-0 text-left px-2 py-1.5 font-mono text-xs uppercase tracking-wide flex items-center gap-2 transition-colors ${
                  active
                    ? 'text-retro-accent font-bold'
                    : 'text-retro-text hover:text-retro-accent hover:bg-[#0a2a0a]'
                }`}
              >
                <span className={`w-3 shrink-0 font-bold ${active ? 'text-retro-accent' : 'text-retro-dark'}`}>
                  {active ? '>' : ''}
                </span>
                <span className="truncate">{name}</span>
              </button>
              <DownloadLink url={url} name={name} />
              <button
                onClick={() => onToggleFavourite(name)}
                disabled={lockedOut}
                title={
                  fav
                    ? 'Remove from favourites'
                    : lockedOut
                    ? 'Favourites full (max 5)'
                    : 'Add to favourites'
                }
                className={`shrink-0 px-2 py-1.5 text-sm transition-colors ${
                  fav
                    ? 'text-retro-accent hover:text-retro-text'
                    : lockedOut
                    ? 'text-retro-border cursor-not-allowed'
                    : 'text-retro-muted hover:text-retro-accent'
                }`}
              >
                {fav ? '★' : '☆'}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
