// modland.com sends Access-Control-Allow-Origin: *, so the browser fetches it
// directly. No proxy is needed, which lets the app run as a static site.
export const MODLAND_ROOT = 'https://modland.com/pub/modules'

// Supported module formats. Each lives in its own top-level modland folder and
// uses a distinct file extension. libopenmpt decodes them all, so playback is
// format-agnostic; only browsing needs to know which folder a file lives in.
export const FORMATS = [
  { folder: 'Protracker', ext: '.mod' },
  { folder: 'Fasttracker 2', ext: '.xm' },
] as const

export function trackUrl(folder: string, creator: string, name: string): string {
  return `${MODLAND_ROOT}/${encodeURIComponent(folder)}/${encodeURIComponent(creator)}/${encodeURIComponent(name)}`
}
