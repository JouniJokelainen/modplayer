import { useCallback, useEffect, useRef } from 'react'

interface Props {
  volume: number
  onChange: (volume: number) => void
}

const WHEEL_STEP = 0.05
// Track height in px. The fill gradient is sized to this (not to the fill
// height) so the colour at a given level matches the spectrum bars.
const TRACK_H = 160
// Same stops as the spectrum bars: green at the bottom, through yellow, to red.
const GRADIENT = 'linear-gradient(to top, #2bd62b 0%, #e7e90f 55%, #ff3a2f 100%)'

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
        className="relative w-3 cursor-pointer border border-retro-border bg-retro-bg"
        style={{ height: TRACK_H }}
      >
        {/* Filled level rising from the bottom. The gradient is anchored to the
            full track height, so a low level shows only its green range. */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: `${pct}%`,
            backgroundImage: GRADIENT,
            backgroundSize: `100% ${TRACK_H}px`,
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Handle */}
        <div
          className="absolute -left-1 -right-1 h-1.5 border border-retro-dark"
          style={{
            bottom: `calc(${pct}% - 3px)`,
            backgroundImage: GRADIENT,
            backgroundSize: `100% ${TRACK_H}px`,
            backgroundPosition: `bottom ${-(TRACK_H * volume) + 3}px center`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <span className="text-retro-accent text-xs font-bold tabular-nums">{pct}</span>
    </div>
  )
}
