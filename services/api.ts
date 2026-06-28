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


export interface TmdbTvDto {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
}

export interface TmdbTvListResponse {
  results: TmdbTvDto[];
}

function tvToMovie(dto: TmdbTvDto): Movie {
  return {
    id: String(dto.id),
    title: dto.name,
    posterUrl: dto.poster_path ? `${IMG_W500}${dto.poster_path}` : '',
    backdropUrl: dto.backdrop_path ? `${IMG_W1280}${dto.backdrop_path}` : '',
    rating: Math.round(dto.vote_average * 10) / 10,
    year: Number(dto.first_air_date?.slice(0, 4)) || 0,
    plot: dto.overview || 'Sem sinopse disponível.',
    cast: [],
    genres: dto.genre_ids.slice(0, 3).map(id => GENRE_MAP[id] ?? '').filter(Boolean),
    mediaType: 'serie',
  };
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams({ api_key: API_KEY, language: 'pt-BR', ...params });
  const res = await fetch(`${BASE_URL}${path}?${query}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function getPopularMovies(): Promise<Movie[]> {
  const [p1, p2] = await Promise.all([
    get<TmdbListResponse>('/movie/popular', { page: '1' }),
    get<TmdbListResponse>('/movie/popular', { page: '2' }),
  ]);
  return dedup(shuffle([...p1.results, ...p2.results]).map(toMovie));
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await get<TmdbListResponse>('/trending/movie/week');
  return data.results.map(toMovie);
}

function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

function dedup(movies: Movie[]): Movie[] {
  const seen = new Set<string>();
  return movies.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const [p1, p2, p3] = await Promise.all([
    get<TmdbListResponse>('/movie/top_rated', { page: '1' }),
    get<TmdbListResponse>('/movie/top_rated', { page: '2' }),
    get<TmdbListResponse>('/movie/top_rated', { page: '3' }),
  ]);
  return dedup(shuffle([...p1.results, ...p2.results, ...p3.results]).map(toMovie));
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return getPopularMovies();
  const [movies, tv] = await Promise.all([
    get<TmdbListResponse>('/search/movie', { query }),
    get<TmdbTvListResponse>('/search/tv', { query }),
  ]);
  const results = [
    ...movies.results.map(toMovie),
    ...tv.results.map(tvToMovie),
  ];
  return dedup(results.sort((a, b) => b.rating - a.rating));
}

export async function getMovieDetails(id: string): Promise<Movie> {
  const data = await get<TmdbMovieDetailDto>(`/movie/${id}`, { append_to_response: 'credits' });
  return toMovieDetail(data);
}

export interface TmdbTvDetailDto {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  credits?: { cast: { id: number; name: string }[] };
}

export async function getTvDetails(id: string): Promise<Movie> {
  const data = await get<TmdbTvDetailDto>(`/tv/${id}`, { append_to_response: 'credits' });
  const runtime = data.episode_run_time?.[0];
  return {
    id: String(data.id),
    title: data.name,
    posterUrl: data.poster_path ? `${IMG_W500}${data.poster_path}` : '',
    backdropUrl: data.backdrop_path ? `${IMG_W1280}${data.backdrop_path}` : '',
    rating: Math.round(data.vote_average * 10) / 10,
    year: Number(data.first_air_date?.slice(0, 4)) || 0,
    plot: data.overview || 'Sem sinopse disponível.',
    cast: data.credits?.cast.slice(0, 6).map(c => c.name) ?? [],
    genres: data.genres.slice(0, 3).map(g => g.name),
    duration: runtime ? `${runtime}min por ep.` : undefined,
    mediaType: 'serie',
  };
}

async function getByGenre(genreId: string): Promise<Movie[]> {
  const [byVotes, byPop] = await Promise.all([
    get<TmdbListResponse>('/discover/movie', {
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': '500',
      page: String(Math.floor(Math.random() * 3) + 1),
    }),
    get<TmdbListResponse>('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page: String(Math.floor(Math.random() * 3) + 1),
    }),
  ]);
  return dedup(shuffle([...byVotes.results, ...byPop.results]).map(toMovie));
}

export async function getActionMovies(): Promise<Movie[]> {
  return getByGenre('28');
}

export async function getComedyMovies(): Promise<Movie[]> {
  return getByGenre('35');
}

export async function getHorrorMovies(): Promise<Movie[]> {
  return getByGenre('27');
}

export async function getSciFiMovies(): Promise<Movie[]> {
  return getByGenre('878');
}

export async function getAnimationMovies(): Promise<Movie[]> {
  return getByGenre('16');
}

// ─── TV Seasons & Episodes ────────────────────────────────────────────────────

export interface TmdbSeason {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
}

export interface TmdbEpisode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TmdbSeasonDetail {
  episodes: TmdbEpisode[];
}

export interface TmdbTvSeasons {
  id: number;
  name: string;
  seasons: TmdbSeason[];
}

export async function getTvSeasons(id: string): Promise<TmdbTvSeasons> {
  return get<TmdbTvSeasons>(`/tv/${id}`);
}

export async function getTvSeasonEpisodes(id: string, season: number): Promise<TmdbEpisode[]> {
  const data = await get<TmdbSeasonDetail>(`/tv/${id}/season/${season}`);
  return data.episodes;
}