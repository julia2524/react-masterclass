const API_KEY = "80e6949afda9739e0b0dc37192aba952";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IBaseContents {
  backdrop_path: string;
  id: number;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface ITvs extends IBaseContents {
  name: string;
}
interface IMovies extends IBaseContents {
  title: string;
}
export interface IExtendsResult extends IMoviesResult {
  dates: {
    maximum: string;
    minimun: string;
  };
}
export interface IMoviesResult {
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}
export interface ITvsResult {
  page: number;
  results: ITvs[];
  total_pages: number;
  total_results: number;
}

interface IGenres {
  id: number;
  name: string;
}
interface IBaseDetailContents {
  genres: IGenres[];
  id: number;
  overview: string;
  backdrop_path: string;
  adult: boolean;
}
export interface IMoviesDetailResult extends IBaseDetailContents {
  release_date: string;
  title: string;
}
export interface ITvDetailResult extends IBaseDetailContents {
  first_air_date: string;
  name: string;
}
interface ISearch {
  backdrop_path: string;
  id: number;
  name?: string;
  title?: string;
  overview: string;
  poster_path: string;
  media_type: string;
  first_air_date?: string;
  release_date?: string;
}
export interface ISearchDatas {
  page: number;
  results: ISearch[];
}

export async function getNowPlayingMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  );
  return response.json();
}

export async function getPopularMovies() {
  const response = await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`);
  return response.json();
}

export async function getTopRatedMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`
  );
  return response.json();
}

export async function getMovieDetail(movieId: string) {
  const response = await fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`
  );
  return response.json();
}
export async function getNowPlayingTvs() {
  const response = await fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`);
  return response.json();
}
export async function getPopularTvs() {
  const response = await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`);
  return response.json();
}
export async function getTopRatedTvs() {
  const response = await fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`);
  return response.json();
}
export async function getTvDetail(tvId: string) {
  const response = await fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`);
  return response.json();
}

export async function getSearchDatas(keyword: string) {
  const response = await fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  );
  return response.json();
}
