import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Axios from "axios";
import PropTypes from "prop-types";
import Styles from "./MovieReviews.module.css";

const api_key = import.meta.env.VITE_API_KEY;

const axiosInstance = Axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: api_key,
  },
});

function Loading() {
  return <p>Loading reviews...</p>;
}

function ErrorMessage({ message }) {
  return <p style={{ color: "red" }}>Oops! {message}</p>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function MovieReviews() {
  const movieId = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/movie/${movieId}/reviews`);
        const data = response.data.results;
        if (!data || data.length === 0) {
          throw new Error("No reviews found for this movie.");
        }
        setReviews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [movieId]);

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {reviews.length > 0 ? (
        <ul className={Styles.reviewList}>
          {reviews.map((review) => (
            <li key={review.id}>
              <h2>Author: {review.author}</h2>
              <p>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No reviews available for this movie.</p>
      )}
    </>
  );
}
