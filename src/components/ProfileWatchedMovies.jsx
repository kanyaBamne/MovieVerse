
import { useEffect, useState } from "react";

function ProfileWatchedMovies({ userId }) {

    const [watchedMovies, setWatchedMovies] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchWatchedMovies = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/watchedMovies/${userId}`
                );

                const data = await response.json();

                if (data.success) {

                    setWatchedMovies(
                        data.watchedMovies || []
                    );

                }

            } catch (error) {

                console.error(
                    "Watched movies error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchWatchedMovies();

    }, [userId]);


    const handleRemoveWatched = async (movieId) => {

        try {

            const response = await fetch(
                "http://localhost:5000/watchedMovies",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId,
                        movieId: movieId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to remove movie."
                );

                return;

            }

            // Remove movie from the displayed list
            setWatchedMovies((current) =>
                current.filter(
                    (item) =>
                        item.movieId?.toString() !== movieId.toString()
                )
            );

        } catch (error) {

            console.error(
                "Remove watched movie error:",
                error
            );

            alert(
                "Unable to remove movie from watched."
            );

        }

    };


    if (loading) {

        return (
            <div className="watched-movies-loading">
                Loading films...
            </div>
        );

    }


    return (

        <section className="profile-watched-movies">

            <div className="watched-movies-header">

                <h2>Films</h2>

                <span>
                    {watchedMovies.length}{" "}
                    {watchedMovies.length === 1
                        ? "film"
                        : "films"}
                </span>

            </div>


            {watchedMovies.length === 0 ? (

                <div className="empty-watched-movies">

                    <h3>No films yet</h3>

                    <p>
                        You haven't watched any movies yet.
                    </p>

                </div>

            ) : (

                <div className="watched-movies-grid">

                    {watchedMovies.map((item) => (

                        <div
                            className="watched-movie"
                            key={item._id}
                        >

                            <div className="watched-movie-poster">

                                <img
                                    src={item.movie.Poster}
                                    alt={item.movie.Title}
                                />

                            </div>


                            <div className="watched-movie-info">

                                <h3>
                                    {item.movie.Title}
                                </h3>

                                <p>
                                    {item.movie.Year}
                                </p>

                                <button
                                    onClick={() =>
                                        handleRemoveWatched(
                                            item.movieId
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );

}

export default ProfileWatchedMovies;

