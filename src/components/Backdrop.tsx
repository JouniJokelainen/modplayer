import { ReactNode } from 'react'

// The artist credit is baked into the bottom-left of the image, but the panel is
// far narrower than the image's 2.29 aspect, so background-size: cover crops the
// left and right edges and the credit disappears at most window widths. Render it
// as an overlay instead so it stays visible (and readable) at every size.
export function Backdrop({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}16-bit_memories.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
      <a
        href="https://www.interstation3d.com"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-1 left-2 text-xs text-retro-muted hover:text-retro-accent transition-colors"
      >
        Toni Bratincevic — interstation3d.com
      </a>
    </div>
  )
}
