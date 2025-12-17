import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";


export default function MealListPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/meals") // ✅ 正確 API
      .then(res => {
        console.log("meals:", res.data); // 👈 建議留著確認
        setMeals(res.data);
      })
      .catch(err => {
        console.error("取得餐點失敗", err);
      });
  }, []);

  return (
    <Box sx={{ width: "80%", mx: "auto", mt: 4 }}>
      {/* 餐點列表 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 4
        }}
      >
        {meals.map(meal => (
  <Box key={meal.mealsID}>
    <Link to={`/meals/${meal.mealsID}`}>
      <Box
        component="img"
        src={`http://localhost:3000/${meal.mealsPhoto}`}
        alt={meal.mealName}
        sx={{ width: "70%", border: "1px solid #ccc" }}
      />
    </Link>

    <Typography sx={{ mt: 1, fontSize: 14 }}>
      【餐點】{meal.mealName}　${meal.mealsPrice}
    </Typography>
  </Box>
))}

      </Box>

      {/* 底部說明文字 */}
      <Typography sx={{ textAlign: "center", fontSize: 12, mt: 6 }}>
        相關查詢餐飲介面示意圖
      </Typography>
    </Box>
  );
}
