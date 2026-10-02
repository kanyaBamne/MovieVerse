import { Link } from "react-router-dom";

function UserNavbar() {

    const user = JSON.parse(
        sessionStorage.getItem("user")
    );

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

                    <Link
                        to="/profile"
                        className="user-navbar-profile"
                    >

                        <div className="user-navbar-profile-image">

                            {user.profileImage ? (

                                <img
                                    src={
                                        user.profileImage.startsWith("http")
                                            ? user.profileImage
                                            : `http://localhost:5000${user.profileImage}`
                                    }
                                    alt={user.name || user.username}
                                />

                            ) : (

                                <span>
                                    {(user.name || user.username || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>

                            )}

                        </div>


                        <span className="user-navbar-profile-name">
                            {user.name || user.username}
                        </span>

                    </Link>

                )}

            </div>

        </header>
    );
}

export default UserNavbar;