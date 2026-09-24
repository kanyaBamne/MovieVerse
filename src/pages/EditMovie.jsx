import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditMovie() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState({
    id: id,
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD MOVIE
  // ==========================================

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/movies/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load movie"
          );
        }

        setMovie(data.movie);
      } catch (error) {
        console.error("Load movie error:", error);

        setError(
          error.message || "Failed to load movie."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  // ==========================================
  // SAVE MOVIE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/movies/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: movie.title,
            year: movie.year,
            certificate: movie.certificate,
            duration: movie.duration,
            genre: movie.genre,
            rating: movie.rating,
            director: movie.director,
            cast: movie.cast,
            description: movie.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update movie"
        );
      }

      console.log("Movie updated:", data);

      navigate("/admin/movies");
    } catch (error) {
      console.error("Update movie error:", error);

      setError(
        error.message ||
          "Something went wrong while updating the movie."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="movie-form-page">
        <div className="page-header">
          <h1>Edit Movie</h1>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="movie-form-page">

      {/* Page Header */}

      <div className="page-header">
        <h1>Edit Movie</h1>
        <p>Update the details of this movie.</p>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#ffe5e5",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

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
                  required
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
                    required
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
                    type="number"
                    id="duration"
                    name="duration"
                    placeholder="e.g. 115"
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
                  required
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
                required
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
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditMovie;