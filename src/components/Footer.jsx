
import { Link } from "react-router-dom";
import "../UserHome.css"


function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        Movie<span>Verse</span>
                    </Link>

                    <p>
                        Discover movies, explore stories, and keep
                        track of the films you love.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                    <Link to="/movie-roulette">Movie Roulette</Link>
                </div>

                <div className="footer-links">
                    <h3>Your Space</h3>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/login">Sign In</Link>
                </div>

                <div className="footer-about">
                    <h3>MovieVerse</h3>
                    <p>
                        Your space to discover, save, and celebrate
                        the world of movies.
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} MovieVerse.
                    All rights reserved.
                </p>

                <p className="footer-tagline">
                    Made for movie lovers.
                </p>
            </div>
        </footer>
    );
}

export default Footer;