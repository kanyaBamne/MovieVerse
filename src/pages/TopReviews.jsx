import { useEffect, useState } from "react";

function TopReviews() {
    const [topMovie, setTopMovie] = useState(null);
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
                    setTopMovie(
                        data.topReviewedMovies?.[0] || null
                    );

                    setReviewers(
                        (data.popularReviewers || []).slice(0, 5)
                    );
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

                {/* ================================
                    TOP REVIEWS
                ================================= */}

                <div className="top-reviews-main">

                    <h2>TOP REVIEWS</h2>

                    {topMovie ? (
                        <div className="top-review-feature">

                            {/* GREEN PROFILE AREA */}
                            <div className="top-review-profile">

                                <div className="top-review-profile-name">
                                    {topMovie.review?.userName ||
                                        topMovie.review?.username ||
                                        "Unknown User"}
                                </div>

                                <div className="top-review-profile-count">
                                    {topMovie.reviewCount}{" "}
                                    {topMovie.reviewCount === 1
                                        ? "review"
                                        : "reviews"}
                                </div>

                                <div className="top-review-profile-image">
                                    {topMovie.review?.profileImage ? (
                                        <img
                                            src={
                                                topMovie.review
                                                    .profileImage
                                            }
                                            alt={
                                                topMovie.review
                                                    .userName ||
                                                "Reviewer"
                                            }
                                        />
                                    ) : (
                                        <span>
                                            {(
                                                topMovie.review
                                                    ?.userName ||
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="top-review-profile-username">
                                    {topMovie.review?.username ||
                                        topMovie.review?.userName ||
                                        "User"}
                                </div>

                            </div>


                            {/* GREY OVERLAPPING REVIEW AREA */}
                            <div className="top-review-detail">

                                <div className="top-review-detail-content">

                                    <p className="top-review-small-text">
                                        {topMovie.review?.reviewTitle ||
                                            "Movie Review"}
                                    </p>

                                    <p className="top-review-review-text">
                                        {topMovie.review?.reviewText ||
                                            "No review text available."}
                                    </p>

                                    {topMovie.description && (
                                        <p className="top-review-description">
                                            {topMovie.description}
                                        </p>
                                    )}

                                    <div className="top-review-movie-info">

                                        <strong>
                                            Movie: {topMovie.title}
                                        </strong>

                                        <span>
                                            Rating:{" "}
                                            {topMovie.review?.rating ||
                                                topMovie.averageRating ||
                                                "N/A"}
                                        </span>

                                        {topMovie.genre && (
                                            <span>
                                                {topMovie.genre}
                                            </span>
                                        )}

                                        {topMovie.year && (
                                            <span>
                                                {topMovie.year}
                                            </span>
                                        )}

                                        {topMovie.duration && (
                                            <span>
                                                {topMovie.duration} min
                                            </span>
                                        )}

                                    </div>

                                </div>


                                {/* MOVIE POSTER */}
                                <div className="top-review-poster">

                                    {topMovie.poster ? (
                                        <img
                                            src={
                                                topMovie.poster.startsWith(
                                                    "http"
                                                )
                                                    ? topMovie.poster
                                                    : `http://localhost:5000${topMovie.poster}`
                                            }
                                            alt={topMovie.title}
                                        />
                                    ) : (
                                        <div className="poster-placeholder">
                                            No Poster
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>
                    ) : (
                        <p className="top-reviews-empty">
                            No reviews available yet.
                        </p>
                    )}

                </div>


                {/* ================================
                    POPULAR REVIEWERS
                ================================= */}

                <div className="popular-reviewers">

                    <h2>POPULAR REVIEWERS</h2>

                    <div className="popular-reviewers-list">

                        {reviewers.map((reviewer) => (

                            <div
                                className="popular-reviewer"
                                key={reviewer.userId}
                            >

                                <div className="popular-reviewer-avatar">

                                    {reviewer.profileImage ? (
                                        <img
                                            src={
                                                reviewer.profileImage
                                            }
                                            alt={
                                                reviewer.name ||
                                                reviewer.username
                                            }
                                        />
                                    ) : (
                                        <span>
                                            {(
                                                reviewer.name ||
                                                reviewer.username ||
                                                "U"
                                            )
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

                        ))}

                    </div>

                </div>

            </div>

        </section>
    );
}

export default TopReviews;