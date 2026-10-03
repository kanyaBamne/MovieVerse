import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileFavorites({ userId }) {

    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchFavorites = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/favorites/${userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to load favorites");
                }

                const data = await response.json();

                setFavorites(data.favorites || []);

            } catch (error) {

                console.error(
                    "Favorites error:",
                    error
                );

                setError(
                    "Unable to load favorites"
                );

            } finally {

                setLoading(false);

            }

        };

        if (userId) {
            fetchFavorites();
        }

    }, [userId]);


    const handleRemoveFavorite = async (movieId) => {

        try {

            const response = await fetch(
                `http://localhost:5000/favorites/${userId}/${movieId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove favorite"
                );
            }

            setFavorites((currentFavorites) =>
                currentFavorites.filter(
                    (favorite) =>
                        favorite.movieId !== movieId
                )
            );

        } catch (error) {

            console.error(
                "Remove favorite error:",
                error
            );

            alert(error.message);

        }

    };


    if (loading) {

        return (
            <section className="profile-favorites-section">

                <h2>My Favorites</h2>

                <p>Loading favorites...</p>

            </section>
        );

    }


    if (error) {

        return (
            <section className="profile-favorites-section">

                <h2>My Favorites</h2>

                <p>{error}</p>

            </section>
        );

    }


    return (

        <section className="profile-favorites-section">

            <div className="profile-favorites-header">

                <h2>My Favorites</h2>

                <span>
                    {favorites.length} movie
                    {favorites.length !== 1 ? "s" : ""}
                </span>

            </div>


            {favorites.length === 0 ? (

                <div className="profile-favorites-empty">

                    <h3>No favorites yet</h3>

                    <p>
                        Movies you favorite will appear here.
                    </p>

                </div>

            ) : (

                <div className="profile-favorites-grid">

                    {favorites.map((favorite) => {

                        const movie = favorite.movie;

                        if (!movie) {
                            return null;
                        }

                        return (

                            <div
                                className="profile-favorite-card"
                                key={favorite._id}
                            >

                                <div
                                    className="profile-favorite-poster"
                                    onClick={() =>
                                        navigate(
                                            `/movies/${movie._id}`
                                        )
                                    }
                                >

                                    <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>


                                <div className="profile-favorite-info">

                                    <h3>
                                        {movie.Title}
                                    </h3>

                                    <p>
                                        {movie.Year}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFavorite(
                                                movie._id
                                            )
                                        }
                                    >
                                        ♥ Remove
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </section>

    );

}

export default ProfileFavorites;