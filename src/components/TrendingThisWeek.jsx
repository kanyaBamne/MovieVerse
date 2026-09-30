import { useEffect, useState } from "react";

const checkImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);

        img.src = url;
    });
};

function TrendingThisWeek() {

    const [trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {

        const fetchTrendingMovies = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/movies?page=1&limit=100"
                );

                const data = await response.json();

                const movies = Array.isArray(data)
                    ? data
                    : data.movies || data.data || [];

                // Shuffle all movies
                const shuffledMovies = [...movies].sort(
                    () => Math.random() - 0.5
                );

                const validMovies = [];

                // Check movie posters one by one
                for (const movie of shuffledMovies) {

                    if (validMovies.length >= 12) {
                        break;
                    }

                    if (!movie.poster) {
                        continue;
                    }

                    const posterUrl = movie.poster.startsWith("http")
                        ? movie.poster
                        : `http://localhost:5000${movie.poster}`;

                    const imageWorks = await checkImage(posterUrl);

                    if (imageWorks) {

                        validMovies.push({
                            ...movie,
                            posterUrl,
                        });

                    }
                }

                setTrendingMovies(validMovies);

            } catch (error) {

                console.error(
                    "Error loading trending movies:",
                    error
                );

            }

        };

        fetchTrendingMovies();

    }, []);

    return (
        <section className="trending-section">

            <h2>Trending this week!</h2>

            <div className="trending-row">

                {trendingMovies.map((movie, index) => (

                    <div
                        key={movie._id || movie.id || index}
                        className="trending-card"
                    >

                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                        />

                        <div className="trending-card-info">

                            <h3>{movie.title}</h3>

                            <p>
                                {movie.genre || "Movie"}
                            </p>

                            {movie.Year && (
                                <span>
                                    {movie.Year}
                                </span>
                            )}

                        </div>

                        <button className="trending-watchlist">
                            + Add to Watchlist
                        </button>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default TrendingThisWeek;