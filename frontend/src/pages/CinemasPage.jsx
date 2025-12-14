import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  axios
    .get("http://localhost:3000/api/cinemas")
    .then(res => {
      console.log("cinemas:", res.data);
      setCinemas(res.data);
    })
    .catch(err => {
      console.error(err);
      alert("影城資料尚未接入");
    });
}, []);

  return (
  <div style={{ width: "80%", margin: "40px auto" }}>
    <h2 style={{ textAlign: "center", marginBottom: 30 }}>影城介紹</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 30
      }}
    >
      {cinemas.map(cinema => (
        <div
          key={cinema.cinemaID}
          style={{
            display: "flex",
            gap: 16,
            border: "1px solid #ddd",
            padding: 16,
            cursor: "pointer"
          }}
          onClick={() => navigate(`/cinemas/${cinema.cinemaID}`)}
        >
          {/* 左邊：圖片 */}
          <img
            src={`http://localhost:3000/${cinema.cinemaPhoto}`}
            alt={cinema.cinemaName}
            style={{
              width: 160,
              height: 110,
              objectFit: "cover"
            }}
          />

          {/* 右邊：文字 */}
          <div>
            <div
              style={{
                color: "#1a73e8",
                fontWeight: "bold",
                marginBottom: 6
              }}
            >
              {cinema.cinemaName}
            </div>

            <div style={{ fontSize: 14, marginBottom: 4 }}>
              📍 {cinema.cinemaAddress}
            </div>

            <div style={{ fontSize: 14 }}>
              ☎ {cinema.cinemaPhoneNumber}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
