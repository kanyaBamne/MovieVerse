import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileWatchlist() {

    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // ==========================================
    // FETCH WATCHLIST
    // ==========================================

    const fetchWatchlist = async () => {

        try {

            setLoading(true);
            setError("");

            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {

                setError(
                    "Please login to view your watchlist."
                );

                setLoading(false);
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {

                setError(
                    "User ID not found. Please login again."
                );

                setLoading(false);
                return;
            }


            const response = await fetch(
                `http://localhost:5000/watchlist/${userId}`
            );

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch watchlist"
                );

            }

            setWatchlist(
                data.watchlist || []
            );

        } catch (error) {

            console.error(
                "Watchlist fetch error:",
                error
            );

            setError(
                error.message ||
                "Failed to load watchlist."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // REMOVE FROM WATCHLIST
    // ==========================================

    const removeFromWatchlist = async (movieId) => {

        try {

            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {

                alert("Please login first.");
                return;

            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {

                alert(
                    "User ID not found. Please login again."
                );

                return;
            }


            // Confirmation

            const confirmRemove =
                window.confirm(
                    "Are you sure you want to remove this movie from your watchlist?"
                );

            if (!confirmRemove) {
                return;
            }


            const response = await fetch(
                `http://localhost:5000/watchlist/${userId}/${movieId}`,
                {
                    method: "DELETE"
                }
            );

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to remove movie"
                );

            }


            // Remove movie immediately from UI

            setWatchlist((previousWatchlist) =>
                previousWatchlist.filter(
                    (item) =>
                        item.movie.id !== movieId
                )
            );


            alert(
                "Movie removed from watchlist."
            );

        } catch (error) {

            console.error(
                "Remove watchlist error:",
                error
            );

            alert(
                error.message ||
                "Failed to remove movie."
            );

        }

    };


    // ==========================================
    // LOAD WATCHLIST
    // ==========================================

    useEffect(() => {

        fetchWatchlist();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="profile-favorites-section">

                <div className="profile-favorites-header">

                    <h2>My Watchlist</h2>

                </div>

                <p>
                    Loading watchlist...
                </p>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="profile-favorites-section">

                <div className="profile-favorites-header">

                    <h2>My Watchlist</h2>

                </div>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // ==========================================
    // EMPTY WATCHLIST
    // ==========================================

    if (watchlist.length === 0) {

        return (

            <div className="profile-favorites-section">

                <div className="profile-favorites-header">

                    <h2>My Watchlist</h2>

                </div>

                <div className="profile-favorites-empty">

                    <h3>
                        Your watchlist is empty
                    </h3>

                    <p>
                        Add movies to your watchlist
                        to see them here.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // WATCHLIST
    // ==========================================

    return (

        <div className="profile-favorites-section">

            <div className="profile-favorites-header">

                <h2>
                    My Watchlist
                </h2>

                <span>
                    {watchlist.length}{" "}
                    {watchlist.length === 1
                        ? "Movie"
                        : "Movies"}
                </span>

            </div>


            <div className="profile-favorites-grid">

                {watchlist.map((item) => (

                    <div
                        className="profile-favorite-card"
                        key={item.id}
                    >

                        {/* =========================
                            POSTER
                        ========================== */}

                        <div
                            className="profile-favorite-poster"
                            onClick={() =>
                                navigate(
                                    `/movies/${item.movie.id}`
                                )
                            }
                        >

                            <img
                                src={item.movie.poster}
                                alt={item.movie.title}
                                onError={(e) => {

                                    e.target.src =
                                        "https://via.placeholder.com/300x450?text=No+Poster";

                                }}
                            />

                        </div>


                        {/* =========================
                            MOVIE INFORMATION
                        ========================== */}

                        <div className="profile-favorite-info">

                            <h3>
                                {item.movie.title}
                            </h3>

                            <p>
                                {item.movie.year}
                                {" • "}
                                {item.movie.genre}
                            </p>

                            <p>
                                ⭐ {item.movie.rating}
                            </p>


                            {/* =========================
                                REMOVE BUTTON
                            ========================== */}

                            <button
                                onClick={() =>
                                    removeFromWatchlist(
                                        item.movie.id
                                    )
                                }
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default ProfileWatchlist;