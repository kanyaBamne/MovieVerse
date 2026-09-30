import { useEffect, useState } from "react";

const checkImage = (url) => {
    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => resolve(true);

        img.onerror = () => resolve(false);

        img.src = url;

    });
};


function Hero() {

    const [movies, setMovies] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadMovies = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/movies?page=1&limit=100"
                );

                const data = await response.json();

                const allMovies = Array.isArray(data)
                    ? data
                    : data.movies || data.data || [];


                // Shuffle movies randomly
                const shuffledMovies = [...allMovies].sort(
                    () => Math.random() - 0.5
                );


                const validMovies = [];


                // Check posters until we get 5 working movies
                for (const movie of shuffledMovies) {

                    if (validMovies.length >= 5) {
                        break;
                    }


                    if (!movie.poster) {
                        continue;
                    }

                    let posterUrl = movie.poster.startsWith("http")
                        ? movie.poster
                        : `http://localhost:5000${movie.poster}`;

                    // Try to use the original Amazon/IMDb image
                    if (posterUrl.includes("m.media-amazon.com")) {
                        posterUrl = posterUrl.replace(
                            /\._V1_.*(?=\.(jpg|jpeg|png))/i,
                            ""
                        );
                    }

                    const imageWorks = await checkImage(posterUrl);

                    if (imageWorks) {
                        validMovies.push({
                            ...movie,
                            posterUrl,
                        });
                    }

                }


                setMovies(validMovies);

                setCurrentIndex(0);


            } catch (error) {

                console.error(
                    "Failed to load hero movies:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadMovies();

    }, []);


    /*
       Change movie every 4 seconds
    */

    useEffect(() => {

        if (movies.length <= 1) {
            return;
        }


        const interval = setInterval(() => {

            setCurrentIndex((previousIndex) =>
                (previousIndex + 1) % movies.length
            );

        }, 4000);


        return () => clearInterval(interval);

    }, [movies]);


    /*
       Loading
    */

    if (loading) {

        return (
            <section className="hero-section hero-loading">

                <p>Loading...</p>

            </section>
        );

    }


    /*
       No valid movies
    */

    if (movies.length === 0) {

        return (
            <section className="hero-section hero-empty">

                <p>No movies available.</p>

            </section>
        );

    }


    const movie = movies[currentIndex];


    return (
        <section className="hero-section">

            <img
                src={movie.posterUrl}
                alt={movie.title}
                className="hero-image"
            />


            <div className="hero-overlay">

                <div className="hero-movie-info">

                    <h1>
                        {movie.title}
                    </h1>

                    <p>
                        {movie.genre || "Movie"}
                    </p>

                    <button>
                        Add to Watchlist
                    </button>

                </div>

            </div>


            {/* Slide indicators */}

            <div className="hero-dots">

                {movies.map((_, index) => (

                    <button
                        key={index}
                        className={
                            index === currentIndex
                                ? "hero-dot active"
                                : "hero-dot"
                        }
                        onClick={() =>
                            setCurrentIndex(index)
                        }
                    />

                ))}

            </div>

        </section>
    );
}


export default Hero;