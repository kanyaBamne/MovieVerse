import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TrendingThisWeek() {

    const navigate = useNavigate();

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


                // Select 12 movies
                const selectedMovies = shuffledMovies
                    .filter((movie) => movie.poster)
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
                                zIndex: 10
                            }}
                        />


                        <div className="trending-card-info">

                            <h3>
                                {movie.title}
                            </h3>

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