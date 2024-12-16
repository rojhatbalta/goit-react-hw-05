import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import Axios from "axios";

import MovieList from "../../components/MovieList/MovieList";
import Navigation from "../../components/Navigation/Navigation";

import Styles from "./MoviesPage.module.css";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2ViMThmMGU3ZGM1MTkxNTgyOTNkZjc1MTliNTQ4MyIsIm5iZiI6MTczNDMwNTU5OS40MTY5OTk4LCJzdWIiOiI2NzVmNjczZjZmODRhMGNlMDc1ZTk1MzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EGINKZ0yMZM3uLJ-V9I_wNPlec9b7MgH4X7oYcTL5mg",
  },
};

const url =
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1>";

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const query = searchParams.get(query) || "";

  async function fetchMoviesBuQuery() {
    try {
      setIsLoading(true);
      const res = await Axios.get(url, options);
      const data = res.data.results;
      setMovies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setSearchParams({ query: inputRef.current.value });
  }

  useEffect(
    function () {
      fetchMoviesBuQuery();
    },
    [searchParams]
  );

  return (
    <>
      <Navigation />
      <form onSubmit={(e) => handleSearch(e)}>
        <input type="text" ref={inputRef} />
        <button className={Styles.moviesPageButton}>Search</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {movies.length > 0 && <MovieList movies={movies} />}
    </>
  );
}
