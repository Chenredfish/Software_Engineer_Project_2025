import { useState } from "react";
import React from "react";

// 整合用途: 已實作完整的座位選擇功能 (B22)
// 假設資料庫傳回的已售出座位 (示例)
const soldSeats = new Set([
  "D5", "D6", "D7",
  "E10", "E11", "E12",
  "H8", "H9",
  "M5", "M6",
]);

const rows = "ABCDEFGHIJKLM".split("");
const cols = Array.from({ length: 20 }, (_, i) => i + 1); // 1~20

export default function SeatMap() {
  const [selected, setSelected] = useState(new Set());

  const toggleSeat = (key) => {
    if (soldSeats.has(key)) return; // 售出不可點

    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const getColor = (key) => {
    if (soldSeats.has(key)) return "bg-red-400 border-red-600 cursor-not-allowed";
    if (selected.has(key)) return "bg-blue-300 border-blue-600";
    return "bg-white border-gray-400 hover:bg-gray-100";
  };

  return (
    <div className="w-full flex flex-col items-center p-6">
      {/* 螢幕 */}
      <div className="text-xl font-bold mb-4">螢幕 Screen</div>
      <div className="w-96 h-2 bg-black mb-6"></div>

      {/* 座位表 */}
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            {/* Row label */}
            <div className="w-6 text-right font-semibold">{row}</div>

            {cols.map((col) => {
              const key = `${row}${col}`;
              return (
                <button
                  key={key}
                  onClick={() => toggleSeat(key)}
                  className={`w-8 h-8 border text-xs flex items-center justify-center rounded ${getColor(key)}`}
                >
                  {col}
                </button>
              );
            })}

            {/* Row label */}
            <div className="w-6 font-semibold">{row}</div>
          </div>
        ))}
      </div>
    </div>
  );
}