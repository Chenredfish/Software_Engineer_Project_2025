import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";//換頁面時會用到的東西
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";//登入子系統的路由
import MoviesPage from "./pages/MoviesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
