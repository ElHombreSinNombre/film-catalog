import type { APIRoute } from 'astro'
import supabase from '../../supabase/config'
import type movieFavourite from '@interfaces/favourite'
import { createErrorResponse, API_ERRORS } from './errors'

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json'))
      return createErrorResponse(API_ERRORS.BAD_REQUEST)
    const body: movieFavourite = await request.json()
    const { favourite, tmdb_id, imdb_id } = body
    if (favourite == null || tmdb_id == null || imdb_id == null)
      return createErrorResponse(API_ERRORS.MISSING_FIELDS)
    const movieToUpsert = { tmdb_id, imdb_id, favourite }
    const { data, error } = await supabase
      .from('movies')
      .upsert(movieToUpsert, {
        onConflict: 'tmdb_id',
        ignoreDuplicates: false,
      })
      .select('favourite')
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
