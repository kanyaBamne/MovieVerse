import { useState } from "react";

function AddMovie() {
  const [movie, setMovie] = useState({
    title: "",
    year: "",
    certificate: "",
    duration: "",
    genre: "",
    rating: "",
    director: "",
    cast: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Movie:", movie);
  };

  return (
    <div className="movie-form-page">

      {/* Page Header */}
      <div className="page-header">
        <h1>Add Movie</h1>
        <p>Add a new title to your movie catalogue.</p>
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
              <p>Enter the main details of the movie.</p>
            </div>
          </div>

          <div className="basic-info-layout">

            {/* Poster */}
            <div className="poster-upload">

              <div className="poster-placeholder">
                <span>+</span>
                <strong>Add Poster</strong>
                <small>JPG or PNG</small>
              </div>

              <input
                type="file"
                accept="image/png, image/jpeg"
              />

            </div>

            {/* Movie Details */}
            <div className="movie-details">

              <div className="form-group full-width">
                <label htmlFor="title">Movie Title</label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter movie title"
                  value={movie.title}
                  onChange={handleChange}
                />
              </div>


              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="year">Year</label>

                  <input
                    type="number"
                    id="year"
                    name="year"
                    placeholder="e.g. 2024"
                    value={movie.year}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="certificate">Certificate</label>

                  <input
                    type="text"
                    id="certificate"
                    name="certificate"
                    placeholder="e.g. PG-13"
                    value={movie.certificate}
                    onChange={handleChange}
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="duration">Duration</label>

                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="e.g. 2h 49m"
                    value={movie.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">IMDb Rating</label>

                  <input
                    type="number"
                    step="0.1"
                    id="rating"
                    name="rating"
                    placeholder="e.g. 8.5"
                    value={movie.rating}
                    onChange={handleChange}
                  />
                </div>

              </div>


              <div className="form-group full-width">
                <label htmlFor="genre">Genre</label>

                <input
                  type="text"
                  id="genre"
                  name="genre"
                  placeholder="e.g. Drama, Thriller"
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
              <p>Add the people involved in the movie.</p>
            </div>
          </div>


          <div className="credits-grid">

            <div className="form-group">
              <label htmlFor="director">Director</label>

              <input
                type="text"
                id="director"
                name="director"
                placeholder="Enter director name"
                value={movie.director}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label htmlFor="cast">Cast</label>

              <input
                type="text"
                id="cast"
                name="cast"
                placeholder="Enter cast members"
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
              <p>Add a short description of the movie.</p>
            </div>
          </div>


          <div className="form-group">

            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Enter movie description..."
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
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
          >
            Add Movie
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddMovie;