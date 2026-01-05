import { getItemsByIds, getItemById } from './supabase'
import type TMDBMovie from '@interfaces/tmdb'
import type SupabaseMovie from '@interfaces/supabase'
import { formatMovieData } from '../utils/tmdb'
import getMockMovies from '../utils/data'

const TMDB_URL = import.meta.env.TMDB_URL
const TMDB_KEY = import.meta.env.TMDB_KEY
const ISMOCK = import.meta.env.ENABLE_MOCK

async function fetchTMDB({ endpoint }: { endpoint: string }) {
  if (ISMOCK) {
    const hasId = endpoint.match(/\/(\d+)/)
    const mock = getMockMovies({ length: 5 })
    if (hasId) {
      const id = Number(hasId?.at(1))
      return mock.find((item) => item.id === id)
    } else {
      return {
        results: mock,
      }
    }
  }
  const addKey = `${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`
  const response = await fetch(`${TMDB_URL}${endpoint}${addKey}`)
  if (!response.ok) throw new Error(`TMDB Error: ${response.status}`)
  return await response.json()
}

const getAll = async (): Promise<TMDBMovie[] | null> => {
  try {
    const response = await fetchTMDB({
      endpoint: '/discover/movie?sort_by=popularity',
    })
    let moviesFromApi: TMDBMovie[]
    if (ISMOCK) {
      moviesFromApi = response.results
    } else {
      const getIMDBId = await Promise.all(
        response.results.map((movies: TMDBMovie) => {
          const fullDetail = fetchTMDB({ endpoint: `/movie/${movies.id}` })
          return fullDetail
        })
      )
      moviesFromApi = getIMDBId.map((movie: TMDBMovie) =>
        formatMovieData({ movie })
      )
    }
    const responseSupabase = await getItemsByIds({
      tmdb_ids: moviesFromApi
        .map((movie: TMDBMovie) => movie.id)
        .filter(Boolean),
    })
    return moviesFromApi.map((movie: TMDBMovie) => {
      const extra = responseSupabase.find(
        (item: SupabaseMovie) => item.tmdb_id === movie.id
      )
      return {
        ...movie,
        vote_average:
          extra?.vote_average ??
          (movie.vote_average ? Math.round(movie.vote_average / 2) : 0),
        favourite: extra?.favourite ?? false,
      } as TMDBMovie
    })
  } catch (error) {
    console.error('Critical failure in getAll:', error)
    throw error
  }
}

const getItem = async ({
  tmdb_id,
}: {
  tmdb_id: string
}): Promise<TMDBMovie | null> => {
  try {
    const response = await fetchTMDB({ endpoint: `/movie/${tmdb_id}` })
    const movieFromApi = ISMOCK
      ? response
      : formatMovieData({ movie: response })
    const responseSupabase = await getItemById({
      tmdb_id: movieFromApi.id,
    })
    return {
      ...movieFromApi,
      vote_average:
        responseSupabase?.vote_average ??
        (movieFromApi?.vote_average
          ? Math.round(movieFromApi.vote_average / 2)
          : 0),
      favourite: responseSupabase?.favourite ?? false,
    } as TMDBMovie
  } catch (error) {
    console.error('Critical failure in getItem:', error)
    throw error
  }
}

export { getAll, getItem }
