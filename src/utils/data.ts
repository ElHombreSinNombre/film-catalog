import type TMDBMovie from '@interfaces/tmdb'

const getMockMovies = ({ length }: { length: number }): TMDBMovie[] => {
  return Array.from({ length }, (_, i): TMDBMovie => {
    return {
      id: i + 1,
      imdb_id: `tt${((i + 1) * 1234567).toString().slice(0, 7)}`,
      title: `Film ${i + 1}`,
      release_date: new Date().toISOString().split('T')[0],
      vote_average: Math.floor(Math.random() * 5) + 1,
      favourite: Math.random() > 0.5,
      overview:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit, morbi lacus montes aliquet sollicitudin quam sagittis curabitur, sociosqu sapien aenean venenatis praesent massa. Hac inceptos enim dis class eros orci, ad montes suscipit condimentum commodo natoque ultrices, malesuada lacus fringilla platea tempus. Cras sollicitudin phasellus urna ridiculus bibendum quis ac, magnis primis enim senectus eleifend etiam.',
      poster_path: `https://picsum.photos/seed/${100 + i}/500/750`,
    }
  }) as TMDBMovie[]
}

export default getMockMovies
