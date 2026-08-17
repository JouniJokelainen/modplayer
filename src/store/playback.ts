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
  importFavourites: (songs: Track[], artists: string[]) => ImportResult
  setVolume: (volume: number) => void
}

// Counts returned by importFavourites so the UI can report what happened:
// how many new songs/artists were added and how many incoming entries were
// skipped (duplicates or dropped because a list was already at its cap).
export interface ImportResult {
  addedSongs: number
  addedArtists: number
  skipped: number
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set, get) => ({
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
      importFavourites: (songs, artists) => {
        const state = get()
        // Merge into the existing lists: skip duplicates (songs by url, artists
        // by name) and stop adding once a list reaches its cap. Anything not
        // added — duplicate or overflow — counts as skipped.
        const mergedSongs = [...state.favourites]
        let addedSongs = 0
        let skipped = 0
        for (const song of songs) {
          if (mergedSongs.some((f) => f.url === song.url)) {
            skipped++
          } else if (mergedSongs.length >= MAX_FAVOURITES) {
            skipped++
          } else {
            mergedSongs.push(song)
            addedSongs++
          }
        }
        const mergedArtists = [...state.favouriteArtists]
        let addedArtists = 0
        for (const artist of artists) {
          if (mergedArtists.includes(artist)) {
            skipped++
          } else if (mergedArtists.length >= MAX_FAVOURITE_ARTISTS) {
            skipped++
          } else {
            mergedArtists.push(artist)
            addedArtists++
          }
        }
        set({ favourites: mergedSongs, favouriteArtists: mergedArtists })
        return { addedSongs, addedArtists, skipped }
      },
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
