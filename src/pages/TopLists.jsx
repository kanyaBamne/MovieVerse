import { useEffect, useState } from "react";

function TopLists() {

    const [lists, setLists] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Which list is currently the first visible list
    const [startIndex, setStartIndex] = useState(0);


    // ==========================================
    // FETCH TOP LISTS
    // ==========================================

    const fetchTopLists = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/userlists/top"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch top lists");
            }

            const data = await response.json();

            setLists(data.lists || []);

        } catch (err) {

            console.error("Top lists error:", err);

            setError("Unable to load top lists.");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchTopLists();

    }, []);


    // ==========================================
    // NEXT
    // ==========================================

    const nextLists = () => {

        if (startIndex < lists.length - 1) {

            setStartIndex(startIndex + 1);

        }

    };


    // ==========================================
    // PREVIOUS
    // ==========================================

    const previousLists = () => {

        if (startIndex > 0) {

            setStartIndex(startIndex - 1);

        }

    };


    // ==========================================
    // VISIBLE LISTS
    // ==========================================

    const visibleLists = lists.slice(
        startIndex,
        startIndex + 3
    );


    return (

        <div className="top-lists-box">

            <h2>Top Lists</h2>


            {loading && (

                <div className="top-lists-loading">

                    Loading top lists...

                </div>

            )}


            {error && (

                <div className="top-lists-error">

                    {error}

                </div>

            )}


            {!loading &&
                !error &&
                lists.length > 0 && (

                    <div className="top-list-carousel">


                        {/* LEFT BUTTON */}

                        <button
                            className="top-list-arrow"
                            onClick={previousLists}
                            disabled={startIndex === 0}
                        >
                            ←
                        </button>


                        {/* VISIBLE LISTS */}

                        <div className="top-list-visible">

                            {visibleLists.map((list) => (

                                <div
                                    className="top-list-card"
                                    key={list.id}
                                >


                                    {/* MOVIE POSTERS */}

                                    <div className="top-list-images">

                                        {list.movies
                                            .slice(0, 3)
                                            .map((movie) => (

                                                <img
                                                    key={movie.id}
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    onError={(e) => {

                                                        e.target.src =
                                                            "https://via.placeholder.com/150x220?text=No+Poster";

                                                    }}
                                                />

                                            ))}

                                    </div>


                                    {/* LIST INFORMATION */}

                                    <div className="top-list-info">

                                        <h3>
                                            {list.title}
                                        </h3>


                                        <p className="created-by">

                                            by {list.user.username}

                                        </p>


                                        <p className="list-stats">

                                            {list.movieCount}
                                            {" dramas | "}
                                            {list.likesCount}
                                            {" likes"}

                                        </p>


                                        <button className="save-button">

                                            ♡ Save

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* RIGHT BUTTON */}

                        <button
                            className="top-list-arrow"
                            onClick={nextLists}
                            disabled={
                                startIndex + 3 >= lists.length
                            }
                        >
                            →
                        </button>

                    </div>

                )}

        </div>

    );

}

export default TopLists;