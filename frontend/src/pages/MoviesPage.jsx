import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MoviesPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => {
        console.log("movies:", res.data); // 👈 建議先看一次
        setMovies(res.data);
      })
      .catch(() => {
        alert("電影資料尚未接入");
      });
  }, []);

  return (
    <Box sx={{ width: "85%", margin: "40px auto" }}>
      <Typography sx={{ fontSize: 28, fontWeight: "bold", mb: 4 }}>
        電影介紹
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 4
        }}
      >
        {movies.map(movie => (
          <Box
            key={movie.movieID}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/movies/${movie.movieID}`)}
          >
            {/* 電影海報 */}
            <Box
              component="img"
              src={`http://localhost:3000/${movie.moviePhoto}`}
              alt={movie.movieName}
              sx={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 1,
                mb: 1
              }}
            />

            {/* 分級（先顯示 ID，之後可對照 rated 表） */}
            <Typography sx={{ fontSize: 12, color: "#888" }}>
              分級：{movie.ratedID}
            </Typography>

            {/* 電影名稱 */}
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              {movie.movieName}
            </Typography>

            {/* 導演 */}
            <Typography sx={{ fontSize: 12 }}>
              導演：{movie.director}
            </Typography>

            {/* 上映日期 */}
            <Typography sx={{ fontSize: 12, color: "#666" }}>
              上映日期：{movie.movieStartDate}
            </Typography>

            {/* 片長 */}
            <Typography sx={{ fontSize: 12, color: "#666" }}>
              片長：{movie.movieTime}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography
        sx={{ textAlign: "center", fontSize: 12, color: "#666", mt: 6 }}
      >
        相關查詢電影介紹示意圖
      </Typography>
    </Box>
  );
}
