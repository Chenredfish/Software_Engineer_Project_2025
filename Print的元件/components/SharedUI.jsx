// src/components/SharedUI.jsx
// 共用UI元件（無外部依賴，Tailwind類名僅作樣式鉤子，可有可無）
import React from "react";

export function InfoCard({ title, subtitle, children }) {
  return (
    <div className="w-full rounded-2xl shadow p-4 border border-gray-200 mb-4 bg-white">
      {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}
      <div className="text-gray-900">{children}</div>
    </div>
  );
}

export function Alert({ type = "info", children }) {
  const palette = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };
  return (
    <div className={`w-full rounded-xl p-3 border ${palette[type] || palette.info} mb-3`}>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export function KeyValue({ label, value }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}