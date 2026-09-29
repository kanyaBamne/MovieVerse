import { useEffect, useState } from "react";

function ProfileWatchlist({ userId }) {

    const [watchlist, setWatchlist] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchWatchlist = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/watchlist/${userId}`
                );


                const data = await response.json();


                if (data.success) {

                    setWatchlist(data.watchlist);

                }

            } catch (error) {

                console.error(
                    "Watchlist error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchWatchlist();

    }, [userId]);


    if (loading) {

        return (
            <div className="watchlist-loading">
                Loading watchlist...
            </div>
        );

    }


    return (

        <div className="profile-watchlist">

            {watchlist.length === 0 ? (

                <p className="empty-watchlist">
                    Your watchlist is empty.
                </p>

            ) : (

                <div className="watchlist-grid">

                    {watchlist.map((item) => (

                        <div
                            className="watchlist-movie"
                            key={item._id}
                        >

                            <img
                                src={item.movie.Poster}
                                alt={item.movie.Title}
                            />

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default ProfileWatchlist;