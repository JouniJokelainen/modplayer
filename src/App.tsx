import { useState, useCallback, useEffect } from 'react'
import { useCreators, useTracks, TrackEntry } from './hooks/useModland'
import { usePlaybackStore, Track } from './store/playback'
import { loadMod, play, pause, isPlaying as engineIsPlaying, setVolume as engineSetVolume } from './audio/audioEngine'
import { SearchBar } from './components/SearchBar'
import { TrackList } from './components/TrackList'
import { Player } from './components/Player'
import { TrackHistory } from './components/TrackHistory'
import { FavouritesPanel, FavView, ImportStatus } from './components/FavouritesPanel'
import { SpectrumBars } from './components/SpectrumBars'
import { VolumeSlider } from './components/VolumeSlider'
import { Backdrop } from './components/Backdrop'
import { LoadFile } from './components/LoadFile'
import { MAX_FAVOURITES, MAX_FAVOURITE_ARTISTS } from './store/playback'
import { exportFavourites, parseFavouritesFile } from './favouritesFile'

export default function App() {
  const [creatorSearch, setCreatorSearch] = useState('')
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [trackSearch, setTrackSearch] = useState('')
  const [favView, setFavView] = useState<FavView>('songs')

  const {
    currentTrack, isPlaying, history, favourites, favouriteArtists, volume,
    setCurrentTrack, setIsPlaying, toggleFavourite, toggleFavouriteArtist, importFavourites, setVolume,
  } = usePlaybackStore()

  // Keep the audio engine's gain in sync with the stored volume.
  useEffect(() => {
    engineSetVolume(volume)
  }, [volume])

  const { data: creators = [], isLoading: loadingCreators } = useCreators()
  const { data: tracks = [], isLoading: loadingTracks } = useTracks(selectedCreator)

  const filteredCreators = creators.filter((c) =>
    c.toLowerCase().includes(creatorSearch.toLowerCase())
  )
  const filteredTracks = tracks.filter((t) =>
    t.name.toLowerCase().includes(trackSearch.toLowerCase())
  )

  const handlePlayTrack = useCallback(async (entry: TrackEntry) => {
    if (!selectedCreator) return
    const track: Track = { creator: selectedCreator, name: entry.name, url: entry.url }
    try {
      await loadMod(entry.url)
      setCurrentTrack(track)
      play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to load track', err)
    }
  }, [selectedCreator, setCurrentTrack, setIsPlaying])

  const favouriteUrls = new Set(favourites.map((f) => f.url))
  const favouriteArtistSet = new Set(favouriteArtists)
  const artistFavouritesFull = favouriteArtists.length >= MAX_FAVOURITE_ARTISTS

  const handleToggleFavourite = useCallback((entry: TrackEntry) => {
    if (!selectedCreator) return
    toggleFavourite({ creator: selectedCreator, name: entry.name, url: entry.url })
  }, [selectedCreator, toggleFavourite])

  // Selecting a favourited artist opens their track list in the main pane.
  const handleSelectFavouriteArtist = useCallback((artist: string) => {
    setSelectedCreator(artist)
    setTrackSearch('')
  }, [])

  const handlePlayFromHistory = useCallback(async (track: Track) => {
    try {
      await loadMod(track.url)
      setCurrentTrack(track)
      play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to load track', err)
    }
  }, [setCurrentTrack, setIsPlaying])

  const handleExportFavourites = useCallback(() => {
    exportFavourites(favourites, favouriteArtists)
  }, [favourites, favouriteArtists])

  const handleImportFavourites = useCallback(
    async (file: File): Promise<ImportStatus> => {
      try {
        const { songs, artists } = parseFavouritesFile(await file.text())
        const { addedSongs, addedArtists, skipped } = importFavourites(songs, artists)
        if (addedSongs === 0 && addedArtists === 0) {
          return skipped > 0
            ? { tone: 'warn', message: 'NOTHING ADDED (DUPLICATES OR FULL)' }
            : { tone: 'warn', message: 'NO FAVOURITES IN FILE' }
        }
        const parts: string[] = []
        if (addedSongs > 0) parts.push(`${addedSongs} SONG${addedSongs === 1 ? '' : 'S'}`)
        if (addedArtists > 0) parts.push(`${addedArtists} ARTIST${addedArtists === 1 ? '' : 'S'}`)
        const suffix = skipped > 0 ? ` (${skipped} SKIPPED)` : ''
        return { tone: skipped > 0 ? 'warn' : 'ok', message: `IMPORTED ${parts.join(', ')}${suffix}` }
      } catch (err) {
        return { tone: 'error', message: err instanceof Error ? err.message : 'IMPORT FAILED' }
      }
    },
    [importFavourites]
  )

  // Local files play from a blob URL, so the engine's fetch path works unchanged.
  const handleLoadLocalFile = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file)
    const track: Track = { creator: 'LOCAL FILE', name: file.name, url }
    try {
      await loadMod(url)
      setCurrentTrack(track)
      play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to load track', err)
    }
  }, [setCurrentTrack, setIsPlaying])

  const handleToggle = useCallback(() => {
    if (engineIsPlaying()) {
      pause()
      setIsPlaying(false)
    } else {
      play()
      setIsPlaying(true)
    }
  }, [setIsPlaying])

  return (
    <div className="h-screen bg-retro-bg text-retro-text font-mono flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-retro-accent bg-retro-panel px-3 py-2 flex items-center gap-4 shrink-0 overflow-hidden">
        <span className="text-retro-accent uppercase tracking-widest font-bold shrink-0" style={{ fontSize: '24px' }}>
          MODPLAYER
        </span>
        <LoadFile onLoad={handleLoadLocalFile} />
        {currentTrack && (
          <div className="marquee flex-1 overflow-hidden">
            <span
              className="marquee-text uppercase tracking-widest font-bold"
              style={{ fontSize: '24px', animationPlayState: isPlaying ? 'running' : 'paused' }}
            >
              {currentTrack.creator} — {currentTrack.name}
            </span>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Creator sidebar */}
        <aside className="w-56 border-r border-retro-border flex flex-col overflow-hidden bg-retro-panel shrink-0">
          <div className="px-2 py-1 border-b border-retro-border">
            <span className="text-retro-text text-xs uppercase tracking-widest">ARTISTS</span>
          </div>
          <div className="p-2 border-b border-retro-border">
            <SearchBar
              value={creatorSearch}
              onChange={setCreatorSearch}
              placeholder="Filter artists..."
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingCreators && (
              <p className="text-retro-muted text-xs uppercase px-2 py-2">LOADING...</p>
            )}
            <ul>
              {filteredCreators.map((creator) => {
                const active = selectedCreator === creator
                const favArtist = favouriteArtistSet.has(creator)
                const lockedOut = !favArtist && artistFavouritesFull
                return (
                  <li key={creator} className={`border-b border-retro-border ${active ? 'bg-retro-active' : ''}`}>
                    <div className="flex items-center">
                      <button
                        onClick={() => { setSelectedCreator(creator); setTrackSearch('') }}
                        className={`flex-1 min-w-0 text-left px-2 py-1.5 text-xs uppercase tracking-wide font-mono flex items-center gap-1.5 transition-colors ${
                          active
                            ? 'text-retro-accent font-bold'
                            : 'text-retro-text hover:text-retro-accent hover:bg-[#0a2a0a]'
                        }`}
                      >
                        <span className="w-3 shrink-0 font-bold">{active ? '>' : ''}</span>
                        <span className="truncate">{creator}</span>
                      </button>
                      <button
                        onClick={() => toggleFavouriteArtist(creator)}
                        disabled={lockedOut}
                        title={
                          favArtist
                            ? 'Remove artist from favourites'
                            : lockedOut
                            ? `Favourite artists full (max ${MAX_FAVOURITE_ARTISTS})`
                            : 'Add artist to favourites'
                        }
                        className={`shrink-0 px-2 py-1.5 text-sm transition-colors ${
                          favArtist
                            ? 'text-retro-accent hover:text-retro-text'
                            : lockedOut
                            ? 'text-retro-border cursor-not-allowed'
                            : 'text-retro-muted hover:text-retro-accent'
                        }`}
                      >
                        {favArtist ? '★' : '☆'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          {!loadingCreators && (
            <div className="px-2 py-1 border-t border-retro-border bg-retro-dark">
              <span className="text-retro-muted text-xs uppercase">
                {filteredCreators.length} ARTISTS
              </span>
            </div>
          )}
        </aside>

        {/* Track list */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-2 py-1 border-b border-retro-border bg-retro-panel flex items-center justify-between shrink-0">
            <span className="text-retro-text text-xs uppercase tracking-widest">
              {selectedCreator ? `TRACKS / ${selectedCreator.toUpperCase()}` : 'TRACKS'}
            </span>
            {!loadingTracks && selectedCreator && (
              <span className="text-retro-muted text-xs uppercase">{filteredTracks.length} FILES</span>
            )}
          </div>
          {selectedCreator ? (
            <>
              <div className="p-2 border-b border-retro-border bg-retro-panel shrink-0">
                <SearchBar
                  value={trackSearch}
                  onChange={setTrackSearch}
                  placeholder="Filter tracks..."
                />
              </div>
              <Backdrop>
                <div className="flex-1 overflow-y-auto">
                  {loadingTracks ? (
                    <p className="text-retro-muted text-xs uppercase px-2 py-2">LOADING TRACKS...</p>
                  ) : (
                    <TrackList
                      tracks={filteredTracks}
                      currentUrl={currentTrack?.url ?? null}
                      favouriteUrls={favouriteUrls}
                      favouritesFull={favourites.length >= MAX_FAVOURITES}
                      onPlay={handlePlayTrack}
                      onToggleFavourite={handleToggleFavourite}
                    />
                  )}
                </div>
                <SpectrumBars />
              </Backdrop>
            </>
          ) : (
            <Backdrop>
              <div className="flex-1" />
              <SpectrumBars />
            </Backdrop>
          )}
        </main>

        {/* Right panel */}
        <aside className="w-64 border-l border-retro-border flex flex-col gap-0 bg-retro-panel shrink-0">
          <div className="p-2 border-b border-retro-border">
            <Player track={currentTrack} isPlaying={isPlaying} onToggle={handleToggle} />
          </div>
          {/* Scrolls when the lists outgrow a short screen, so nothing is
              unreachable on a laptop. The bottom padding keeps the last row clear
              of the volume slider floating over this corner. */}
          <div className="flex-1 min-h-0 overflow-y-auto pb-14">
            <div className="p-2">
              <TrackHistory
                history={history}
                favouriteUrls={favouriteUrls}
                favouritesFull={favourites.length >= MAX_FAVOURITES}
                onPlay={handlePlayFromHistory}
                onToggleFavourite={toggleFavourite}
              />
            </div>
            <div className="px-2 pb-2">
              <FavouritesPanel
                view={favView}
                onSetView={setFavView}
                favourites={favourites}
                favouriteArtists={favouriteArtists}
                onPlaySong={handlePlayFromHistory}
                onRemoveSong={toggleFavourite}
                onSelectArtist={handleSelectFavouriteArtist}
                onRemoveArtist={toggleFavouriteArtist}
                onExport={handleExportFavourites}
                onImport={handleImportFavourites}
              />
            </div>
          </div>
        </aside>
      </div>

      <VolumeSlider volume={volume} onChange={setVolume} />
    </div>
  )
}
