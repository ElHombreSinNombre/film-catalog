import type { APIRoute } from 'astro'
import { createErrorResponse, API_ERRORS } from './errors'
import supabase from '../../supabase/config'
import type movieRating from '@interfaces/rating'

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json'))
      return createErrorResponse(API_ERRORS.INVALID_CONTENT_TYPE)
    const body: movieRating = await request.json()
    const { vote_average, tmdb_id, imdb_id } = body
    if (vote_average == null || tmdb_id == null || imdb_id == null)
      return createErrorResponse(API_ERRORS.MISSING_FIELDS)
    const movieToUpsert = { imdb_id, tmdb_id, vote_average }
    const { data, error } = await supabase
      .from('movies')
      .upsert(movieToUpsert, {
        onConflict: 'tmdb_id',
        ignoreDuplicates: false,
      })
      .select('vote_average')
      .single()
    if (error) {
      console.error('[DB Error]:', error.message)
      return createErrorResponse(API_ERRORS.DB_ERROR)
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[API Error]:', error)
    return createErrorResponse(API_ERRORS.BAD_REQUEST)
  }
}
