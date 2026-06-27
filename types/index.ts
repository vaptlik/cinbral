export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
  plot: string;
  cast: string[];
  genres: string[];
}

export interface MovieCardProps {
  movie: Movie;
}

export interface MovieRowProps {
  title: string;
  movies: Movie[];
}