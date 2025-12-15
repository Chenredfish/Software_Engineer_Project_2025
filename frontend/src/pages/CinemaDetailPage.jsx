import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function CinemaDetailPage() {
  const { id } = useParams(); // 從網址拿 cinemaID
  const [cinema, setCinema] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/cinemas/${id}`)
      .then(res => setCinema(res.data))
      .catch(() => alert("影城資料載入失敗"));
  }, [id]);

  if (!cinema) return null;

  return (
    <Box sx={{ width: "80%", margin: "40px auto" }}>
      {/* 上方圖片 */}
      <Box sx={{ mb: 3 }}>
        <img
          src={`http://localhost:3000/${cinema.cinemaPhoto}`}
          alt={cinema.cinemaName}
          style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
        />
      </Box>

      {/* 影城名稱 */}
      <Typography sx={{ fontSize: 24, fontWeight: "bold", mb: 2 }}>
        {cinema.cinemaName}
      </Typography>

      {/* 基本資訊 */}
      <Typography sx={{ mb: 1 }}>
        📍 地址：{cinema.cinemaAddress}
      </Typography>

      <Typography sx={{ mb: 1 }}>
        ☎️ 電話：{cinema.cinemaPhoneNumber}
      </Typography>

      <Typography sx={{ mb: 3 }}>
        🕒 營業時間：{cinema.cinemaBusinessTime}
      </Typography>

      {/* 介紹文字（先寫死，之後你可拉 DB） */}
      <Typography sx={{ lineHeight: 1.8 }}>
        本影城提供最新放映設備、舒適座椅與完善服務，
        是您觀賞電影的最佳選擇。
      </Typography>

      <Typography
        sx={{ textAlign: "center", fontSize: 12, color: "#666", mt: 4 }}
      >
        相關查詢影城詳細資訊介面示意圖
      </Typography>
    </Box>
  );
}
