
import { useEffect, useState } from "react";

function ProfileReviews({ userId }) {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/reviews/user/${userId}`
                );

                const data = await response.json();

                if (data.success) {
                    setReviews(data.reviews || []);
                }

            } catch (error) {

                console.error(
                    "User reviews error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchReviews();

    }, [userId]);

    const handleDeleteReview = async (reviewId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/reviews/${reviewId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete review."
                );

                return;

            }


            setReviews((current) =>
                current.filter(
                    (review) => review.id !== reviewId
                )
            );

        } catch (error) {

            console.error(
                "Delete review error:",
                error
            );

            alert("Unable to delete review.");

        }

    };


    if (loading) {

        return (
            <div className="profile-reviews-loading">
                Loading reviews...
            </div>
        );

    }


    return (

        <section className="profile-reviews-section">

            <div className="profile-reviews-header">

                <h2>Reviews</h2>

                <span>
                    {reviews.length}{" "}
                    {reviews.length === 1
                        ? "review"
                        : "reviews"}
                </span>

            </div>


            {reviews.length === 0 ? (

                <div className="profile-reviews-empty">

                    <h3>No reviews yet</h3>

                    <p>
                        You haven't written any reviews yet.
                    </p>

                </div>

            ) : (

                <div className="profile-reviews-list">

                    {reviews.map((review) => (

                        <div
                            className="profile-review-card"
                            key={review.id}
                        >

                            <div className="profile-review-poster">

                                <img
                                    src={review.movie.poster}
                                    alt={review.movie.title}
                                />

                            </div>


                            <div className="profile-review-content">

                                <div className="profile-review-movie">

                                    <h3>
                                        {review.movie.title}
                                    </h3>

                                    <p>
                                        {review.movie.year}
                                    </p>

                                
                                </div>


                                <div className="profile-review-rating">

                                    {"★".repeat(
                                        Math.round(review.rating)
                                    )}

                                    <span>
                                        {" "}
                                        {review.rating}/10
                                    </span>

                                </div>


                                {review.reviewTitle && (

                                    <h4>
                                        {review.reviewTitle}
                                    </h4>

                                )}


                                {review.reviewText && (

                                    <p className="profile-review-text">
                                        {review.reviewText}
                                    </p>

                                )}


                                {review.createdAt && (

                                    <p className="profile-review-date">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                )}

                                    <button
                                        className="profile-review-delete"
                                        onClick={() =>
                                            handleDeleteReview(review.id)
                                        }
                                    >
                                        Delete
                                    </button>


                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );

}

export default ProfileReviews;

