const API_KEY = "80e6949afda9739e0b0dc37192aba952";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
}
export interface IExtendsResult extends IMoviesResult {
  dates: {
    maximum: string;
    minimun: string;
  };
}

export interface IMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGenres {
  id: number;
  name: string;
}
export interface IMovieDetailResult {
  genres: IGenres[];
  id: number;
  release_date: string;
  title: string;
  overview: string;
  backdrop_path: string;
  adult: boolean;
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
