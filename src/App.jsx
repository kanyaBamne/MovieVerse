import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import Users from "./pages/Users";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Admin pages */}
        <Route
          path="/admin/*"
          element={
            <Layout>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="movies" element={<Movies />} />
                <Route path="movies/add" element={<AddMovie />} />
                <Route path="movies/edit/:id" element={<EditMovie />} />
                <Route path="users" element={<Users />} />
              </Routes>
            </Layout>
          }
        />

        {/* Open project → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Unknown URL → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;