import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE = '/modland/pub/modules/Protracker'

function parseLinks(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(doc.querySelectorAll('a[href]'))
    .map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '')
    .filter((href) => href && !href.startsWith('?') && href !== '../')
    .map((href) => (href.endsWith('/') ? href.slice(0, -1) : href))
    .filter(Boolean)
    .map((href) => decodeURIComponent(href))
}

export function useCreators() {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data } = await axios.get<string>(`${BASE}/`, { responseType: 'text' })
      return parseLinks(data)
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useTracks(creator: string | null) {
  return useQuery({
    queryKey: ['tracks', creator],
    enabled: !!creator,
    queryFn: async () => {
      const { data } = await axios.get<string>(`${BASE}/${encodeURIComponent(creator!)}/`, { responseType: 'text' })
      return parseLinks(data)
        .filter((name) => name.toLowerCase().endsWith('.mod'))
    },
    staleTime: 5 * 60 * 1000,
  })
}
