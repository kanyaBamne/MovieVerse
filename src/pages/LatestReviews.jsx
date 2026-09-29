import { useEffect, useRef, useState } from "react";

function LatestReviews() {

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const reviewContainer = useRef(null);


    // ==========================================
    // FETCH REVIEWS
    // ==========================================

    const fetchReviews = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                "http://localhost:5000/reviews/latest"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch reviews"
                );

            }

            const data = await response.json();

            setReviews(data.reviews || []);

        } catch (err) {

            console.error(
                "Reviews error:",
                err
            );

            setError(
                "Unable to load reviews."
            );

            setReviews([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    useEffect(() => {

        fetchReviews();

    }, []);


    // ==========================================
    // AUTO SCROLL
    // ==========================================

    useEffect(() => {

        if (reviews.length === 0) {

            return;

        }

        const container =
            reviewContainer.current;

        if (!container) {

            return;

        }


        const scrollReviews = () => {

            container.scrollLeft += 1;


            // When it reaches the end,
            // start again from the beginning

            if (
                container.scrollLeft +
                container.clientWidth >=
                container.scrollWidth
            ) {

                container.scrollLeft = 0;

            }

        };


        const interval = setInterval(
            scrollReviews,
            30
        );


        return () => {

            clearInterval(interval);

        };

    }, [reviews]);


    // ==========================================
    // ADD TO WATCHLIST
    // ==========================================

    const addToWatchlist = async (
        userId,
        movieId
    ) => {

        console.log(
            "Sending to backend:"
        );

        console.log(
            "userId:",
            userId
        );

        console.log(
            "movieId:",
            movieId
        );


        // Check IDs

        if (!userId || !movieId) {

            alert(
                "User ID or Movie ID is missing"
            );

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/watchlist",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId: userId,

                        movieId: movieId

                    })

                }
            );


            const data =
                await response.json();


            console.log(
                "Backend response:",
                data
            );


            if (data.success) {

                alert(
                    "Movie added to watchlist!"
                );

            } else {

                alert(
                    data.message
                );

            }

        } catch (error) {

            console.error(
                "Add to watchlist error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="latest-reviews-box">


            {/* TITLE */}

            <h2>
                Latest Reviews
            </h2>


            {/* LOADING */}

            {loading && (

                <div className="reviews-loading">

                    Loading latest reviews...

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="reviews-error">

                    {error}

                </div>

            )}


            {/* REVIEWS */}

            {!loading && !error && (

                <div
                    className="latest-review-container"
                    ref={reviewContainer}
                >

                    <div className="latest-review-items">


                        {reviews.map(
                            (review) => (

                                <div
                                    className="review-card"
                                    key={review.id}
                                >


                                    {/* POSTER */}

                                    <img
                                        src={
                                            review.movie.poster
                                        }

                                        alt={
                                            review.movie.title
                                        }

                                        onError={(e) => {

                                            e.target.src =
                                                "https://via.placeholder.com/150x220?text=No+Poster";

                                        }}

                                    />


                                    {/* HOVER DETAILS */}

                                    <div className="review-hover-details">


                                        {/* MOVIE TITLE */}

                                        <h3>

                                            {
                                                review.movie.title
                                            }

                                        </h3>


                                        {/* REVIEW TITLE */}

                                        <p className="review-title">

                                            {
                                                review.reviewTitle
                                            }

                                        </p>


                                        {/* RATING */}

                                        <p className="review-rating">

                                            ⭐ {review.rating}

                                        </p>


                                        {/* USERNAME */}

                                        <p className="review-user">

                                            @
                                            {
                                                review.user.username
                                            }

                                        </p>


                                        {/* WATCHLIST BUTTON */}

                                        <button
                                            className="watchlist-button"

                                            onClick={() => {

                                                console.log(
                                                    "Review data:",
                                                    review
                                                );

                                                console.log(
                                                    "User ID:",
                                                    review.user.id
                                                );

                                                console.log(
                                                    "Movie ID:",
                                                    review.movie.id
                                                );


                                                addToWatchlist(

                                                    review.user.id,

                                                    review.movie.id

                                                );

                                            }}
                                        >

                                            + Add to Watchlist

                                        </button>


                                    </div>


                                </div>

                            )
                        )}


                    </div>

                </div>

            )}


        </div>

    );

}


export default LatestReviews;