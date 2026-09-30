import { useEffect, useState } from "react";
import "../MovieRoulette.css";


function MovieRoulette() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [randomMovie, setRandomMovie] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get movies from our MovieVerse backend
    useEffect(() => {
        fetch("http://localhost:5000/movies?limit=10000")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load movies");
                }

                return res.json();
            })
            .then((data) => {
                console.log(data);

                const movieData = data.movies || [];

                setMovies(movieData);

                // Get all unique genres
                const allGenres = movieData
                    .flatMap((movie) =>
                        movie.genre
                            ? movie.genre.split(",").map((genre) => genre.trim())
                            : []
                    )
                    .filter(Boolean);

                setGenres([...new Set(allGenres)].sort());

                // Get all unique years
                const allYears = movieData
                    .map((movie) => movie.year)
                    .filter(Boolean);

                setYears(
                    [...new Set(allYears)]
                        .sort((a, b) => b - a)
                );

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading movies:", error);
                setError("Unable to load movies.");
                setLoading(false);
            });
    }, []);

    const findMovie = () => {
        const matchingMovies = movies.filter((movie) => {
            const movieGenres = movie.genre
                ? movie.genre.split(",").map((genre) => genre.trim())
                : [];

            const genreMatches =
                !selectedGenre || movieGenres.includes(selectedGenre);

            const yearMatches =
                !selectedYear ||
                String(movie.year) === String(selectedYear);

            return genreMatches && yearMatches;
        });

        if (matchingMovies.length === 0) {
            setRandomMovie(null);
            return;
        }

        const randomIndex = Math.floor(
            Math.random() * matchingMovies.length
        );

        setRandomMovie(matchingMovies[randomIndex]);
    };

    if (loading) {
        return (
            <div className="roulette-loading">
                Loading Movie Roulette...
            </div>
        );
    }

    if (error) {
        return (
            <div className="roulette-error">
                {error}
            </div>
        );
    }

    return (
        <div className="roulette-page">

            {/* Header */}
            <header className="roulette-header">
                <h1>Movie Roulette</h1>
                <p>Find something to watch.</p>
            </header>


            {/* Selection Card */}
            <div className="roulette-selection-card">

                <div className="roulette-field">
                    <label>Genre</label>

                    <select
                        value={selectedGenre}
                        onChange={(e) =>
                            setSelectedGenre(e.target.value)
                        }
                    >
                        <option value="">Select Genre</option>

                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="roulette-field">
                    <label>Year</label>

                    <select
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(e.target.value)
                        }
                    >
                        <option value="">Select Year</option>

                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>


                <button
                    className="roulette-find-button"
                    onClick={findMovie}
                >
                    Find Me a Movie
                </button>

            </div>


            {/* Result */}
            {randomMovie && (
                <section className="roulette-result-section">

                    <p className="roulette-result-label">
                        Your Pick
                    </p>


                    <div className="roulette-movie-card">

                        {/* Poster */}
                        <img
                            className="roulette-movie-image"
                            src={randomMovie.poster}
                            alt={randomMovie.title}
                        />


                        {/* Movie Information */}
                        <div className="roulette-movie-info">

                            <h2>
                                {randomMovie.title}
                            </h2>


                            <div className="roulette-movie-meta">

                                {randomMovie.year && (
                                    <span>
                                        {randomMovie.year}
                                    </span>
                                )}

                                {randomMovie.certificate && (
                                    <span>
                                        {randomMovie.certificate}
                                    </span>
                                )}

                                {randomMovie.rating && (
                                    <span>
                                        ⭐ {randomMovie.rating}
                                    </span>
                                )}

                            </div>


                            {randomMovie.genre && (
                                <div className="roulette-genres">
                                    {randomMovie.genre
                                        .split(",")
                                        .map((genre) => (
                                            <span key={genre}>
                                                {genre.trim()}
                                            </span>
                                        ))}
                                </div>
                            )}


                            <p className="roulette-movie-summary">
                                {randomMovie.description ||
                                    "No description available for this movie."}
                            </p>


                            <button
                                className="roulette-again-button"
                                onClick={findMovie}
                            >
                                Spin Again
                            </button>

                        </div>

                    </div>

                </section>
            )}


            {/* Empty State */}
            {!randomMovie && (
                <div className="roulette-empty-state">

                    <h2>
                        Ready to spin?
                    </h2>

                    <p>
                        Pick a genre and year, then let MovieVerse
                        choose something for you.
                    </p>

                </div>
            )}

        </div>
    );
}

export default MovieRoulette;