export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: number;
  plot: string;
  cast: string[];
  genres: string[];
  duration?: string;
  mediaType?: 'filme' | 'serie';
}

export interface MovieCardProps {
  movie: Movie;
}

export interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export interface TmdbMovieDto {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids: number[];
}

export interface TmdbMovieDetailDto {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits: {
    cast: { id: number; name: string }[];
  };
}

export interface TmdbListResponse {
  results: TmdbMovieDto[];
}