import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CinemaDetailPage() {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/cinema/${id}`)
      .then(res => setCinema(res.data))
      .catch(() => alert("影城詳細資料尚未接入"));
  }, [id]);

  if (!cinema) return <p style={{ textAlign: "center" }}>載入中...</p>;

  return (
    <div style={{ width: "70%", margin: "40px auto" }}>
      <h2>{cinema.cinemaName}</h2>
      <p>地址：{cinema.cinemaAddress}</p>
      <p>電話：{cinema.cinemaPhoneNumber}</p>
      <p>營業時間：{cinema.cinemaBusinessTime}</p>

      <p style={{ marginTop: 20, color: "#888" }}>
        ※ 更多功能尚未接入
      </p>
    </div>
  );
}
