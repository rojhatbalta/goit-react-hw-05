import { useEffect, useState } from "react";
import Axios from "axios";
import PropTypes from "prop-types";
import Styles from "./HomePage.module.css";
import Navigation from "../../components/Navigation/Navigation";
import MovieList from "../../components/MovieList/MovieList";

const api_key = import.meta.env.VITE_API_KEY;

const axiosInstance = Axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: api_key,
  },
});

function Loading() {
  return <div>Loading...</div>;
}

function ErrorMessage({ message }) {
  return <div className={Styles.ErrorMessage}>Oops! {message}</div>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function HomePage() {
  const [trendMovies, setTrendMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTrendMovies() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/trending/movie/day`);
      const data = response.data.results;
      setTrendMovies(data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    fetchTrendMovies();
  }, []);

  return (
    <>
      <Navigation />
      <h1 className={Styles.HomePageHeader}>Trending Movies</h1>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {trendMovies.length === 0 && !isLoading && !error && (
        <p>No trending movies available right now.</p>
      )}
      {trendMovies && <MovieList movies={trendMovies} />}
    </>
  );
}
