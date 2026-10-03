import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../MovieDetail.css";

function MovieDetail() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);  

    useEffect(() => {
        fetch(`http://localhost:5000/movies/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load movie");
                }

                return res.json();
            })
            .then((data) => {
                console.log(data);
                setMovie(data.movie);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading movie:", error);
                setLoading(false);
            });
    }, [id]);

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

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user || !user.id) {
            return;
        }

        fetch(`http://localhost:5000/favorites/${user.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load favorites");
                }

                return res.json();
            })
            .then((data) => {

                const favorites = data.favorites || [];

                const alreadyFavorite = favorites.some(
                    (favorite) =>
                        favorite.movieId === id ||
                        favorite.movieId?._id === id ||
                        favorite.movie?._id === id
                );

                setIsFavorite(alreadyFavorite);
            })
            .catch((error) => {
                console.error("Error loading favorites:", error);
            });

    }, [id]);

    const handleFavorite = async () => {

        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user || !user.id) {
            alert("Please sign in to add favorites.");
            return;
        }

        setFavoriteLoading(true);

        try {

            if (!isFavorite) {

                const response = await fetch(
                    "http://localhost:5000/favorites",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            movieId: id
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to add favorite");
                }

                setIsFavorite(true);

            } else {

                const response = await fetch(
                    `http://localhost:5000/favorites/${user.id}/${id}`,
                    {
                        method: "DELETE"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to remove favorite"
                    );
                }

                setIsFavorite(false);
            }

        } catch (error) {

            console.error("Favorite error:", error);
            alert(error.message);

        } finally {

            setFavoriteLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="movie-loading">
                Loading movie...
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-error">
                Movie not found.
            </div>
        );
    }

    const genres = movie.genre
        ? movie.genre.split(",").map((genre) => genre.trim())
        : [];

    const cast = movie.cast
        ? movie.cast.split(",").map((actor) => actor.trim())
        : [];

    return (
        <main className="movie-detail-page">

            {/* Breadcrumb */}
            <div className="movie-breadcrumb">
                Home / Movies / {movie.title}
            </div>


            {/* Hero Section */}
            <section className="movie-hero">

                {/* Blurred Background */}
                <div
                    className="movie-hero-bg"
                    style={{
                        backgroundImage: `url(${movie.poster})`
                    }}
                ></div>

                <div className="movie-hero-overlay"></div>


                <div className="movie-hero-content">

                    {/* Poster */}
                    <div className="movie-poster-wrapper">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="movie-poster"
                        />
                    </div>


                    {/* Movie Information */}
                    <div className="movie-info">

                        <div className="movie-top-meta">
                            {movie.year && <span>{movie.year}</span>}
                            {movie.certificate && (
                                <span>{movie.certificate}</span>
                            )}
                            {movie.duration && (
                                <span>{movie.duration} min</span>
                            )}
                        </div>


                        <h1 className="movie-title">
                            {movie.title}
                        </h1>


                        {/* Genres */}
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


                        {/* Tagline */}
                        <p className="movie-tagline">
                            Your next story begins here.
                        </p>


                        {/* Rating */}
                        <div className="movie-rating">

                            <span className="rating-main">
                                <span className="rating-star">★</span>
                                {movie.rating || "N/A"}
                            </span>

                            <span className="rating-label">
                                Rating
                            </span>

                        </div>


                        {/* Stats */}
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


                        {/* Description */}
                        <p className="movie-description">
                            {movie.description ||
                                "No description available for this movie."}
                        </p>


                        {/* Actions */}
                        <div className="movie-actions">

                            <button className="movie-action-btn primary">
                                ✓ Watched
                            </button>

                            <button
                                className="movie-action-btn secondary"
                                onClick={handleFavorite}
                                disabled={favoriteLoading}
                            >
                                {isFavorite ? "♥ Favorited" : "♡ Favourite"}
                            </button>

                            <button className="movie-action-btn secondary">
                                + Watchlist
                            </button>

                            <button className="movie-action-btn secondary">
                                + Add to List
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* Movie Details */}
            <section className="movie-details-section">

                <h2>Movie Details</h2>

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


            {/* Cast */}
            {cast.length > 0 && (
                <section className="movie-cast-section">

                    <h2>Cast</h2>

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


{/* Reviews */}
<section className="movie-reviews-section">

    <h2>Reviews</h2>

    {reviews.length === 0 ? (

        <div className="reviews-empty-state">
            <h3>No reviews yet.</h3>
            <p>Be the first to review.</p>
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
                                @{review.user.username}
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

{/* Bottom Strip */}
<section className="movie-bottom-strip">
    <div className="movie-bottom-line"></div>
</section>

            {/* Bottom Strip */}
            <section className="movie-bottom-strip">
                <div className="movie-bottom-line"></div>
            </section>

        </main>
    );
}

export default MovieDetail;