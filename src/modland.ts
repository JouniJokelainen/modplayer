// modland.com sends Access-Control-Allow-Origin: *, so the browser fetches it
// directly. No proxy is needed, which lets the app run as a static site.
export const MODLAND_BASE = 'https://modland.com/pub/modules/Protracker'

export function trackUrl(creator: string, name: string): string {
  return `${MODLAND_BASE}/${encodeURIComponent(creator)}/${encodeURIComponent(name)}`
}
