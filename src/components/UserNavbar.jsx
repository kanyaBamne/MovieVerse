import { Link } from "react-router-dom";

function UserNavbar() {
    return (
        <header className="user-navbar">
            <Link to="/" className="user-navbar-logo">
                MOVIEVERSE
            </Link>

            <nav className="user-navbar-center">
                <Link to="/movies">Movies</Link>

                <div className="user-navbar-search">
                    <span>⌕</span>
                    <input type="text" aria-label="Search" />
                </div>

                <Link to="/movie-roulette">Movie Roulette</Link>
            </nav>

            <div className="user-navbar-actions">
                <Link to="/login" className="nav-pill">Sign in</Link>
                <Link to="/register" className="nav-pill">Join</Link>
            </div>
        </header>
    );
}

export default UserNavbar;
