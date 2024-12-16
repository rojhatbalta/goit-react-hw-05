import { useEffect, useState } from "react";
import Axios from "axios";
import Styles from "./HomePage.module.css";
import Navigation from "../../components/Navigation/Navigation";
import MovieList from "../../components/MovieList/MovieList";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2ViMThmMGU3ZGM1MTkxNTgyOTNkZjc1MTliNTQ4MyIsIm5iZiI6MTczNDMwNTU5OS40MTY5OTk4LCJzdWIiOiI2NzVmNjczZjZmODRhMGNlMDc1ZTk1MzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EGINKZ0yMZM3uLJ-V9I_wNPlec9b7MgH4X7oYcTL5mg",
  },
};

const url =
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";

export default function HomePage() {
  const [trendMovies, setTrendMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTrendMovies() {
    try {
      setIsLoading(true);
      const resault = await Axios.get(url, options);
      const data = resault.data.resaults;
      setTrendMovies(data);
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
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {trendMovies && <MovieList movies={trendMovies} />}
    </>
  );
}
