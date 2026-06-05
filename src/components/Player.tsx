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
      if (e.code === 'Space' && !e.repeat) {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          onToggle()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onToggle])

  return (
    <div className="border border-retro-border bg-retro-dark">
      <div className="px-2 py-1 border-b border-retro-border bg-retro-panel">
        <span className="text-retro-text text-xs uppercase tracking-widest">PLAYER</span>
      </div>

      <div className="p-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-retro-muted text-xs uppercase w-16 shrink-0">SONG:</span>
          <span className="text-retro-cyan text-xs uppercase truncate font-mono">
            {track ? track.name : '---'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-retro-muted text-xs uppercase w-16 shrink-0">ARTIST:</span>
          <span className="text-retro-cyan text-xs uppercase truncate font-mono">
            {track ? track.creator : '---'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-retro-muted text-xs uppercase w-16 shrink-0">STATUS:</span>
          <span className={`text-xs uppercase font-mono font-bold ${isPlaying ? 'text-retro-accent' : 'text-retro-muted'}`}>
            {track ? (isPlaying ? 'PLAYING' : 'PAUSED') : 'STOPPED'}
          </span>
        </div>
      </div>

      <div className="px-2 pb-2">
        <button
          onClick={onToggle}
          disabled={!track}
          className={`w-full py-1.5 text-xs uppercase tracking-widest font-mono font-bold border transition-colors ${
            !track
              ? 'border-retro-border text-retro-muted cursor-not-allowed'
              : isPlaying
              ? 'border-retro-accent text-retro-dark bg-retro-accent hover:bg-retro-accent-dim'
              : 'border-retro-accent text-retro-accent hover:bg-retro-active'
          }`}
        >
          {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
        </button>
        <p className="text-retro-muted text-xs text-center mt-1 uppercase tracking-widest">SPACE TO TOGGLE</p>
      </div>
    </div>
  )
}
