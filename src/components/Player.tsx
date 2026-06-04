import { Play, Pause } from 'lucide-react'
import { useEffect } from 'react'
import { Track } from '../store/playback'

interface Props {
  track: Track | null
  isPlaying: boolean
  onToggle: () => void
}

export function Player({ track, isPlaying, onToggle }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        onToggle()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onToggle])

  if (!track) {
    return (
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 text-sm">
        No track loaded. Select a track to play.
      </div>
    )
  }

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-4">
      <button
        onClick={onToggle}
        className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-full transition-colors"
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="overflow-hidden">
        <p className="text-white text-sm font-medium truncate">{track.name}</p>
        <p className="text-zinc-400 text-xs truncate">{track.creator}</p>
      </div>
    </div>
  )
}
