import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditMovie() {
  const navigate = useNavigate();
  const { id } = useParams();

  const existingMovies = {
    1: {
      title: "Interstellar",
      year: "2014",
      certificate: "PG-13",
      duration: "2h 49m",
      genre: "Sci-Fi, Drama",
      rating: "8.7",
      director: "Christopher Nolan",
      cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    },

    2: {
      title: "Parasite",
      year: "2019",
      certificate: "R",
      duration: "2h 12m",
      genre: "Drama, Thriller",
      rating: "8.5",
      director: "Bong Joon Ho",
      cast: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
      description:
        "A struggling family gradually becomes involved with a wealthy household, leading to unexpected consequences.",
    },

    3: {
      title: "Inception",
      year: "2010",
      certificate: "PG-13",
      duration: "2h 28m",
      genre: "Sci-Fi, Thriller",
      rating: "8.8",
      director: "Christopher Nolan",
      cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
      description:
        "A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his past.",
    },
  };

  const selectedMovie = existingMovies[id] || existingMovies[1];

  const [movie, setMovie] = useState(selectedMovie);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Movie:", movie);

    navigate("/admin/movies");
  };

  return (
    <div className="movie-form-page">

      {/* Page Header */}

      <div className="page-header">
        <h1>Edit Movie</h1>
        <p>Update the details of this movie.</p>
      </div>


      <form onSubmit={handleSubmit}>

        {/* ================================
            BASIC INFORMATION
        ================================= */}

        <section className="form-section">

          <div className="section-heading">
            <span>01</span>

            <div>
              <h2>Basic Information</h2>
              <p>Update the main details of the movie.</p>
            </div>
          </div>


          <div className="basic-info-layout">

            {/* Poster */}

            <div className="poster-upload">

              <div className="poster-placeholder">
                <span>🎬</span>
                <strong>Movie Poster</strong>
                <small>Change poster</small>
              </div>

              <input
                type="file"
                accept="image/png, image/jpeg"
              />

            </div>


            {/* Movie Details */}

            <div className="movie-details">

              <div className="form-group full-width">

                <label htmlFor="title">
                  Movie Title
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={movie.title}
                  onChange={handleChange}
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="year">
                    Year
                  </label>

                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={movie.year}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="certificate">
                    Certificate
                  </label>

                  <input
                    type="text"
                    id="certificate"
                    name="certificate"
                    value={movie.certificate}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="duration">
                    Duration
                  </label>

                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={movie.duration}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="rating">
                    IMDb Rating
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    id="rating"
                    name="rating"
                    value={movie.rating}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="form-group full-width">

                <label htmlFor="genre">
                  Genre
                </label>

                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={movie.genre}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            CREDITS
        ================================= */}

        <section className="form-section">

          <div className="section-heading">

            <span>02</span>

            <div>
              <h2>Credits</h2>
              <p>Update the people involved in the movie.</p>
            </div>

          </div>


          <div className="credits-grid">

            <div className="form-group">

              <label htmlFor="director">
                Director
              </label>

              <input
                type="text"
                id="director"
                name="director"
                value={movie.director}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label htmlFor="cast">
                Cast
              </label>

              <input
                type="text"
                id="cast"
                name="cast"
                value={movie.cast}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>


        {/* ================================
            ABOUT THE MOVIE
        ================================= */}

        <section className="form-section">

          <div className="section-heading">

            <span>03</span>

            <div>
              <h2>About the Movie</h2>
              <p>Update the movie description.</p>
            </div>

          </div>


          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={movie.description}
              onChange={handleChange}
            />

          </div>

        </section>


        {/* ================================
            FORM ACTIONS
        ================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin/movies")}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="submit-button"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditMovie;