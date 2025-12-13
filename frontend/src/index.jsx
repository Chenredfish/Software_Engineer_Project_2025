// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import RegisterPage from './pages/RegisterPage';

// 找到 public/index.html 裡的 root div
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RegisterPage />
  </React.StrictMode>
);
