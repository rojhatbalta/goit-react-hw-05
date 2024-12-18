import { useState, useEffect, useRef } from "react";
import { useParams, Link, NavLink, Outlet, useLocation } from "react-router";
import Axios from "axios";
import PropTypes from "prop-types";
import Styles from "./MovieDetailsPage.module.css";

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
          const response = await axiosInstance.get(`/movie/${movieId}`);
          setMovieDetails(response.data);
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
      <Link to={backLinkRef.current} className={Styles.BackLink}>
        Go back
      </Link>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {movieDetails && (
        <div className={Styles.container}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`}
            alt={`${movieDetails.title} poster`}
          />
          <div>
            <h2>{movieDetails.title}</h2>
            <p>Score: {movieDetails.vote_average?.toFixed(2) || "N/A"}</p>
            <h3>Overview</h3>
            <p>{movieDetails.overview || "No overview available."}</p>
            <h3>Genres</h3>
            <p>
              {movieDetails.genres?.map((g) => g.name).join(", ") ||
                "No genres available."}
            </p>
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
