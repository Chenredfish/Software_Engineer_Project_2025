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
    return <Typography>未選擇場次，請返回訂票頁面</Typography>;
  }

  const [ticketClasses, setTicketClasses] = useState([]);
  const [meals, setMeals] = useState([]);

  const [ticketCounts, setTicketCounts] = useState({});
  const [mealCounts, setMealCounts] = useState({});

  const MAX_TICKETS = 10;
  const apiBase = "http://localhost:3000";

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
  // 計算總價格
  // =========================
  const totalPrice =
    (Array.isArray(ticketClasses) ? ticketClasses : []).reduce(
      (sum, t) => sum + (ticketCounts[t.ticketClassID] || 0) * t.ticketClassPrice,
      0
    ) +
    (Array.isArray(meals) ? meals : []).reduce(
      (sum, m) => sum + (mealCounts[m.mealsID] || 0) * m.mealsPrice,
      0
    );

  // =========================
  // 改變票數
  // =========================
  const handleTicketChange = (id, val) => {
    const newCount = Number(val || 0);
    const newTotal = Object.entries(ticketCounts).reduce((sum, [key, value]) => {
      return sum + (key === id ? newCount : Number(value || 0));
    }, 0);

    if (newTotal > MAX_TICKETS) {
      alert(`票數總和不能超過 ${MAX_TICKETS} 張`);
      return;
    }

    setTicketCounts(prev => ({ ...prev, [id]: newCount }));
  };

  // =========================
  // 前往 SeatPage
  // =========================
  const handleNext = () => {
    if (totalTickets === 0) {
      alert("請選擇至少一張票");
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
        {(Array.isArray(ticketClasses) ? ticketClasses : []).map(tc => (
          <Box
            key={tc.ticketClassID}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ width: 160 }}>
              {tc.ticketClassName} (${tc.ticketClassPrice})
            </Typography>
            <TextField
              type="number"
              size="small"
              sx={{ width: 100 }}
              value={ticketCounts[tc.ticketClassID] || 0}
              onChange={e => handleTicketChange(tc.ticketClassID, e.target.value)}
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          餐點選擇
        </Typography>
        <Grid container spacing={3}>
          {(Array.isArray(meals) ? meals : []).map(meal => (
            <Grid item key={meal.mealsID} xs={12} sm={6} md={4}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:3000/${meal.mealsPhoto}`}
                  alt={meal.mealName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{meal.mealName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${meal.mealsPrice}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ mt: 1, width: "80px" }}
                    value={mealCounts[meal.mealsID] || 0}
                    onChange={e =>
                      setMealCounts(prev => ({
                        ...prev,
                        [meal.mealsID]: Number(e.target.value || 0),
                      }))
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

      {/* 總價格 */}
      <Typography variant="h6">總價：${totalPrice}</Typography>

      {/* 下一步 */}
      <Box mt={3} textAlign="right">
        <Button variant="contained" size="large" onClick={handleNext}>
          確認並選座
        </Button>
      </Box>
    </Box>
  );
}
