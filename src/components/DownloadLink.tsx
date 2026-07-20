interface Props {
  url: string
  name: string
}

// The download attribute is ignored on cross-origin URLs, and modland tracks are
// cross-origin, so fetch the file and save it from a blob instead.
async function download(url: string, name: string) {
  const resp = await fetch(url)
  const blob = await resp.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = name
  a.click()
  URL.revokeObjectURL(objectUrl)
}

export function DownloadLink({ url, name }: Props) {
  return (
    <button
      onClick={() => download(url, name).catch((err) => console.error('Download failed', err))}
      title="Download .mod file"
      className="shrink-0 self-stretch px-2 flex items-center text-sm text-retro-muted hover:text-retro-accent transition-colors"
    >
      ⤓
    </button>
  )
}
