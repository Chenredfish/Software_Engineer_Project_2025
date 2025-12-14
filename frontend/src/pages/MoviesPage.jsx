import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MoviesPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        🎬 電影頁面（尚未接資料）
      </Typography>

      <Typography sx={{ mb: 4 }}>
        此頁面為登入成功後的導向頁，之後會接電影清單 API。
      </Typography>

      <Button
        variant="outlined"
        onClick={() => navigate("/login")}
      >
        登出（回登入頁）
      </Button>
    </Box>
  );
}
