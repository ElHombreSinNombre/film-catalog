import supabase from '../supabase/config'
import type SupabaseMovie from '@interfaces/supabase'

const getItemById = async ({
  tmdb_id,
}: {
  tmdb_id: number
}): Promise<SupabaseMovie> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('tmdb_id', tmdb_id)
      .maybeSingle()
    if (error) throw new Error(`Supabase error getItemById: ${error.message}`)
    return data as SupabaseMovie
  } catch (error) {
    console.error('Failure in getItemById', error)
    throw error
  }
}

const getItemsByIds = async ({
  tmdb_ids,
}: {
  tmdb_ids: number[]
}): Promise<SupabaseMovie[]> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .in('tmdb_id', tmdb_ids)
    if (error) throw new Error(`Supabase error getItemByIds: ${error.message}`)
    return data as SupabaseMovie[]
  } catch (error) {
    console.error('Failure in getItemByIds', error)
    throw error
  }
}

export { getItemById, getItemsByIds }
