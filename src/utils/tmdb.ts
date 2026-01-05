import type TMDBMovie from '@interfaces/tmdb'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500/'

export const formatMovieData = ({ movie }: { movie: TMDBMovie }) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  release_date: movie.release_date,
  poster_path: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
  imdb_id: movie.imdb_id,
  vote_average: movie.vote_average,
  favourite: false,
})
