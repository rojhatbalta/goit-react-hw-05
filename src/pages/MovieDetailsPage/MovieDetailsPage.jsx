import { useState, useEffect, useRef } from "react";
import { useParams, Link, NavLink, Outlet, useLocation } from "react-router";
import Axios from "axios";
import Styles from "./MovieDetailsPage.module.css";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2ViMThmMGU3ZGM1MTkxNTgyOTNkZjc1MTliNTQ4MyIsIm5iZiI6MTczNDMwNTU5OS40MTY5OTk4LCJzdWIiOiI2NzVmNjczZjZmODRhMGNlMDc1ZTk1MzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EGINKZ0yMZM3uLJ-V9I_wNPlec9b7MgH4X7oYcTL5mg",
  },
};

const url = "<https://api.themoviedb.org/3/search/movie/";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const backLinkRef = useRef(location.state?.from ?? "/movies");

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          setLoading(true);
          const res = await Axios.get(url + `${movieId}`, options);
          const data = await res.data;
          setMovieDetails(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }

      fetchMovieDetails();
    },
    [movieId]
  );

  return (
    <>
      <Link to={backLinkRef.current}>Go back</Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {movieDetails && (
        <div className={Styles.container}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`}
            alt={`${movieDetails.title} poster`}
          />
          <div>
            <h2>{movieDetails.title}</h2>
            <p>Score: {movieDetails.vote_average.toFixed(2)}</p>
            <h3>Overview</h3>
            <p>{movieDetails.overview}</p>
            <h3>Genres</h3>
            <p>{movieDetails.genres.map((g) => g.name + ", ")}</p>
            <nav className={Styles.nav}>
              <NavLink to="cast">Cast</NavLink>
              <NavLink to="reviews">Reviews</NavLink>
            </nav>
          </div>
        </div>
      )}
      <Outlet context={movieId} />
    </>
  );
}
