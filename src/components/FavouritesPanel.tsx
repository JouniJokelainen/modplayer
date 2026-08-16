import { useEffect, useRef, useState } from 'react'
import { Track } from '../store/playback'
import { DownloadLink } from './DownloadLink'

export type FavView = 'songs' | 'artists'

export interface ImportStatus {
  tone: 'ok' | 'warn' | 'error'
  message: string
}

interface Props {
  view: FavView
  onSetView: (view: FavView) => void
  favourites: Track[]
  favouriteArtists: string[]
  onPlaySong: (track: Track) => void
  onRemoveSong: (track: Track) => void
  onSelectArtist: (artist: string) => void
  onRemoveArtist: (artist: string) => void
  onExport: () => void
  onImport: (file: File) => Promise<ImportStatus>
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
  onExport,
  onImport,
}: Props) {
  const [status, setStatus] = useState<ImportStatus | null>(null)
  const clearTimer = useRef<ReturnType<typeof setTimeout>>()

  // Show an import result briefly, then fade it out. A single shared timer is
  // reset on each new result so rapid imports don't leave a stale message.
  const flashStatus = (s: ImportStatus) => {
    setStatus(s)
    clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => setStatus(null), 4000)
  }
  useEffect(() => () => clearTimeout(clearTimer.current), [])

  const isEmpty = favourites.length === 0 && favouriteArtists.length === 0

  return (
    <div className="border border-retro-border bg-retro-dark">
      {/* Header with export/import actions and a Songs / Artists segmented toggle */}
      <div className="flex items-stretch border-b border-retro-border bg-retro-panel">
        <span className="flex-1 min-w-0 truncate px-2 py-1 self-center text-retro-text text-xs uppercase tracking-normal">
          FAVOURITES
        </span>
        <button
          onClick={onExport}
          disabled={isEmpty}
          title={isEmpty ? 'No favourites to export' : 'Export favourites to a file'}
          className={`shrink-0 px-1 self-center text-sm transition-colors ${
            isEmpty ? 'text-retro-border cursor-not-allowed' : 'text-retro-muted hover:text-retro-accent'
          }`}
        >
          ⤓
        </button>
        <label
          title="Import favourites from a file"
          className="shrink-0 px-1 self-center text-sm text-retro-muted hover:text-retro-accent cursor-pointer transition-colors"
        >
          ⤒
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              // Reset so re-picking the same file re-triggers onChange.
              e.target.value = ''
              if (file) flashStatus(await onImport(file))
            }}
          />
        </label>
        {(['songs', 'artists'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onSetView(v)}
            className={`shrink-0 px-1.5 py-1 text-xs uppercase tracking-normal border-l border-retro-border transition-colors ${
              view === v
                ? 'bg-retro-active text-retro-accent font-bold'
                : 'text-retro-muted hover:text-retro-accent'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Transient feedback after an import (auto-clears). */}
      {status && (
        <p
          className={`text-xs uppercase px-2 py-1 border-b border-retro-border truncate ${
            status.tone === 'error'
              ? 'text-red-400'
              : status.tone === 'warn'
              ? 'text-retro-muted'
              : 'text-retro-accent'
          }`}
        >
          {status.message}
        </p>
      )}

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
