import { Movie, TmdbListResponse, TmdbMovieDetailDto, TmdbMovieDto } from '../types';

const API_KEY = 'fc4d788f8bcd16ad159293355ce31402';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const IMG_W1280 = 'https://image.tmdb.org/t/p/w1280';

const GENRE_MAP: Record<number, string> = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia',
  80: 'Crime', 99: 'Documentário', 18: 'Drama', 10751: 'Família',
  14: 'Fantasia', 27: 'Terror', 9648: 'Mistério', 10749: 'Romance',
  878: 'Ficção Científica', 53: 'Suspense', 10752: 'Guerra', 37: 'Faroeste',
  10759: 'Ação e Aventura', 10765: 'Sci-Fi e Fantasia',
};

function toMovie(dto: TmdbMovieDto): Movie {
  return {
    id: String(dto.id),
    title: dto.title,
    posterUrl: dto.poster_path ? `${IMG_W500}${dto.poster_path}` : '',
    backdropUrl: dto.backdrop_path ? `${IMG_W1280}${dto.backdrop_path}` : '',
    rating: Math.round(dto.vote_average * 10) / 10,
    year: Number(dto.release_date?.slice(0, 4)) || 0,
    plot: dto.overview || 'Sem sinopse disponível.',
    cast: [],
    genres: dto.genre_ids.slice(0, 3).map(id => GENRE_MAP[id] ?? '').filter(Boolean),
  };
}

function toMovieDetail(dto: TmdbMovieDetailDto): Movie {
  const hours = dto.runtime ? Math.floor(dto.runtime / 60) : 0;
  const mins = dto.runtime ? dto.runtime % 60 : 0;
  return {
    id: String(dto.id),
    title: dto.title,
    posterUrl: dto.poster_path ? `${IMG_W500}${dto.poster_path}` : '',
    backdropUrl: dto.backdrop_path ? `${IMG_W1280}${dto.backdrop_path}` : '',
    rating: Math.round(dto.vote_average * 10) / 10,
    year: Number(dto.release_date?.slice(0, 4)) || 0,
    plot: dto.overview || 'Sem sinopse disponível.',
    cast: dto.credits?.cast.slice(0, 6).map(c => c.name) ?? [],
    genres: dto.genres.slice(0, 3).map(g => g.name),
    duration: dto.runtime ? `${hours}h ${mins}min` : undefined,
  };
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams({ api_key: API_KEY, language: 'pt-BR', ...params });
  const res = await fetch(`${BASE_URL}${path}?${query}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await get<TmdbListResponse>('/movie/popular');
  return data.results.map(toMovie);
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await get<TmdbListResponse>('/trending/movie/week');
  return data.results.map(toMovie);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await get<TmdbListResponse>('/movie/top_rated');
  return data.results.map(toMovie);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return getPopularMovies();
  const data = await get<TmdbListResponse>('/search/movie', { query });
  return data.results.map(toMovie);
}

export async function getMovieDetails(id: string): Promise<Movie> {
  const data = await get<TmdbMovieDetailDto>(`/movie/${id}`, { append_to_response: 'credits' });
  return toMovieDetail(data);
}