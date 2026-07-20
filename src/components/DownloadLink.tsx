interface Props {
  url: string
  name: string
}

export function DownloadLink({ url, name }: Props) {
  return (
    <a
      href={url}
      download={name}
      title="Download .mod file"
      className="shrink-0 self-stretch px-2 flex items-center text-sm text-retro-muted hover:text-retro-accent transition-colors"
    >
      ⤓
    </a>
  )
}
