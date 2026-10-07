import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import "./App.css";

import Layout from "./components/Layout";
import UserNavbar from "./components/UserNavbar";

import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import Users from "./pages/Users";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import MovieRoulette from "./pages/MovieRoulette";
import MovieDetail from "./pages/MovieDetail";
import MovieLibrary from "./components/MovieLibrary";

function ProtectedRoute({ children }) {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function AppContent() {

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin");

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register";

    return (
        <>
            {!isAdminPage && !isAuthPage && <UserNavbar />}

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Home */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* About */}
                <Route
                    path="/about"
                    element={<AboutUs />}
                />

                {/* Movie Roulette */}
                <Route
                    path="/movie-roulette"
                    element={<MovieRoulette />}
                />

                {/* Movies */}
                <Route
                    path="/movies"
                    element={<MovieLibrary />}
                />

                {/* Movie Detail */}
                <Route
                    path="/movies/:id"
                    element={<MovieDetail />}
                />

                {/* Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/admin/*"
                    element={
                        <Layout>

                            <Routes>

                                <Route
                                    path=""
                                    element={<Dashboard />}
                                />

                                <Route
                                    path="movies"
                                    element={<Movies />}
                                />

                                <Route
                                    path="movies/add"
                                    element={<AddMovie />}
                                />

                                <Route
                                    path="movies/edit/:id"
                                    element={<EditMovie />}
                                />

                                <Route
                                    path="users"
                                    element={<Users />}
                                />

                            </Routes>

                        </Layout>
                    }
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}


function App() {

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}


export default App;