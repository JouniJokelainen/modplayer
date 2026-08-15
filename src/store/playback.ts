import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
  creator: string
  name: string
  url: string
}

export const MAX_FAVOURITES = 7
export const MAX_FAVOURITE_ARTISTS = 7

interface PlaybackState {
  currentTrack: Track | null
  isPlaying: boolean
  history: Track[]
  favourites: Track[]
  favouriteArtists: string[]
  volume: number
  setCurrentTrack: (track: Track) => void
  setIsPlaying: (playing: boolean) => void
  toggleFavourite: (track: Track) => void
  toggleFavouriteArtist: (artist: string) => void
  setVolume: (volume: number) => void
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      history: [],
      favourites: [],
      favouriteArtists: [],
      volume: 1,
      setCurrentTrack: (track) =>
        set((state) => ({
          currentTrack: track,
          history: [track, ...state.history.filter((t) => t.url !== track.url)].slice(0, 2),
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
      toggleFavouriteArtist: (artist) =>
        set((state) => {
          const exists = state.favouriteArtists.includes(artist)
          if (exists) {
            return { favouriteArtists: state.favouriteArtists.filter((a) => a !== artist) }
          }
          // Cap at MAX_FAVOURITE_ARTISTS; ignore further additions once full.
          if (state.favouriteArtists.length >= MAX_FAVOURITE_ARTISTS) return state
          return { favouriteArtists: [...state.favouriteArtists, artist] }
        }),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
    }),
    {
      name: 'modplayer-favourites',
      // Persist favourites (songs + artists) and volume; playback state stays fresh on each load.
      partialize: (state) => ({
        favourites: state.favourites,
        favouriteArtists: state.favouriteArtists,
        volume: state.volume,
      }),
    }
  )
)
