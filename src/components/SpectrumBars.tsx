import { useEffect, useRef } from 'react'
import { getAnalyser } from '../audio/audioEngine'

const BAR_COUNT = 12
// Lower/mid frequency bins carry most of the energy in MOD music; ignore the
// quiet high end so the bars stay lively.
const USABLE_BINS = 28

export function SpectrumBars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const levels = useRef<number[]>(new Array(BAR_COUNT).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const render = () => {
      const parent = canvas.parentElement
      if (parent) {
        if (canvas.width !== parent.clientWidth) canvas.width = parent.clientWidth
        if (canvas.height !== parent.clientHeight) canvas.height = parent.clientHeight
      }
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const analyser = getAnalyser()
      let data: Uint8Array | null = null
      if (analyser) {
        data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
      }

      const gap = Math.max(2, w * 0.012)
      const barW = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT
      const maxH = h - 2

      for (let i = 0; i < BAR_COUNT; i++) {
        let target = 0
        if (data) {
          const usable = Math.min(data.length, USABLE_BINS)
          const start = Math.floor((i / BAR_COUNT) * usable)
          const end = Math.max(start + 1, Math.floor(((i + 1) / BAR_COUNT) * usable))
          let sum = 0
          for (let b = start; b < end; b++) sum += data[b]
          target = sum / (end - start) / 255
        }

        // Rise quickly, fall slowly so the bars settle to a flat baseline when
        // nothing is playing.
        const cur = levels.current[i]
        levels.current[i] = target > cur ? cur + (target - cur) * 0.6 : cur + (target - cur) * 0.12

        const barH = Math.max(3, levels.current[i] * maxH)
        const x = i * (barW + gap)

        // Gradient anchored to the full bar height: short bars read green,
        // tall bars climb through yellow into red (as in the reference).
        const grad = ctx.createLinearGradient(0, h, 0, h - maxH)
        grad.addColorStop(0, '#2bd62b')
        grad.addColorStop(0.55, '#e7e90f')
        grad.addColorStop(1, '#ff3a2f')
        ctx.fillStyle = grad
        ctx.fillRect(x, h - barH, barW, barH)
      }

      raf = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="h-20 shrink-0 px-3 pt-3 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
