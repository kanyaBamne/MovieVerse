import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function LatestReviews() {

    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reviewContainer = useRef(null);

    // ==========================================
    // FETCH LATEST REVIEWS
    // ==========================================

    const fetchReviews = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/reviews/latest"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch reviews"
                );

            }

            const data = await response.json();

            setReviews(data.reviews || []);

        } catch (error) {

            console.error(
                "Reviews error:",
                error
            );

            setError(
                "Unable to load reviews."
            );

            setReviews([]);

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    useEffect(() => {

        fetchReviews();

    }, []);

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    useEffect(() => {

        if (reviews.length === 0) {
            return;
        }

        const container =
            reviewContainer.current;

        if (!container) {
            return;
        }

        const scrollReviews = () => {

            container.scrollLeft += 1;

            if (
                container.scrollLeft +
                container.clientWidth >=
                container.scrollWidth
            ) {

                container.scrollLeft = 0;

            }

        };

        const interval = setInterval(
            scrollReviews,
            30
        );

        return () => {

            clearInterval(interval);

        };

    }, [reviews]);

    // ==========================================
    // ADD MOVIE TO WATCHLIST
    // ==========================================

    const addToWatchlist = async (movieId) => {

        try {

            // Get logged-in user
            const storedUser =
                sessionStorage.getItem("user");

            // User not logged in
            if (!storedUser) {

                alert(
                    "Please login first."
                );

                navigate("/login");

                return;

            }

            // Get user data
            const loggedInUser =
                JSON.parse(storedUser);

            // Login response uses "id"
            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            console.log(
                "========== ADD TO WATCHLIST =========="
            );

            console.log(
                "Logged-in User:",
                loggedInUser
            );

            console.log(
                "Logged-in User ID:",
                userId
            );

            console.log(
                "Movie ID:",
                movieId
            );

            // Check user ID
            if (!userId) {

                alert(
                    "Logged-in user ID is missing."
                );

                return;

            }

            // Check movie ID
            if (!movieId) {

                alert(
                    "Movie ID is missing."
                );

                return;

            }

            // Send to backend
            const response = await fetch(
                "http://localhost:5000/watchlist",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId: userId,

                        movieId: movieId

                    })

                }
            );

            const data =
                await response.json();

            console.log(
                "Watchlist backend response:",
                data
            );

            if (data.success) {

                alert(
                    "Movie added to watchlist!"
                );

            } else {

                alert(
                    data.message ||
                    "Failed to add movie to watchlist."
                );

            }

        } catch (error) {

            console.error(
                "Add to watchlist error:",
                error
            );

            alert(
                "Something went wrong while adding the movie."
            );

        }

    };

    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="latest-reviews-box">

            {/* TITLE */}

            <h2>
                Latest Reviews
            </h2>

            {/* LOADING */}

            {loading && (

                <div className="reviews-loading">

                    Loading latest reviews...

                </div>

            )}

            {/* ERROR */}

            {error && (

                <div className="reviews-error">

                    {error}

                </div>

            )}

            {/* EMPTY */}

            {!loading &&
                !error &&
                reviews.length === 0 && (

                    <div className="latest-reviews-empty">

                        No latest reviews available yet.

                    </div>

                )}

            {/* REVIEWS */}

            {!loading &&
                !error &&
                reviews.length > 0 && (

                    <div
                        className="latest-review-container"
                        ref={reviewContainer}
                    >

                        <div className="latest-review-items">

                            {reviews.map((review) => (

                                <div
                                    className="review-card"
                                    key={review.id}
                                >

                                    {/* MOVIE POSTER */}

                                    <img
                                        src={review.movie.poster}
                                        alt={review.movie.title}
                                        onClick={() =>
                                            navigate(
                                                `/movies/${review.movie.id}`
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onError={(e) => {

                                            e.target.src =
                                                "https://via.placeholder.com/150x220?text=No+Poster";

                                        }}
                                    />

                                    {/* HOVER DETAILS */}

                                    <div className="review-hover-details">

                                        <h3>
                                            {review.movie.title}
                                        </h3>

                                        <p className="review-title">
                                            {review.reviewTitle}
                                        </p>

                                        <p className="review-rating">
                                            ⭐ {review.rating}
                                        </p>

                                        <p className="review-user">
                                            @{review.user.username}
                                        </p>

                                        {/* ADD TO WATCHLIST */}

                                        <button
                                            className="watchlist-button"
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                addToWatchlist(
                                                    review.movie.id
                                                );

                                            }}
                                        >
                                            + Add to Watchlist
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

        </div>

    );

}

export default LatestReviews;