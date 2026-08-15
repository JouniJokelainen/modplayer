import { Track } from '../store/playback'
import { DownloadLink } from './DownloadLink'

export type FavView = 'songs' | 'artists'

interface Props {
  view: FavView
  onSetView: (view: FavView) => void
  favourites: Track[]
  favouriteArtists: string[]
  onPlaySong: (track: Track) => void
  onRemoveSong: (track: Track) => void
  onSelectArtist: (artist: string) => void
  onRemoveArtist: (artist: string) => void
}

export function FavouritesPanel({
  view,
  onSetView,
  favourites,
  favouriteArtists,
  onPlaySong,
  onRemoveSong,
  onSelectArtist,
  onRemoveArtist,
}: Props) {
  return (
    <div className="border border-retro-border bg-retro-dark">
      {/* Header with a Songs / Artists segmented toggle */}
      <div className="flex items-stretch border-b border-retro-border bg-retro-panel">
        <span className="flex-1 px-2 py-1 self-center text-retro-text text-xs uppercase tracking-widest">
          FAVOURITES
        </span>
        {(['songs', 'artists'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onSetView(v)}
            className={`shrink-0 px-2 py-1 text-xs uppercase tracking-wide border-l border-retro-border transition-colors ${
              view === v
                ? 'bg-retro-active text-retro-accent font-bold'
                : 'text-retro-muted hover:text-retro-accent'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'songs' ? (
        favourites.length === 0 ? (
          <p className="text-retro-muted text-xs uppercase px-2 py-2">NO FAVOURITE SONGS YET.</p>
        ) : (
          <ul>
            {favourites.map((track, i) => (
              <li key={track.url} className={i < favourites.length - 1 ? 'border-b border-retro-border' : ''}>
                <div className="flex items-center group">
                  <button
                    onClick={() => onPlaySong(track)}
                    className="flex-1 min-w-0 text-left px-2 py-1.5 hover:bg-[#0a2a0a]"
                  >
                    <p className="text-retro-cyan text-xs uppercase truncate font-mono group-hover:text-retro-accent">
                      {track.name}
                    </p>
                    <p className="text-retro-muted text-xs uppercase truncate font-mono">{track.creator}</p>
                  </button>
                  <DownloadLink url={track.url} name={track.name} />
                  <button
                    onClick={() => onRemoveSong(track)}
                    title="Remove from favourites"
                    className="shrink-0 px-2 self-stretch text-sm text-retro-accent hover:text-retro-text"
                  >
                    ★
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : favouriteArtists.length === 0 ? (
        <p className="text-retro-muted text-xs uppercase px-2 py-2">NO FAVOURITE ARTISTS YET.</p>
      ) : (
        <ul>
          {favouriteArtists.map((artist, i) => (
            <li key={artist} className={i < favouriteArtists.length - 1 ? 'border-b border-retro-border' : ''}>
              <div className="flex items-center group">
                <button
                  onClick={() => onSelectArtist(artist)}
                  title="Show this artist's tracks"
                  className="flex-1 min-w-0 text-left px-2 py-1.5 hover:bg-[#0a2a0a]"
                >
                  <p className="text-retro-cyan text-xs uppercase truncate font-mono group-hover:text-retro-accent">
                    {artist}
                  </p>
                </button>
                <button
                  onClick={() => onRemoveArtist(artist)}
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
