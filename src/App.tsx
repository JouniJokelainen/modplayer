import { useState, useCallback } from 'react'
import { useCreators, useTracks } from './hooks/useModland'
import { usePlaybackStore, Track } from './store/playback'
import { loadMod, play, pause, isPlaying as engineIsPlaying } from './audio/audioEngine'
import { SearchBar } from './components/SearchBar'
import { TrackList } from './components/TrackList'
import { Player } from './components/Player'
import { TrackHistory } from './components/TrackHistory'

export default function App() {
  const [creatorSearch, setCreatorSearch] = useState('')
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [trackSearch, setTrackSearch] = useState('')

  const { currentTrack, isPlaying, history, setCurrentTrack, setIsPlaying } = usePlaybackStore()

  const { data: creators = [], isLoading: loadingCreators } = useCreators()
  const { data: tracks = [], isLoading: loadingTracks } = useTracks(selectedCreator)

  const filteredCreators = creators.filter((c) =>
    c.toLowerCase().includes(creatorSearch.toLowerCase())
  )
  const filteredTracks = tracks.filter((t) =>
    t.toLowerCase().includes(trackSearch.toLowerCase())
  )

  const handlePlayTrack = useCallback(async (name: string) => {
    if (!selectedCreator) return
    const url = `/modland/pub/modules/Protracker/${encodeURIComponent(selectedCreator)}/${encodeURIComponent(name)}`
    const track: Track = { creator: selectedCreator, name, url }
    try {
      await loadMod(url)
      setCurrentTrack(track)
      play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to load track', err)
    }
  }, [selectedCreator, setCurrentTrack, setIsPlaying])

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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Modplayer</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Creator list */}
        <aside className="w-64 border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-zinc-800">
            <SearchBar
              value={creatorSearch}
              onChange={setCreatorSearch}
              placeholder="Search creators..."
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loadingCreators && <p className="text-zinc-500 text-sm p-2">Loading...</p>}
            <ul className="space-y-0.5">
              {filteredCreators.map((creator) => (
                <li key={creator}>
                  <button
                    onClick={() => {
                      setSelectedCreator(creator)
                      setTrackSearch('')
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedCreator === creator
                        ? 'bg-zinc-700 text-white'
                        : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {creator}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Track list */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedCreator ? (
            <>
              <div className="p-3 border-b border-zinc-800">
                <SearchBar
                  value={trackSearch}
                  onChange={setTrackSearch}
                  placeholder="Search tracks..."
                />
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {loadingTracks ? (
                  <p className="text-zinc-500 text-sm">Loading tracks...</p>
                ) : (
                  <TrackList
                    tracks={filteredTracks}
                    creator={selectedCreator}
                    currentUrl={currentTrack?.url ?? null}
                    onPlay={handlePlayTrack}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              Select a creator
            </div>
          )}
        </main>

        {/* Right sidebar: player + history */}
        <aside className="w-72 border-l border-zinc-800 flex flex-col p-4 gap-4">
          <Player track={currentTrack} isPlaying={isPlaying} onToggle={handleToggle} />
          <TrackHistory history={history} onPlay={handlePlayFromHistory} />
        </aside>
      </div>
    </div>
  )
}
