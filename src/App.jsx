import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";

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

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* User authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route
                    path="/movie-roulette"
                    element={<MovieRoulette />}
                />
                <Route
                    path="/movies"
                    element={<MovieLibrary />}
                />
                <Route
                    path="/movies/:id"
                    element={<MovieDetail />}
                />
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* Admin pages */}
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

                {/* Unknown URL → Login */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;