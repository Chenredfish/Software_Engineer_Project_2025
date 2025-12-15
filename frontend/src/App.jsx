import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";//換頁面時會用到的東西
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";//登入子系統的路由
import RelatedBrowsePage from "./pages/RelatedBrowsePage";
import CinemasPage from "./pages/CinemasPage";
import CinemaDetailPage from "./pages/CinemaDetailPage";
import BookPage from "./pages/BookPage";
import MemberPage from "./pages/MemberPage";
import MoviesPage from "./pages/MoviesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import TopUpPage from "./pages/TopUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<RelatedBrowsePage />} />
        <Route path="/cinemas" element={<CinemasPage />} />
        <Route path="/cinemas/:id" element={<CinemaDetailPage />} />
        <Route path="/movies" element={<MoviesPage/>} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/movies/:movieID" element={<MovieDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/topup" element={<TopUpPage />} />


        {/* 以下都先未接入 */}
        <Route path="/activities" element={<Placeholder title="活動介紹" />} />
        <Route path="/meals" element={<Placeholder title="餐飲介紹" />} />
        <Route path="/quick-search" element={<Placeholder title="快搜系統" />} />
      </Routes>
    </BrowserRouter>
  );
}

function Placeholder({ title }) {
  return <h2 style={{ textAlign: "center" }}>{title}（尚未接入）</h2>;
}

export default App;
