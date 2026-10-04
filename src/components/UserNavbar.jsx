import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserNavbar() {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState("");

    const user = JSON.parse(
        sessionStorage.getItem("user")
    );

    const handleLogout = () => {

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("admin");

        setShowMenu(false);

        navigate("/login");
    };

    const handleSearch = (e) => {

        if (e.key === "Enter") {

            const searchValue = search.trim();

            if (!searchValue) {
                return;
            }

            navigate(
                `/movies?search=${encodeURIComponent(searchValue)}`
            );

        }

    };

    return (
        <header className="user-navbar">

            <Link to="/" className="user-navbar-logo">
                MOVIEVERSE
            </Link>

            <nav className="user-navbar-center">

                <Link to="/movies">
                    Movies
                </Link>

                <div className="user-navbar-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        aria-label="Search"
                        placeholder="Search movies..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={handleSearch}
                    />

                </div>

                <Link to="/movie-roulette">
                    Movie Roulette
                </Link>

            </nav>

            <div className="user-navbar-actions">

                {!user ? (

                    <>

                        <Link
                            to="/login"
                            className="nav-pill"
                        >
                            Sign in
                        </Link>

                        <Link
                            to="/register"
                            className="nav-pill"
                        >
                            Join
                        </Link>

                    </>

                ) : (

                    <div className="user-navbar-profile-wrapper">

                        <button
                            type="button"
                            className="user-navbar-profile"
                            onClick={() =>
                                setShowMenu(!showMenu)
                            }
                        >

                            <div className="user-navbar-profile-image">

                                {user.profileImage ? (

                                    <img
                                        src={
                                            user.profileImage.startsWith("http")
                                                ? user.profileImage
                                                : `http://localhost:5000${user.profileImage}`
                                        }
                                        alt={
                                            user.name ||
                                            user.username
                                        }
                                    />

                                ) : (

                                    <span>
                                        {(user.name ||
                                            user.username ||
                                            "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                )}

                            </div>

                            <span className="user-navbar-profile-name">
                                {user.name || user.username}
                            </span>

                            <span className="user-navbar-profile-arrow">
                                ▼
                            </span>

                        </button>

                        {showMenu && (

                            <div className="user-profile-dropdown">

                                <Link
                                    to="/profile"
                                    onClick={() =>
                                        setShowMenu(false)
                                    }
                                >
                                    Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </header>
    );
}

export default UserNavbar;