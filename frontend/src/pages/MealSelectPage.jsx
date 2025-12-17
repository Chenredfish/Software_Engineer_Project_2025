import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function MealSelectPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const showing = state?.showing;

  if (!showing) {
    return <Typography>尚未選擇場次，請返回訂票頁面</Typography>;
  }

  const apiBase = "http://localhost:3000";
  const MAX_TICKETS = 10;

  const [ticketClasses, setTicketClasses] = useState([]);
  const [meals, setMeals] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});
  const [mealCounts, setMealCounts] = useState({});

  // =========================
  // 取得票種 & 餐點
  // =========================
  useEffect(() => {
    fetch(`${apiBase}/api/ticketclasses`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTicketClasses(data);
        else if (Array.isArray(data.ticketclasses)) setTicketClasses(data.ticketclasses);
        else setTicketClasses([]);
      })
      .catch(() => alert("票種資料讀取失敗"));

    fetch(`${apiBase}/api/meals`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMeals(data);
        else if (Array.isArray(data.meals)) setMeals(data.meals);
        else setMeals([]);
      })
      .catch(() => alert("餐點資料讀取失敗"));
  }, []);

  // =========================
  // 計算總票數
  // =========================
  const totalTickets = Object.values(ticketCounts).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  // =========================
  // 計算餐點總數
  // =========================
  const totalMeals = Object.values(mealCounts).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  // =========================
  // 計算總價格
  // =========================
  const totalPrice =
    ticketClasses.reduce(
      (sum, t) =>
        sum + (ticketCounts[t.ticketClassID] || 0) * t.ticketClassPrice,
      0
    ) +
    meals.reduce(
      (sum, m) =>
        sum + (mealCounts[m.mealsID] || 0) * m.mealsPrice,
      0
    );

  // =========================
  // 改變票數（限制 10 張）
  // =========================
  const handleTicketChange = (id, val) => {
    const newCount = Number(val || 0);

    const newTotal = Object.entries(ticketCounts).reduce(
      (sum, [key, value]) =>
        sum + (key === id ? newCount : Number(value || 0)),
      0
    );

    if (newTotal > MAX_TICKETS) {
      alert(`票數總和不能超過 ${MAX_TICKETS} 張`);
      return;
    }

    setTicketCounts(prev => ({
      ...prev,
      [id]: newCount,
    }));

    // 若票數變少，餐點超過則清掉
    if (totalMeals > newTotal) {
      setMealCounts({});
    }
  };

  // =========================
  // 改變餐點數（不得超過票數）
  // =========================
  const handleMealChange = (id, val) => {
    const newCount = Number(val || 0);

    const newTotalMeals = Object.entries(mealCounts).reduce(
      (sum, [key, value]) =>
        sum + (key === id ? newCount : Number(value || 0)),
      0
    );

    if (newTotalMeals > totalTickets) {
      alert("餐點數量不能超過訂票數量");
      return;
    }

    setMealCounts(prev => ({
      ...prev,
      [id]: newCount,
    }));
  };

  // =========================
  // 前往 SeatPage
  // =========================
  const handleNext = () => {
    if (totalTickets === 0) {
      alert("請選擇至少一張票");
      return;
    }

    if (totalMeals > totalTickets) {
      alert("餐點數量不能超過訂票數量");
      return;
    }

    navigate("/seat", {
      state: {
        showing,
        ticketCounts,
        mealCounts,
        totalPrice,
      },
    });
  };

  // =========================
  // Render
  // =========================
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        選擇票種 & 餐點
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {showing.movieName} ｜ {showing.showingTime}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* 票種選擇 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          票種選擇
        </Typography>

        {ticketClasses.map(tc => (
          <Box
            key={tc.ticketClassID}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ width: 180 }}>
              {tc.ticketClassName} (${tc.ticketClassPrice})
            </Typography>
            <TextField
              type="number"
              size="small"
              sx={{ width: 100 }}
              value={ticketCounts[tc.ticketClassID] || 0}
              onChange={e =>
                handleTicketChange(tc.ticketClassID, e.target.value)
              }
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}

        <Typography sx={{ mt: 1 }}>
          總票數：{totalTickets} / {MAX_TICKETS}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 餐點選擇 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          餐點選擇
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          餐點最多可選 {totalTickets} 份
        </Typography>

        <Grid container spacing={3}>
          {meals.map(meal => (
            <Grid item key={meal.mealsID} xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${apiBase}/${meal.mealsPhoto}`}
                  alt={meal.mealName}
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {meal.mealName}
                  </Typography>
                  <Typography color="text.secondary">
                    ${meal.mealsPrice}
                  </Typography>

                  <TextField
                    type="number"
                    size="small"
                    sx={{ mt: 1, width: 80 }}
                    value={mealCounts[meal.mealsID] || 0}
                    onChange={e =>
                      handleMealChange(meal.mealsID, e.target.value)
                    }
                    inputProps={{ min: 0 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">總價：${totalPrice}</Typography>

      <Box mt={3} textAlign="right">
        <Button variant="contained" size="large" onClick={handleNext}>
          確認並選擇座位
        </Button>
      </Box>
    </Box>
  );
}
