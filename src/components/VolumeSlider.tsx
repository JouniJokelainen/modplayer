import { useCallback, useEffect, useRef } from 'react'

interface Props {
  volume: number
  onChange: (volume: number) => void
}

const WHEEL_STEP = 0.05

// Vertical retro volume slider fixed to the bottom-right of the screen.
// Drag the handle or scroll the mouse wheel over it to change the level.
export function VolumeSlider({ volume, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromClientY = useCallback((clientY: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    // Top of the track is full volume, bottom is silence.
    const ratio = 1 - (clientY - rect.top) / rect.height
    onChange(Math.min(1, Math.max(0, ratio)))
  }, [onChange])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dragging.current) setFromClientY(e.clientY)
    }
    const up = () => { dragging.current = false }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [setFromClientY])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    setFromClientY(e.clientY)
  }

  const handleWheel = (e: React.WheelEvent) => {
    // Wheel up (deltaY < 0) raises volume, wheel down lowers it.
    const dir = e.deltaY < 0 ? 1 : -1
    onChange(Math.min(1, Math.max(0, volume + dir * WHEEL_STEP)))
  }

  const pct = Math.round(volume * 100)

  return (
    <div
      onWheel={handleWheel}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1 border border-retro-border bg-retro-dark px-2 py-2 select-none"
    >
      <span className="text-retro-muted text-xs uppercase tracking-widest">VOL</span>
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        className="relative h-40 w-3 cursor-pointer border border-retro-border bg-retro-bg"
      >
        {/* Filled level rising from the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 bg-retro-accent"
          style={{ height: `${pct}%` }}
        />
        {/* Handle */}
        <div
          className="absolute -left-1 -right-1 h-1.5 border border-retro-dark bg-retro-accent"
          style={{ bottom: `calc(${pct}% - 3px)` }}
        />
      </div>
      <span className="text-retro-accent text-xs font-bold tabular-nums">{pct}</span>
    </div>
  )
}
