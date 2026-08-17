import { Track } from './store/playback'

// Shape of the exported/imported favourites file. The `type` + `version` tags
// let us recognise our own files and evolve the format later without silently
// mis-parsing an unrelated JSON file the user happens to pick.
const FILE_TYPE = 'modplayer-favourites'
const FILE_VERSION = 1

interface FavouritesFile {
  type: string
  version: number
  favourites: Track[]
  favouriteArtists: string[]
}

// Build the JSON payload and trigger a client-side download. Mirrors the blob
// download used for track files in DownloadLink.tsx, minus the network fetch —
// the data already lives in the store.
export function exportFavourites(favourites: Track[], favouriteArtists: string[]) {
  const payload: FavouritesFile = {
    type: FILE_TYPE,
    version: FILE_VERSION,
    favourites,
    favouriteArtists,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = 'modplayer-favourites.json'
  a.click()
  URL.revokeObjectURL(objectUrl)
}

// A single favourite is only usable if it carries the three string fields the
// player needs; anything else is dropped rather than trusted.
function isValidTrack(value: unknown): value is Track {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return typeof t.creator === 'string' && typeof t.name === 'string' && typeof t.url === 'string'
}

// Parse and validate an imported file's text. Throws with a user-facing message
// on anything malformed; otherwise returns the cleaned song/artist arrays. The
// caller (the store's importFavourites) handles deduping and the size caps.
export function parseFavouritesFile(text: string): { songs: Track[]; artists: string[] } {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('NOT VALID JSON')
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('UNRECOGNISED FILE')
  }
  const obj = parsed as Record<string, unknown>
  if (obj.type !== FILE_TYPE) {
    throw new Error('NOT A FAVOURITES FILE')
  }
  const songs = Array.isArray(obj.favourites) ? obj.favourites.filter(isValidTrack) : []
  const artists = Array.isArray(obj.favouriteArtists)
    ? obj.favouriteArtists.filter((a): a is string => typeof a === 'string')
    : []
  return { songs, artists }
}
