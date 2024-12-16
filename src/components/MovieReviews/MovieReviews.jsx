import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Axios from "axios";
import Styles from "./MovieReviews.module.css";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2ViMThmMGU3ZGM1MTkxNTgyOTNkZjc1MTliNTQ4MyIsIm5iZiI6MTczNDMwNTU5OS40MTY5OTk4LCJzdWIiOiI2NzVmNjczZjZmODRhMGNlMDc1ZTk1MzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EGINKZ0yMZM3uLJ-V9I_wNPlec9b7MgH4X7oYcTL5mg",
  },
};

const url = "<https://api.themoviedb.org/3/movie/";

export default function MovieReviews() {
  const movieId = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    function () {
      async function fetchReviews() {
        try {
          setLoading(true);
          const res = await Axios.get(url + `${movieId}/reviews`, options);
          const data = await res.data;
          if (data.length === 0) throw new Error("Can not find any review");
          setReviews(data.results);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }

      fetchReviews();
    },
    [movieId]
  );

  return (
    <>
      {loading && <p>Loading reviews...</p>}
      {error && <p>{error.message}</p>}
      {reviews.length > 0 && (
        <ul className={Styles.reviewList}>
          {reviews.map((review) => (
            <li key={review.id}>
              <h2>Author: {review.author}</h2>
              <p>{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
