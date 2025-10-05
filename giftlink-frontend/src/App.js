import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/modern-ui.css"; // Import our modern UI system

// import components
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import Profile from "./components/Profile/Profile";
import DetailsPage from "./components/DetailsPage/DetailsPage";
import SearchPage from "./components/SearchPage/SearchPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Example: automatically redirect to /app/login if not authenticated
    // Removed to allow access to register page
    const isAuthenticated = false; // replace with real auth logic
    // if (!isAuthenticated) {
    //   navigate("/app/login");
    // }
  }, [navigate]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/register" element={<RegisterPage />} />
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/gifts/:id" element={<DetailsPage />} />
          <Route path="/app/search" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
