import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
  creator: string
  name: string
  url: string
}

export const MAX_FAVOURITES = 5

interface PlaybackState {
  currentTrack: Track | null
  isPlaying: boolean
  history: Track[]
  favourites: Track[]
  setCurrentTrack: (track: Track) => void
  setIsPlaying: (playing: boolean) => void
  toggleFavourite: (track: Track) => void
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      history: [],
      favourites: [],
      setCurrentTrack: (track) =>
        set((state) => ({
          currentTrack: track,
          history: [track, ...state.history.filter((t) => t.url !== track.url)].slice(0, 3),
        })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      toggleFavourite: (track) =>
        set((state) => {
          const exists = state.favourites.some((f) => f.url === track.url)
          if (exists) {
            return { favourites: state.favourites.filter((f) => f.url !== track.url) }
          }
          // Cap at MAX_FAVOURITES; ignore further additions once full.
          if (state.favourites.length >= MAX_FAVOURITES) return state
          return { favourites: [...state.favourites, track] }
        }),
    }),
    {
      name: 'modplayer-favourites',
      // Persist only favourites; playback state stays fresh on each load.
      partialize: (state) => ({ favourites: state.favourites }),
    }
  )
)
