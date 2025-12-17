import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  Grid,
  Card,
  TextField,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return <Typography>付款資料遺失，請重新訂票</Typography>;
  }

  const {
    showing,
    selectedSeats = [],
    ticketCounts = {},
    mealCounts = {},
    totalPrice = 0,
    memberID,
    memberBalance = 0,
  } = state;

  const apiBase = "http://localhost:3000";
  const [paymentMethod, setPaymentMethod] = useState("stored");
  const [loading, setLoading] = useState(false);

  const [ticketClasses, setTickets] = useState([]);
  const [mealList, setMeals] = useState([]);

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
  });

  // =========================
  // 讀取票種 / 餐點參考資料
  // =========================
  useEffect(() => {
    fetch(`${apiBase}/api/ticketclasses`)
      .then((res) => res.json())
      .then(setTickets)
      .catch(() => setTickets([]));

    fetch(`${apiBase}/api/meals`)
      .then((res) => res.json())
      .then(setMeals)
      .catch(() => setMeals([]));
  }, []);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        alert(`最多只能選擇 ${MAX_SEATS} 張座位`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // =========================
  // 付款
  // =========================
  const handlePay = async () => {
    if (paymentMethod === "credit") {
      const { cardNumber, expirationDate, securityCode } = cardInfo;
      if (!cardNumber || !expirationDate || !securityCode) {
        alert("請填寫完整信用卡資訊");
        return;
      }
    }

    if (paymentMethod === "stored" && memberBalance < totalPrice) {
      alert("儲值卡餘額不足");
      return;
    }

    // ⭐ 多票種
    const ticketsPayload = Object.entries(ticketCounts)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketClassID, quantity]) => ({
        ticketClassID,
        quantity,
      }));

    // ⭐ 多餐點
    const mealsPayload = Object.entries(mealCounts)
      .filter(([_, qty]) => qty > 0)
      .map(([mealsID, quantity]) => ({
        mealsID,
        quantity,
      }));

    const payload = {
      memberID,
      showingID: showing.showingID,
      seatNumbers: selectedSeats,
      tickets: ticketsPayload,
      meals: mealsPayload,
      totalPrice,
      paymentMethod: paymentMethod === "stored" ? "balance" : "creditcard",
      cardInfo:
        paymentMethod === "credit"
          ? cardInfo
          : { cardNumber: "", expirationDate: "", securityCode: "" },
    };

    try {
      setLoading(true);

      const res = await axios.post("/api/bookings/create", payload);

      if (res.data.success) {
        alert("付款成功");
        navigate("/success", {
          state: { orderID: res.data.orderID },
        });
      } else {
        alert(res.data.error || "付款失敗");
      }
    } catch (err) {
      alert(err.response?.data?.error || "付款失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      {/* 付款方式 */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ mb: 1 }}>付款方式：</Typography>
        <Select
          size="small"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="stored">儲值卡</MenuItem>
          <MenuItem value="credit">信用卡</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={4}>
        {/* 左：訂票資訊 */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">訂票資訊</Typography>

            <Typography>電影：{showing.movieName}</Typography>
            <Typography>影廳：{showing.theaterName}</Typography>
            <Typography>場次：{showing.showingTime}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography>座位：{selectedSeats.join(", ")}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography>票種：</Typography>
            {Object.entries(ticketCounts).map(([id, count]) => {
              if (count <= 0) return null;
              const ticket = ticketClasses.find(
                (t) => t.ticketClassID === id
              );
              return (
                <Typography key={id}>
                  {ticket?.ticketClassName || id} × {count}
                </Typography>
              );
            })}

            <Divider sx={{ my: 2 }} />

            <Typography>餐點：</Typography>
            {Object.entries(mealCounts).map(([id, count]) => {
              if (count <= 0) return null;
              const meal = mealList.find((m) => m.mealsID === id);
              return (
                <Typography key={id}>
                  {meal?.mealName || id} × {count}
                </Typography>
              );
            })}

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold">總計：${totalPrice}</Typography>
          </Card>
        </Grid>

        {/* 右：付款 */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">付款資訊</Typography>

            {paymentMethod === "stored" && (
              <>
                <Typography>儲值卡餘額：{memberBalance}</Typography>
                <Typography>本次消費：{totalPrice}</Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePay}
                  disabled={loading}
                >
                  確認付款
                </Button>
              </>
            )}

            {paymentMethod === "credit" && (
              <>
                <TextField
                  label="信用卡號"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={cardInfo.cardNumber}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                  }
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="有效期限"
                      fullWidth
                      value={cardInfo.expirationDate}
                      onChange={(e) =>
                        setCardInfo({
                          ...cardInfo,
                          expirationDate: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="CVC"
                      fullWidth
                      value={cardInfo.securityCode}
                      onChange={(e) =>
                        setCardInfo({
                          ...cardInfo,
                          securityCode: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePay}
                  disabled={loading}
                >
                  確認付款
                </Button>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
