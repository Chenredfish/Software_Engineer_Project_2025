import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

export default function MealDetailPage() {
  const { id } = useParams(); // M00001
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/meals")
      .then(res => {
        const found = res.data.find(m => m.mealsID === id);
        setMeal(found);
      });
  }, [id]);

  if (!meal) return null;

  return (
    <Box sx={{ width: "80%", mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* 左邊圖片 */}
        <Box
          component="img"
          src={`http://localhost:3000/${meal.mealsPhoto}`}
          sx={{ width: 420 }}
        />

        {/* 右邊文字 */}
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 2 }}>
            【餐點】{meal.mealName}
          </Typography>

          <Typography sx={{ color: "#d32f2f", mb: 1 }}>
            ▶ 餐點售價：NT${meal.mealsPrice}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            ▶ 餐飲類別：影城餐點
          </Typography>

          <Typography sx={{ mb: 1 }}>
            ▶ 上架影城：全台影城
          </Typography>

          <Typography sx={{ mt: 2 }}>
            ▶ 商品說明：<br />
            {meal.mealsDisp}
          </Typography>
        </Box>
      </Box>

      <Button
        sx={{ mt: 4 }}
        variant="outlined"
        onClick={() => navigate(-1)}
      >
        回上一頁
      </Button>
    </Box>
  );
}
