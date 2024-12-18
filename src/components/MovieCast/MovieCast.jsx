import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Axios from "axios";
import PropTypes from "prop-types";
import Styles from "./MovieCast.module.css";

const api_key = import.meta.env.VITE_API_KEY;

const axiosInstance = Axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: api_key,
  },
});

function Loading() {
  return <p>Loading cast members...</p>;
}

function ErrorMessage({ message }) {
  return <p style={{ color: "red" }}>Oops! {message}</p>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function MovieCast() {
  const movieId = useOutletContext();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovieCast() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/movie/${movieId}/credits`);
        const data = response.data.cast;
        if (!data || data.length === 0) {
          throw new Error("No cast members found for this movie.");
        }
        setCast(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieCast();
  }, [movieId]);

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {cast.length > 0 ? (
        <ul className={Styles.castList}>
          {cast.map((actor) => (
            <li key={actor.id}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={`${actor.name} profile`}
              />
              <p>{actor.name}</p>
              <p>Character: {actor.character}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No cast members to display.</p>
      )}
    </>
  );
}
