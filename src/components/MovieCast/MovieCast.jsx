import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Axios from "axios";
import Styles from "./MovieCast.module.css";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2ViMThmMGU3ZGM1MTkxNTgyOTNkZjc1MTliNTQ4MyIsIm5iZiI6MTczNDMwNTU5OS40MTY5OTk4LCJzdWIiOiI2NzVmNjczZjZmODRhMGNlMDc1ZTk1MzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EGINKZ0yMZM3uLJ-V9I_wNPlec9b7MgH4X7oYcTL5mg",
  },
};

const url = `https://api.themoviedb.org/3/search/movie/`;

export default function MovieCast() {
  const movieId = useOutletContext();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovieCast() {
        try {
          setLoading(true);
          const resault = await Axios.get(url + `${movieId}/credits`, options);
          const data = await resault.data.cast;
          if (data.length === 0) throw new Error("Can not find cast members");
          setCast(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }

      fetchMovieCast();
    },
    [movieId]
  );

  return (
    <>
      {loading && <p>Loading cast members...</p>}
      {error && <p>{error.message}</p>}
      {cast.length > 0 && (
        <ul className={Styles.castList}>
          {cast.map((actor) => (
            <li key={actor.id}>
              <img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={`${actor.name} profile`}
              />
              <p>{actor.name}</p>
              <p>Character: {actor.character}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
