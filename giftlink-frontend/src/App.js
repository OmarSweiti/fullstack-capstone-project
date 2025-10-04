import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// import components
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import LoginPage from "./components/LoginPage/LoginPage";
import Profile from "./components/Profile/Profile";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Example: automatically redirect to /app/login if not authenticated
    const isAuthenticated = false; // replace with real auth logic
    if (!isAuthenticated) {
      navigate("/app/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
