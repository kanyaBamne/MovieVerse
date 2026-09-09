import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function Movies() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [movieToDelete, setMovieToDelete] = useState(null);

    const movies = [
        {
            id: 1,
            title: "Interstellar",
            director: "Christopher Nolan",
            year: 2014,
            genre: "Sci-Fi",
            rating: "8.7",
        },
        {
            id: 2,
            title: "Parasite",
            director: "Bong Joon Ho",
            year: 2019,
            genre: "Drama",
            rating: "8.5",
        },
        {
            id: 3,
            title: "Inception",
            director: "Christopher Nolan",
            year: 2010,
            genre: "Sci-Fi",
            rating: "8.8",
        },
        {
            id: 4,
            title: "The Dark Knight",
            director: "Christopher Nolan",
            year: 2008,
            genre: "Action",
            rating: "9.0",
        },
        {
            id: 5,
            title: "Whiplash",
            director: "Damien Chazelle",
            year: 2014,
            genre: "Drama",
            rating: "8.5",
        },
        {
            id: 6,
            title: "La La Land",
            director: "Damien Chazelle",
            year: 2016,
            genre: "Musical",
            rating: "8.0",
        },
        {
            id: 7,
            title: "The Godfather",
            director: "Francis Ford Coppola",
            year: 1972,
            genre: "Crime",
            rating: "9.2",
        },
        {
            id: 8,
            title: "Spirited Away",
            director: "Hayao Miyazaki",
            year: 2001,
            genre: "Animation",
            rating: "8.6",
        },
        {
            id: 9,
            title: "The Shawshank Redemption",
            director: "Frank Darabont",
            year: 1994,
            genre: "Drama",
            rating: "9.3",
        },
        {
            id: 10,
            title: "Get Out",
            director: "Jordan Peele",
            year: 2017,
            genre: "Horror",
            rating: "7.8",
        },
    ];

    const filteredMovies = movies.filter((movie) => {
        const matchesSearch =
            movie.title.toLowerCase().includes(search.toLowerCase()) ||
            movie.director.toLowerCase().includes(search.toLowerCase());

        const matchesGenre =
            genre === "" || movie.genre === genre;

        const matchesYear =
            year === "" || movie.year.toString() === year;

        return matchesSearch && matchesGenre && matchesYear;
    });

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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>


                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Animation">Animation</option>
                    <option value="Crime">Crime</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Musical">Musical</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                </select>


                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2014">2014</option>
                    <option value="2010">2010</option>
                    <option value="2008">2008</option>
                    <option value="2001">2001</option>
                    <option value="1994">1994</option>
                    <option value="1972">1972</option>
                </select>

            </div>


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

                            {filteredMovies.length > 0 ? (
                                filteredMovies.map((movie) => (

                                    <tr key={movie.id}>

                                        <td>
                                            <div className="table-poster">
                                                🎬
                                            </div>
                                        </td>


                                        <td>
                                            <div className="table-movie-info">
                                                <strong>{movie.title}</strong>
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
                                                        navigate(`/admin/movies/edit/${movie.id}`)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() => setMovieToDelete(movie)}
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
                        Showing {filteredMovies.length > 0 ? 1 : 0}–
                        {filteredMovies.length} of 5,000 movies
                    </span>

                    <div className="pagination-buttons">

                        <button>←</button>
                        <button className="active-page">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                        <button>→</button>

                    </div>

                </div>

            </div>
            {movieToDelete && (
  <ConfirmModal
       title="Delete Movie?"
    itemName={movieToDelete.title}
    onCancel={() => setMovieToDelete(null)}
    onConfirm={() => {
      console.log("Deleting movie:", movieToDelete);
      setMovieToDelete(null);
    }}
  />
)}

        </div>

        
    );
}

export default Movies;