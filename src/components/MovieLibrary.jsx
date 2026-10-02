import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieLibrary() {

    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/movies?limit=100")
            .then((res) => res.json())
            .then((data) => {
                setMovies(data.movies || []);
            })
            .catch((error) => {
                console.error("Error loading movies:", error);
            });

    }, []);

    const genres = [
        ...new Set(
            movies
                .flatMap((movie) =>
                    movie.genre
                        ? movie.genre.split(",").map((g) => g.trim())
                        : []
                )
        )
    ].sort();

    const handleGenreChange = (genre) => {

        setSelectedGenres((current) => {

            if (current.includes(genre)) {
                return current.filter((item) => item !== genre);
            }

            return [...current, genre];

        });

    };

    const handleRatingChange = (rating) => {

        setSelectedRatings((current) => {

            if (current.includes(rating)) {
                return current.filter((item) => item !== rating);
            }

            return [...current, rating];

        });

    };

    const filteredMovies = movies.filter((movie) => {

        const matchesSearch =
            movie.title
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesGenre =
            selectedGenres.length === 0 ||
            selectedGenres.some((genre) =>
                movie.genre
                    ?.toLowerCase()
                    .includes(genre.toLowerCase())
            );

        const matchesRating =
            selectedRatings.length === 0 ||
            selectedRatings.some(
                (rating) => movie.rating >= Number(rating)
            );

        return (
            matchesSearch &&
            matchesGenre &&
            matchesRating
        );

    });

    return (
        <main className="movie-library">

            <section className="movie-library-header">

                <p className="movie-library-label">
                    MOVIEVERSE LIBRARY
                </p>

                <h1>Movies</h1>

                <p className="movie-library-subtitle">
                    Explore movies and find your next watch.
                </p>

            </section>


            <section className="movie-library-search">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </section>


            <div className="movie-library-layout">

                {/* Filters */}

                <aside className="movie-filters">

                    <div className="movie-filter-header">
                        

                        {(selectedGenres.length > 0 ||
                            selectedRatings.length > 0) && (

                            <button
                                onClick={() => {
                                    setSelectedGenres([]);
                                    setSelectedRatings([]);
                                }}
                            >
                                Clear
                            </button>

                        )}
                    </div>


                    {/* Genre */}

                    <div className="movie-filter-group">

                        <h3>Genre</h3>

                        <div className="movie-checkbox-list">

                            {genres.map((genre) => (

                                <label
                                    className="movie-checkbox"
                                    key={genre}
                                >

                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() =>
                                            handleGenreChange(genre)
                                        }
                                    />

                                    <span>{genre}</span>

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* Rating */}

                    <div className="movie-filter-group">

                        <h3>Rating</h3>

                        <div className="movie-checkbox-list">

                            {[
                                { value: "8", label: "8+" },
                                { value: "7", label: "7+" },
                                { value: "6", label: "6+" },
                                { value: "5", label: "5+" }
                            ].map((item) => (

                                <label
                                    className="movie-checkbox"
                                    key={item.value}
                                >

                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(item.value)}
                                        onChange={() =>
                                            handleRatingChange(item.value)
                                        }
                                    />

                                    <span>{item.label}</span>

                                </label>

                            ))}

                        </div>

                    </div>

                </aside>


                {/* Movies */}

                <section className="movie-library-results">

                    <div className="movie-library-count">
                        {filteredMovies.length} movies
                    </div>

                    {filteredMovies.length === 0 ? (

                        <div className="movie-library-empty">
                            <h2>No movies found</h2>

                            <p>
                                Try changing your search or filters.
                            </p>
                        </div>

                    ) : (

                        <div className="movie-grid">

                            {filteredMovies.map((movie) => (

                                <article
                                    className="movie-card"
                                    key={movie.id}
                                    onClick={() =>
                                        navigate(`/movies/${movie.id}`)
                                    }
                                >

                                    <div className="movie-card-poster">

                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                        />

                                        <span className="movie-card-rating">
                                            ★ {movie.rating || "N/A"}
                                        </span>

                                    </div>

                                    <div className="movie-card-info">

                                        <h2>{movie.title}</h2>

                                        <p>
                                            {movie.year}
                                            {movie.genre &&
                                                ` · ${movie.genre}`}
                                        </p>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default MovieLibrary;