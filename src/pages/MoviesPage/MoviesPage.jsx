import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Axios from "axios";
import PropTypes from "prop-types";
import MovieList from "../../components/MovieList/MovieList";
import Navigation from "../../components/Navigation/Navigation";

import Styles from "./MoviesPage.module.css";

const api_key = import.meta.env.VITE_API_KEY;

const axiosInstance = Axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: api_key,
  },
});

function Loading() {
  return <p>Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p style={{ color: "red" }}>Oops! {message}</p>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const query = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(query);

  const fetchMoviesByQuery = useCallback(async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/search/movie`, {
        params: { query },
      });
      setMovies(response.data.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchMoviesByQuery();
  }, [fetchMoviesByQuery]);

  function handleSearch(e) {
    e.preventDefault();
    setSearchParams({ query: searchTerm.trim() });
  }

  return (
    <>
      <Navigation />
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={Styles.moviesPageButton}>Search</button>
      </form>

      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {movies.length > 0 && <MovieList movies={movies} />}
    </>
  );
}
