interface Props {
  onLoad: (file: File) => void
}

export function LoadFile({ onLoad }: Props) {
  return (
    <label className="shrink-0 px-2 py-1 text-xs uppercase tracking-widest font-mono font-bold border border-retro-accent text-retro-accent hover:bg-retro-active cursor-pointer transition-colors">
      [ LOAD FILE ]
      <input
        type="file"
        accept=".mod"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onLoad(file)
          // Reset so picking the same file again re-triggers onChange.
          e.target.value = ''
        }}
      />
    </label>
  )
}
