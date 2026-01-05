export default interface TMDBMovie {
  id: number
  imdb_id: string
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  vote_average: number
  favourite: boolean
}
