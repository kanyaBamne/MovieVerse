import { useEffect, useState } from "react";

function TopReviews() {
    const [topMovies, setTopMovies] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTopReviews = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/top-reviews"
                );

                const data = await response.json();

                if (response.ok) {
                    setTopMovies(data.topReviewedMovies || []);
                    setReviewers(data.popularReviewers || []);
                }
            } catch (error) {
                console.error(
                    "Failed to load top reviews:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadTopReviews();
    }, []);

    if (loading) {
        return (
            <section className="top-reviews-section">
                <p className="top-reviews-loading">
                    Loading...
                </p>
            </section>
        );
    }

    return (
        <section className="top-reviews-section">

            <div className="top-reviews-wrapper">

                {/* TOP REVIEWS */}

                <div className="top-reviews-main">

                    <h2>TOP REVIEWS</h2>

                    {topMovies.length === 0 ? (
                        <p className="top-reviews-empty">
                            No reviews available yet.
                        </p>
                    ) : (

                        topMovies.map((movie) => {

                            const review = movie.review;

                            return (
                                <div
                                    className="top-review-card"
                                    key={movie.movieId}
                                >

                                    {/* Reviewer */}

                                    <div className="top-review-user">

                                        <div className="top-review-avatar">

                                            {review?.profileImage ? (
                                                <img
                                                    src={review.profileImage}
                                                    alt={
                                                        review.userName ||
                                                        "Reviewer"
                                                    }
                                                />
                                            ) : (
                                                <span>
                                                    {(review?.userName ||
                                                        "U")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}

                                        </div>

                                        <div className="top-review-user-info">

                                            <h3>
                                                {review?.userName ||
                                                    "Unknown User"}
                                            </h3>

                                            <p>
                                                {movie.reviewCount}{" "}
                                                {movie.reviewCount === 1
                                                    ? "review"
                                                    : "reviews"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Review */}

                                    <div className="top-review-text">

                                        <div className="top-review-rating">
                                            ★ {review?.rating || movie.averageRating}
                                        </div>

                                        <h4>
                                            {review?.reviewTitle ||
                                                "Movie Review"}
                                        </h4>

                                        <p>
                                            {review?.reviewText ||
                                                "No review text available."}
                                        </p>

                                        <span>
                                            {movie.title}
                                        </span>

                                    </div>


                                    {/* Movie poster */}

                                    <div className="top-review-movie">

                                        {movie.poster ? (

                                            <img
                                                src={
                                                    movie.poster.startsWith(
                                                        "http"
                                                    )
                                                        ? movie.poster
                                                        : `http://localhost:5000${movie.poster}`
                                                }
                                                alt={movie.title}
                                            />

                                        ) : (

                                            <div className="top-review-movie-placeholder">
                                                🎬
                                            </div>

                                        )}

                                    </div>

                                </div>
                            );
                        })

                    )}

                </div>


                {/* POPULAR REVIEWERS */}

                <div className="popular-reviewers">

                    <h2>POPULAR REVIEWERS</h2>

                    <div className="popular-reviewers-list">

                        {reviewers.length === 0 ? (

                            <p className="top-reviews-empty">
                                No reviewers available yet.
                            </p>

                        ) : (

                            reviewers.map((reviewer) => (

                                <div
                                    className="popular-reviewer"
                                    key={reviewer.userId}
                                >

                                    <div className="popular-reviewer-avatar">

                                        {reviewer.profileImage ? (

                                            <img
                                                src={reviewer.profileImage}
                                                alt={
                                                    reviewer.name ||
                                                    reviewer.username
                                                }
                                            />

                                        ) : (

                                            <span>
                                                {(reviewer.name ||
                                                    reviewer.username ||
                                                    "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>

                                        )}

                                    </div>

                                    <div className="popular-reviewer-info">

                                        <h3>
                                            {reviewer.name ||
                                                reviewer.username}
                                        </h3>

                                        <p>
                                            {reviewer.reviewCount}{" "}
                                            {reviewer.reviewCount === 1
                                                ? "review"
                                                : "reviews"}
                                        </p>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>

        </section>
    );
}

export default TopReviews;