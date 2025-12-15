import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MovieDetailPage() {
  const { movieID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/movies/${movieID}`)
      .then(res => {
        setMovie(res.data);
      })
      .catch(() => {
        alert("找不到電影資料");
        navigate("/movies");
      });
  }, [movieID, navigate]);

  if (!movie) return null;

  return (
    <Box sx={{ width: "80%", margin: "40px auto" }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* 左側海報 */}
        <Box sx={{ width: 260 }}>
          <img
            src={`http://localhost:3000/${movie.moviePhoto}`}
            alt={movie.movieName}
            style={{ width: "100%" }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/book")}
          >
            前往訂票
          </Button>
        </Box>

        {/* 右側資訊 */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
            {movie.movieName}
          </Typography>

          <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
            導演：{movie.director}
          </Typography>

          <Typography sx={{ fontSize: 14, mb: 2 }}>
            演員：{movie.actors}
          </Typography>

          <Typography sx={{ fontSize: 14, mb: 2 }}>
            片長：{movie.movieTime}
          </Typography>

          <Typography sx={{ fontSize: 14, mb: 2 }}>
            上映日期：{movie.movieStartDate}
          </Typography>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            劇情簡介
          </Typography>

          <Typography sx={{ fontSize: 14, lineHeight: 1.8 }}>
            {movie.movieInfo}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{ textAlign: "center", fontSize: 12, color: "#666", mt: 5 }}
      >
        相關查詢電影詳細資訊介面示意圖
      </Typography>
    </Box>
  );
}
