import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                MovieVerse
            </div>

            <nav className="sidebar-nav">

                <NavLink to="/admin" end>
                    Dashboard
                </NavLink>

                <NavLink to="/admin/movies">
                    Movies
                </NavLink>

                <NavLink to="/admin/users">
                    Users
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <button
                    className="logout-btn"
                    onClick={() => navigate("/login")}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;