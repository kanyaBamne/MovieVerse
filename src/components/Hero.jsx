import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const checkImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

function Hero() {
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/movies?page=1&limit=100"
                );

                const data = await response.json();

                const allMovies = Array.isArray(data)
                    ? data
                    : data.movies || data.data || [];

                const shuffledMovies = [...allMovies].sort(
                    () => Math.random() - 0.5
                );

                const validMovies = [];

                for (const movie of shuffledMovies) {
                    if (validMovies.length >= 5) break;
                    if (!movie.poster) continue;

                    let posterUrl = movie.poster.startsWith("http")
                        ? movie.poster
                        : `http://localhost:5000${movie.poster}`;

                    if (posterUrl.includes("m.media-amazon.com")) {
                        posterUrl = posterUrl.replace(
                            /\._V1_.*(?=\.(jpg|jpeg|png))/i,
                            ""
                        );
                    }

                    const imageWorks = await checkImage(posterUrl);

                    if (imageWorks) {
                        validMovies.push({
                            ...movie,
                            posterUrl,
                        });
                    }
                }

                setMovies(validMovies);
                setCurrentIndex(0);
            } catch (error) {
                console.error("Failed to load hero movies:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    useEffect(() => {
        if (movies.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((previousIndex) =>
                (previousIndex + 1) % movies.length
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [movies]);

    // ==============================
    // ADD TO WATCHLIST
    // ==============================
    const handleWatchlist = async () => {
        try {
            const storedUser = sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser = JSON.parse(storedUser);

            const userId =
                loggedInUser.id || loggedInUser._id;

            if (!userId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const movieId =
                movies[currentIndex].id ||
                movies[currentIndex]._id;

            if (!movieId) {
                alert("Movie ID not found.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/watchlist",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        movieId: movieId,
                    }),
                }
            );

            const data = await response.json();

            // Movie already exists
            if (
                !response.ok &&
                data.message === "Movie is already in watchlist"
            ) {
                alert("Movie is already in your watchlist.");

                navigate("/profile?tab=watchlist");

                return;
            }

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add movie to watchlist."
                );
                return;
            }

            alert("Movie added to your watchlist!");

            navigate("/profile?tab=watchlist");

        } catch (error) {
            console.error("Watchlist error:", error);

            alert(
                error.message ||
                "Failed to add movie to watchlist."
            );
        }
    };

    if (loading) {
        return (
            <section className="hero-section hero-loading">
                <p>Loading...</p>
            </section>
        );
    }

    if (movies.length === 0) {
        return (
            <section className="hero-section hero-empty">
                <p>No movies available.</p>
            </section>
        );
    }

    const movie = movies[currentIndex];

    return (
        <section className="hero-section">
            <img
                src={movie.posterUrl}
                alt={movie.title}
                className="hero-image"
            />

            <div className="hero-overlay">
                <div className="hero-movie-info">
                    <h1>{movie.title}</h1>

                    <p>
                        {movie.genre || "Movie"}
                    </p>

                    <button onClick={handleWatchlist}>
                        Add to Watchlist
                    </button>
                </div>
            </div>

            <div className="hero-dots">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        className={
                            index === currentIndex
                                ? "hero-dot active"
                                : "hero-dot"
                        }
                        onClick={() =>
                            setCurrentIndex(index)
                        }
                    />
                ))}
            </div>
        </section>
    );
}

export default Hero;