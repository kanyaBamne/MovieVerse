import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function Movies() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [movieToDelete, setMovieToDelete] = useState(null);

    // Movies from MongoDB
    const [movies, setMovies] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);

    const moviesPerPage = 10;

    useEffect(() => {

        const fetchFilterOptions = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/movies/filters"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load filter options"
                    );
                }

                const data =
                    await response.json();

                setGenres(
                    data.genres || []
                );

                setYears(
                    data.years || []
                );

            } catch (error) {

                console.error(
                    "Filter options error:",
                    error
                );

            }

        };

        fetchFilterOptions();

    }, []);


    // ==========================================
    // FETCH MOVIES FROM BACKEND
    // ==========================================

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({
                page: currentPage,
                limit: moviesPerPage,
                search: search,
                genre: genre,
                year: year,
            });

            const response = await fetch(
                `http://localhost:5000/movies?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            setMovies(data.movies || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalMovies(data.pagination?.totalMovies || 0);

        } catch (err) {
            console.error("Movies error:", err);
            setError("Unable to load movies.");
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DELETE MOVIE
    // ==========================================

    const handleDelete = async () => {
        if (!movieToDelete) return;

        try {
            setError("");

            const response = await fetch(
                `http://localhost:5000/movies/${movieToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete movie"
                );
            }

            // Close confirmation modal
            setMovieToDelete(null);

            // Reload movies from MongoDB
            fetchMovies();

        } catch (err) {
            console.error("Delete movie error:", err);

            setError(
                err.message || "Failed to delete movie."
            );
        }
    };

    // ==========================================
    // LOAD MOVIES WHEN FILTERS/PAGE CHANGE
    // ==========================================

    useEffect(() => {
        fetchMovies();
    }, [currentPage, search, genre, year]);


    // Search
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };


    // Genre filter
    const handleGenreChange = (e) => {
        setGenre(e.target.value);
        setCurrentPage(1);
    };


    // Year filter
    const handleYearChange = (e) => {
        setYear(e.target.value);
        setCurrentPage(1);
    };


    // Pagination
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    };


    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );

        let endPage = Math.min(
            totalPages,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(
                1,
                endPage - maxVisiblePages + 1
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };


    return (
        <div className="movies-page">

            {/* Page Header */}
            <div className="page-header movies-header">

                <div>
                    <h1>Movies</h1>
                    <p>Manage your movie catalogue.</p>
                </div>

                <button
                    className="add-movie-button"
                    onClick={() => navigate("/admin/movies/add")}
                >
                    + Add Movie
                </button>

            </div>


            {/* Search & Filters */}
            <div className="movie-filters">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>


                <select
                    value={genre}
                    onChange={handleGenreChange}
                >
                    <option value="">
                        All Genres
                    </option>

                    {genres.map((genreOption) => (
                        <option
                            key={genreOption}
                            value={genreOption}
                        >
                            {genreOption}
                        </option>
                    ))}
                </select>


                <select
                    value={year}
                    onChange={handleYearChange}
                >
                    <option value="">
                        All Years
                    </option>

                    {years.map((yearOption) => (
                        <option
                            key={yearOption}
                            value={yearOption}
                        >
                            {yearOption}
                        </option>
                    ))}
                </select>

            </div>


            {/* Error */}
            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}


            {/* Movie Table */}
            <div className="movies-table-card">

                <div className="movies-table-wrapper">

                    <table className="movies-table">

                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Movie</th>
                                <th>Year</th>
                                <th>Genre</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="6">

                                        <div className="empty-state">
                                            <span>🎬</span>
                                            <h3>Loading movies...</h3>
                                            <p>
                                                Fetching movies from the database.
                                            </p>
                                        </div>

                                    </td>
                                </tr>

                            ) : movies.length > 0 ? (

                                movies.map((movie) => (

                                    <tr key={movie.id}>

                                        <td>
                                            <div
                                                className="table-poster"
                                                onClick={() => navigate(`/movies/${movie.id}`)}
                                                style={{ cursor: "pointer" }}
                                            >

                                                {movie.poster ? (
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                            e.currentTarget.parentElement.innerHTML = "🎬";
                                                        }}
                                                    />
                                                ) : (
                                                    "🎬"
                                                )}

                                            </div>
                                        </td>


                                        <td>
                                            <div className="table-movie-info">
                                                <strong
                                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {movie.title}
                                                </strong>
                                                <span>{movie.director}</span>
                                            </div>
                                        </td>


                                        <td>{movie.year}</td>


                                        <td>
                                            <span className="genre-badge">
                                                {movie.genre}
                                            </span>
                                        </td>


                                        <td>
                                            <span className="rating-value">
                                                ⭐ {movie.rating}
                                            </span>
                                        </td>


                                        <td>

                                            <div className="table-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/movies/edit/${movie.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        setMovieToDelete(movie)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="6">

                                        <div className="empty-state">
                                            <span>🔍</span>
                                            <h3>No movies found</h3>
                                            <p>
                                                Try changing your search or filters.
                                            </p>
                                        </div>

                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Pagination */}
                <div className="pagination">

                    <span>
                        {totalMovies > 0
                            ? `Showing ${(currentPage - 1) * moviesPerPage + 1}–${Math.min(
                                currentPage * moviesPerPage,
                                totalMovies
                            )} of ${totalMovies} movies`
                            : "Showing 0 movies"}
                    </span>


                    <div className="pagination-buttons">

                        {/* Previous */}
                        <button
                            onClick={() =>
                                handlePageChange(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                        >
                            ←
                        </button>


                        {/* Page Numbers */}
                        {getPageNumbers().map((page) => (

                            <button
                                key={page}
                                className={
                                    currentPage === page
                                        ? "active-page"
                                        : ""
                                }
                                onClick={() =>
                                    handlePageChange(page)
                                }
                            >
                                {page}
                            </button>

                        ))}


                        {/* Next */}
                        <button
                            onClick={() =>
                                handlePageChange(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                        >
                            →
                        </button>

                    </div>

                </div>

            </div>


            {/* Delete Confirmation */}
            {movieToDelete && (
                <ConfirmModal
                    title="Delete Movie?"
                    itemName={movieToDelete.title}
                    onCancel={() => setMovieToDelete(null)}
                    onConfirm={handleDelete}
                />
            )}

        </div>
    );
}

export default Movies;