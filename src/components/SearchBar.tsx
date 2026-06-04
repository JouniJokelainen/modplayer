interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder?.toUpperCase() ?? 'SEARCH...'}
      className="w-full px-2 py-1.5 bg-retro-dark border border-retro-border text-retro-text font-mono text-xs uppercase tracking-wider placeholder-retro-muted focus:outline-none focus:border-retro-accent focus:text-retro-accent"
    />
  )
}
