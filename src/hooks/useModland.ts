import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MODLAND_ROOT, FORMATS, trackUrl } from '../modland'

// A module file resolved to its full URL, since the folder (format) it lives in
// determines the URL and can no longer be inferred from the name alone.
export interface TrackEntry {
  name: string
  url: string
}

function parseLinks(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(doc.querySelectorAll('a[href]'))
    .map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '')
    .filter((href) => href && !href.startsWith('?') && href !== '../')
    .map((href) => (href.endsWith('/') ? href.slice(0, -1) : href))
    .filter(Boolean)
    .map((href) => decodeURIComponent(href))
}

// Fetch and parse a directory listing. A missing folder (e.g. an artist that
// only exists under one format) 404s; treat that as simply empty.
async function fetchDir(path: string): Promise<string[]> {
  try {
    const { data } = await axios.get<string>(path, { responseType: 'text' })
    return parseLinks(data)
  } catch {
    return []
  }
}

export function useCreators() {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const lists = await Promise.all(
        FORMATS.map((f) => fetchDir(`${MODLAND_ROOT}/${encodeURIComponent(f.folder)}/`))
      )
      // Union the artist lists from every format folder.
      return Array.from(new Set(lists.flat())).sort((a, b) => a.localeCompare(b))
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useTracks(creator: string | null) {
  return useQuery({
    queryKey: ['tracks', creator],
    enabled: !!creator,
    queryFn: async (): Promise<TrackEntry[]> => {
      const perFormat = await Promise.all(
        FORMATS.map(async (f) => {
          const names = await fetchDir(
            `${MODLAND_ROOT}/${encodeURIComponent(f.folder)}/${encodeURIComponent(creator!)}/`
          )
          return names
            .filter((name) => name.toLowerCase().endsWith(f.ext))
            .map((name) => ({ name, url: trackUrl(f.folder, creator!, name) }))
        })
      )
      // Merge .mod and .xm files for the artist into one alphabetical list.
      return perFormat.flat().sort((a, b) => a.name.localeCompare(b.name))
    },
    staleTime: 5 * 60 * 1000,
  })
}
