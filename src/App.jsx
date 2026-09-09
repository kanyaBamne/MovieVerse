import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import Users from "./pages/Users";
import Login from "./pages/Login";


function App() {

  return (
    <>
       <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/movies" element={<Movies />} />
          <Route path="/admin/movies/add" element={<AddMovie />} />
          <Route path="/admin/movies/edit/:id" element={<EditMovie />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </>
  )
}

export default App
