import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";//換頁面時會用到的東西
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "./pages/LoginPage";//登入子系統的路由

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
