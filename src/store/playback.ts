import { create } from 'zustand'

export interface Track {
  creator: string
  name: string
  url: string
}

interface PlaybackState {
  currentTrack: Track | null
  isPlaying: boolean
  history: Track[]
  setCurrentTrack: (track: Track) => void
  setIsPlaying: (playing: boolean) => void
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  history: [],
  setCurrentTrack: (track) =>
    set((state) => ({
      currentTrack: track,
      history: [track, ...state.history.filter((t) => t.url !== track.url)].slice(0, 3),
    })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}))
