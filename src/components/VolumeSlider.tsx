import { useCallback, useEffect, useRef } from 'react'

interface Props {
  volume: number
  onChange: (volume: number) => void
}

const WHEEL_STEP = 0.05
// Same stops as the spectrum bars, laid out left to right: green at silence,
// through yellow, to red at full volume.
const GRADIENT = 'linear-gradient(to right, #2bd62b 0%, #e7e90f 55%, #ff3a2f 100%)'

// Horizontal retro volume slider, fixed to the bottom-right of the screen. The
// gradient always spans the whole track and the unfilled part is masked from the
// right, so the colour at a given level matches the spectrum bars.
// Drag the track or scroll the mouse wheel over it to change the level.
export function VolumeSlider({ volume, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    // Left of the track is silence, right is full volume.
    const ratio = (clientX - rect.left) / rect.width
    onChange(Math.min(1, Math.max(0, ratio)))
  }, [onChange])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dragging.current) setFromClientX(e.clientX)
    }
    const up = () => { dragging.current = false }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [setFromClientX])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    setFromClientX(e.clientX)
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
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 border border-retro-border bg-retro-dark px-2 py-2 select-none"
    >
      <span className="text-retro-muted text-xs uppercase tracking-widest shrink-0">VOL</span>
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        className="relative w-32 h-3 cursor-pointer border border-retro-border"
        style={{ backgroundImage: GRADIENT }}
      >
        {/* Masks the unfilled part so only the level up to pct stays coloured. */}
        <div className="absolute inset-y-0 right-0 bg-retro-bg" style={{ width: `${100 - pct}%` }} />
        {/* Handle */}
        <div
          className="absolute -top-1 -bottom-1 w-1 bg-retro-text"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <span className="text-retro-accent text-xs font-bold tabular-nums w-7 text-right">{pct}</span>
    </div>
  )
}
