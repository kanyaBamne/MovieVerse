import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TrendingThisWeek() {

    const navigate = useNavigate();

    const [trendingMovies, setTrendingMovies] = useState([]);

    const handleWatchlist = async (movie) => {
        try {
            const storedUser = sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please sign in first.");
                return;
            }

            const loggedInUser = JSON.parse(storedUser);

            const userId = loggedInUser.id || loggedInUser._id;

            if (!userId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const movieId = movie.id || movie._id;

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
                        userId,
                        movieId,
                    }),
                }
            );

            const data = await response.json();

            if (
                !response.ok &&
                data.message === "Movie is already in watchlist"
            ) {
                alert("Movie is already in your watchlist.");
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

        } catch (error) {
            console.error("Watchlist error:", error);

            alert(
                error.message ||
                "Failed to add movie to your watchlist."
            );
        }
    };


    useEffect(() => {

        const fetchTrendingMovies = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/movies?page=1&limit=8000"
                );

                const data = await response.json();

                const movies = Array.isArray(data)
                    ? data
                    : data.movies || data.data || [];


                // Select the highest-rated movies
            const selectedMovies = [...movies]
                .filter((movie) => movie.poster)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 12)
                .map((movie) => ({
                    ...movie,
                    posterUrl: movie.poster.startsWith("http")
                        ? movie.poster
                        : `http://localhost:5000${movie.poster}`
                }));


                setTrendingMovies(selectedMovies);


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
                            onClick={() =>
                                navigate(
                                    `/movies/${movie.id}`
                                )
                            }
                            style={{
                                cursor: "pointer",
                                position: "relative",
                            }}
                        />


                        <div className="trending-card-info">

                            <h3>
                                {movie.title}
                            </h3>

                            <p>
                                {movie.genre || "Movie"}
                            </p>

                            {movie.year && (
                                <span>
                                    {movie.year}
                                </span>
                            )}

                        </div>


                        <button
                            className="trending-watchlist"
                            onClick={() => handleWatchlist(movie)}
                        >
                            + Add to Watchlist
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

}


export default TrendingThisWeek;