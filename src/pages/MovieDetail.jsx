import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../MovieDetail.css";
import Footer from "../components/Footer";
import PageNavigation from "../components/PageNavigation";

function MovieDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    const [isWatched, setIsWatched] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // ==========================================
    // ADD TO LIST STATES
    // ==========================================

    const [showListModal, setShowListModal] = useState(false);
    const [userLists, setUserLists] = useState([]);

    // ==========================================
    // LOAD MOVIE
    // ==========================================

    useEffect(() => {
        fetch(`http://localhost:5000/movies/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load movie");
                }

                return res.json();
            })
            .then((data) => {
                setMovie(data.movie);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading movie:", error);
                setLoading(false);
            });
    }, [id]);

    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    useEffect(() => {
        fetch(`http://localhost:5000/reviews/movie/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load reviews");
                }

                return res.json();
            })
            .then((data) => {
                setReviews(data.reviews || []);
            })
            .catch((error) => {
                console.error("Error loading reviews:", error);
                setReviews([]);
            });
    }, [id]);

    // ==========================================
    // CHECK WATCHED MOVIE
    // ==========================================

    useEffect(() => {
        const checkWatched = async () => {
            try {
                const storedUser =
                    sessionStorage.getItem("user");

                if (!storedUser) {
                    return;
                }

                const loggedInUser =
                    JSON.parse(storedUser);

                const userId =
                    loggedInUser.id ||
                    loggedInUser._id;

                if (!userId) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/watchedMovies/${userId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    return;
                }

                const watchedMovies =
                    data.watchedMovies || [];

                const alreadyWatched =
                    watchedMovies.some(
                        (item) =>
                            item.movieId?.toString() === id ||
                            item.movie?._id?.toString() === id
                    );

                setIsWatched(alreadyWatched);
            } catch (error) {
                console.error(
                    "Check watched error:",
                    error
                );
            }
        };

        checkWatched();
    }, [id]);

    // ==========================================
    // ADD / REMOVE WATCHED
    // ==========================================

    const handleWatched = async () => {
        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/watchedMovies",
                {
                    method: isWatched
                        ? "DELETE"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId,
                        movieId: id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Something went wrong."
                );
                return;
            }

            setIsWatched(!isWatched);

            alert(
                isWatched
                    ? "Movie removed from watched!"
                    : "Movie marked as watched!"
            );
        } catch (error) {
            console.error(
                "Watched movie error:",
                error
            );

            alert(
                "Error: " +
                error.message
            );
        }
    };

    // ==========================================
    // ADD TO WATCHLIST
    // ==========================================

    const handleWatchlist = async () => {
        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

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
                        movieId: id
                    })
                }
            );

            const data = await response.json();

            // ==================================
            // ALREADY IN WATCHLIST
            // ==================================

            if (
                !response.ok &&
                data.message ===
                    "Movie is already in watchlist"
            ) {
                alert(
                    "Movie is already in your watchlist."
                );

                navigate(
                    "/profile?tab=watchlist"
                );

                return;
            }

            // ==================================
            // OTHER ERROR
            // ==================================

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add movie to watchlist."
                );

                return;
            }

            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "Movie added to your watchlist!"
            );

            navigate(
                "/profile?tab=watchlist"
            );
        } catch (error) {
            console.error(
                "Watchlist error:",
                error
            );

            alert(
                error.message ||
                "Failed to add movie to watchlist."
            );
        }
    };

    // ==========================================
    // OPEN ADD TO LIST MODAL
    // ==========================================

    const handleOpenListModal = async () => {
        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            const response = await fetch(
                `http://localhost:5000/userlists/${userId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load lists"
                );
            }

            setUserLists(data.lists || []);
            setShowListModal(true);
        } catch (error) {
            console.error(
                "Load lists error:",
                error
            );

            alert(
                error.message ||
                "Failed to load your lists."
            );
        }
    };

    // ==========================================
    // ADD MOVIE TO LIST
    // ==========================================

    const handleAddToList = async (listId) => {
        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            const response = await fetch(
                `http://localhost:5000/userlists/${listId}/movies`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId,
                        movieId: id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add movie to list."
                );

                return;
            }

            alert(
                "Movie added to your list!"
            );

            setShowListModal(false);
        } catch (error) {
            console.error(
                "Add to list error:",
                error
            );

            alert(
                error.message ||
                "Failed to add movie to list."
            );
        }
    };

    // ==========================================
    // SUBMIT REVIEW
    // ==========================================

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            if (reviewRating === 0) {
                alert(
                    "Please select a rating."
                );
                return;
            }

            setSubmittingReview(true);

            const response = await fetch(
                "http://localhost:5000/reviews",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId,
                        movieId: id,
                        rating: reviewRating,
                        reviewTitle: reviewTitle,
                        reviewText: reviewText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add review"
                );

                return;
            }

            alert(
                "Review added successfully!"
            );

            setReviewRating(0);
            setReviewTitle("");
            setReviewText("");
            setShowReviewForm(false);

            // Reload reviews
            const reviewsResponse =
                await fetch(
                    `http://localhost:5000/reviews/movie/${id}`
                );

            const reviewsData =
                await reviewsResponse.json();

            setReviews(
                reviewsData.reviews || []
            );
        } catch (error) {
            console.error(
                "Submit review error:",
                error
            );

            alert(
                "Unable to submit review."
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    // ==========================================
    // CHECK FAVORITE
    // ==========================================

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const storedUser =
                    sessionStorage.getItem("user");

                if (!storedUser) {
                    return;
                }

                const user =
                    JSON.parse(storedUser);

                const userId =
                    user.id ||
                    user._id;

                if (!userId) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/favorites/${userId}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load favorites"
                    );
                }

                const data =
                    await response.json();

                const favorites =
                    data.favorites || [];

                const alreadyFavorite =
                    favorites.some(
                        (favorite) =>
                            favorite.movieId?.toString() === id ||
                            favorite.movieId?._id?.toString() === id ||
                            favorite.movie?._id?.toString() === id
                    );

                setIsFavorite(
                    alreadyFavorite
                );
            } catch (error) {
                console.error(
                    "Error loading favorites:",
                    error
                );
            }
        };

        checkFavorite();
    }, [id]);

    // ==========================================
    // ADD / REMOVE FAVORITE
    // ==========================================

    const handleFavorite = async () => {
        const storedUser =
            sessionStorage.getItem("user");

        if (!storedUser) {
            alert(
                "Please sign in to add favorites."
            );

            return;
        }

        const user =
            JSON.parse(storedUser);

        const userId =
            user.id ||
            user._id;

        if (!userId) {
            alert(
                "User ID not found. Please login again."
            );

            return;
        }

        setFavoriteLoading(true);

        try {
            if (!isFavorite) {
                // ADD FAVORITE

                const response =
                    await fetch(
                        "http://localhost:5000/favorites",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                userId: userId,
                                movieId: id
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to add favorite"
                    );
                }

                setIsFavorite(true);
            } else {
                // REMOVE FAVORITE

                const response =
                    await fetch(
                        `http://localhost:5000/favorites/${userId}/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to remove favorite"
                    );
                }

                setIsFavorite(false);
            }
        } catch (error) {
            console.error(
                "Favorite error:",
                error
            );

            alert(error.message);
        } finally {
            setFavoriteLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="movie-loading">
                Loading movie...
            </div>
        );
    }

    // ==========================================
    // MOVIE NOT FOUND
    // ==========================================

    if (!movie) {
        return (
            <div className="movie-error">
                Movie not found.
            </div>
        );
    }

    const genres = movie.genre
        ? movie.genre
              .split(",")
              .map((genre) => genre.trim())
        : [];

    const cast = movie.cast
        ? movie.cast
              .split(",")
              .map((actor) => actor.trim())
        : [];

    return (
        <main className="movie-detail-page">

            <PageNavigation/>

            {/* =====================================
                BREADCRUMB
            ====================================== */}

            <div className="movie-breadcrumb">
                Home / Movies / {movie.title}
            </div>

            {/* =====================================
                HERO SECTION
            ====================================== */}

            <section className="movie-hero">

                <div
                    className="movie-hero-bg"
                    style={{
                        backgroundImage:
                            `url(${movie.poster})`
                    }}
                />

                <div className="movie-hero-overlay" />

                <div className="movie-hero-content">

                    {/* POSTER */}

                    <div className="movie-poster-wrapper">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="movie-poster"
                        />
                    </div>

                    {/* MOVIE INFORMATION */}

                    <div className="movie-info">

                        <div className="movie-top-meta">

                            {movie.year && (
                                <span>
                                    {movie.year}
                                </span>
                            )}

                            {movie.certificate && (
                                <span>
                                    {movie.certificate}
                                </span>
                            )}

                            {movie.duration && (
                                <span>
                                    {movie.duration} min
                                </span>
                            )}

                        </div>

                        <h1 className="movie-title">
                            {movie.title}
                        </h1>

                        {/* GENRES */}

                        <div className="movie-genres">
                            {genres.map((genre) => (
                                <span
                                    className="genre-pill"
                                    key={genre}
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* TAGLINE */}

                        <p className="movie-tagline">
                            Your next story begins here.
                        </p>

                        {/* RATING */}

                        <div className="movie-rating">

                            <span className="rating-main">
                                <span className="rating-star">
                                    ★
                                </span>

                                {movie.rating || "N/A"}
                            </span>

                            <span className="rating-label">
                                Rating
                            </span>

                        </div>

                        {/* STATS */}

                        <div className="movie-stats">

                            <div className="movie-stat">

                                <span className="movie-stat-label">
                                    Metascore
                                </span>

                                <span className="movie-stat-value">
                                    {movie.metascore || "N/A"}
                                </span>

                            </div>

                            <div className="movie-stat">

                                <span className="movie-stat-label">
                                    Votes
                                </span>

                                <span className="movie-stat-value">
                                    {movie.votes || "N/A"}
                                </span>

                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="movie-description">
                            {movie.description ||
                                "No description available for this movie."}
                        </p>

                        {/* ACTIONS */}

                        <div className="movie-actions">

                            {/* WATCHED */}

                            <button
                                className="movie-action-btn primary"
                                onClick={handleWatched}
                            >
                                {isWatched
                                    ? "✓ Watched"
                                    : "Mark as Watched"}
                            </button>

                            {/* FAVORITE */}

                            <button
                                className="movie-action-btn secondary"
                                onClick={handleFavorite}
                                disabled={favoriteLoading}
                            >
                                {isFavorite
                                    ? "♥ Favorited"
                                    : "♡ Favourite"}
                            </button>

                            {/* WATCHLIST */}

                            <button
                                className="movie-action-btn secondary"
                                onClick={handleWatchlist}
                            >
                                + Watchlist
                            </button>

                            {/* ADD TO LIST */}

                            <button
                                className="movie-action-btn secondary"
                                onClick={handleOpenListModal}
                            >
                                + Add to List
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================
                MOVIE DETAILS
            ====================================== */}

            <section className="movie-details-section">

                <h2>
                    Movie Details
                </h2>

                <div className="movie-details-grid">

                    <div className="movie-detail-item">

                        <span className="movie-detail-label">
                            Director
                        </span>

                        <span className="movie-detail-value">
                            {movie.director || "N/A"}
                        </span>

                    </div>

                    <div className="movie-detail-item">

                        <span className="movie-detail-label">
                            Year
                        </span>

                        <span className="movie-detail-value">
                            {movie.year || "N/A"}
                        </span>

                    </div>

                    <div className="movie-detail-item">

                        <span className="movie-detail-label">
                            Certificate
                        </span>

                        <span className="movie-detail-value">
                            {movie.certificate || "N/A"}
                        </span>

                    </div>

                    <div className="movie-detail-item">

                        <span className="movie-detail-label">
                            Duration
                        </span>

                        <span className="movie-detail-value">
                            {movie.duration
                                ? `${movie.duration} min`
                                : "N/A"}
                        </span>

                    </div>

                </div>

            </section>

            {/* =====================================
                CAST
            ====================================== */}

            {cast.length > 0 && (
                <section className="movie-cast-section">

                    <h2>
                        Cast
                    </h2>

                    <div className="movie-cast-grid">

                        {cast.map((actor) => (
                            <div
                                className="cast-card"
                                key={actor}
                            >

                                <div className="cast-initial">
                                    {actor.charAt(0)}
                                </div>

                                <span className="cast-name">
                                    {actor}
                                </span>

                            </div>
                        ))}

                    </div>

                </section>
            )}

            {/* =====================================
                REVIEWS
            ====================================== */}

            <section className="movie-reviews-section">

                <div className="reviews-heading">

                    <h2>
                        Reviews
                    </h2>

                    <button
                        className="add-review-btn"
                        onClick={() => {

                            const storedUser =
                                sessionStorage.getItem("user");

                            if (!storedUser) {
                                alert(
                                    "Please sign in first."
                                );

                                return;
                            }

                            const loggedInUser =
                                JSON.parse(storedUser);

                            const userId =
                                loggedInUser.id ||
                                loggedInUser._id;

                            if (!userId) {
                                alert(
                                    "User ID not found. Please login again."
                                );

                                return;
                            }

                            setShowReviewForm(true);
                        }}
                    >
                        + Add a Review
                    </button>

                </div>

                {/* REVIEW FORM */}

                {showReviewForm && (
                    <form
                        className="review-form"
                        onSubmit={handleSubmitReview}
                    >

                        <h3>
                            Write a Review
                        </h3>

                        <div className="review-form-group">

                            <label>
                                Your Rating
                            </label>

                            <div className="review-stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className={
                                                star <= reviewRating
                                                    ? "review-star selected"
                                                    : "review-star"
                                            }
                                            onClick={() =>
                                                setReviewRating(
                                                    star
                                                )
                                            }
                                        >
                                            ★
                                        </button>
                                    )
                                )}

                            </div>

                        </div>

                        <div className="review-form-group">

                            <label htmlFor="reviewTitle">
                                Review Title
                            </label>

                            <input
                                id="reviewTitle"
                                type="text"
                                placeholder="Give your review a title"
                                value={reviewTitle}
                                onChange={(e) =>
                                    setReviewTitle(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="review-form-group">

                            <label htmlFor="reviewText">
                                Your Review
                            </label>

                            <textarea
                                id="reviewText"
                                placeholder="What did you think about this movie?"
                                value={reviewText}
                                onChange={(e) =>
                                    setReviewText(
                                        e.target.value
                                    )
                                }
                                rows="5"
                            />

                        </div>

                        <div className="review-form-actions">

                            <button
                                type="button"
                                className="review-cancel-btn"
                                onClick={() => {

                                    setShowReviewForm(false);
                                    setReviewRating(0);
                                    setReviewTitle("");
                                    setReviewText("");

                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="review-submit-btn"
                                disabled={submittingReview}
                            >
                                {submittingReview
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </div>

                    </form>
                )}

                {/* EXISTING REVIEWS */}

                {reviews.length === 0 ? (
                    <div className="reviews-empty-state">

                        <h3>
                            No reviews yet.
                        </h3>

                        <p>
                            Be the first to review.
                        </p>

                    </div>
                ) : (
                    <div className="movie-reviews-list">

                        {reviews.map((review) => (
                            <div
                                className="movie-review-card"
                                key={review.id}
                            >

                                <div className="movie-review-header">

                                    <div>

                                        <span className="movie-review-user">
                                            @{review.user?.username || "user"}
                                        </span>

                                        {review.createdAt && (
                                            <span className="movie-review-date">
                                                {new Date(
                                                    review.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        )}

                                    </div>

                                    <span className="movie-review-rating">
                                        ★ {review.rating}
                                    </span>

                                </div>

                                {review.reviewTitle && (
                                    <h3 className="movie-review-title">
                                        {review.reviewTitle}
                                    </h3>
                                )}

                                {review.reviewText && (
                                    <p className="movie-review-text">
                                        {review.reviewText}
                                    </p>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </section>

            {/* =====================================
                ADD TO LIST MODAL
            ====================================== */}

            {showListModal && (
                <div className="movie-list-modal-overlay">

                    <div className="movie-list-modal">

                        <div className="movie-list-modal-header">

                            <h2>
                                Add to List
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowListModal(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        {userLists.length === 0 ? (
                            <div className="movie-list-empty">

                                <p>
                                    You don't have any lists yet.
                                </p>

                                <p>
                                    Create a list from Profile → Lists.
                                </p>

                            </div>
                        ) : (
                            <div className="movie-list-options">

                                {userLists.map((list) => (
                                    <button
                                        key={list.id}
                                        className="movie-list-option"
                                        onClick={() =>
                                            handleAddToList(
                                                list.id
                                            )
                                        }
                                    >

                                        <div>

                                            <h3>
                                                {list.title}
                                            </h3>

                                            <p>
                                                {list.movieCount} films
                                            </p>

                                        </div>

                                        <span>
                                            →
                                        </span>

                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                </div>
            )}

            {/* =====================================
                BOTTOM STRIP
            ====================================== */}

            <section className="movie-bottom-strip">

                <div className="movie-bottom-line">
                </div>

            </section>

            <Footer/>

        </main>
    );
}

export default MovieDetail;