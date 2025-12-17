import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SeatPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const showing = state?.showing;
  const ticketCounts = state?.ticketCounts || {};
  const mealCounts = state?.mealCounts || {};
  const totalPriceFromMeal = state?.totalPrice || 0;

  // ✅ 假設會員資訊在更前一頁已放進來
  const memberID = state?.memberID;
  const memberBalance = state?.memberBalance || 0;

  const showingID = showing?.showingID;

  if (!showingID || !Object.keys(ticketCounts).length) {
    return <Typography>請先選擇票種，才能選座位</Typography>;
  }

  const totalTickets = Object.values(ticketCounts).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // ⭐ 新增：票種 & 餐點完整資料
  const [tickets, setTickets] = useState([]);
  const [meals, setMeals] = useState([]);

  const apiBase = "http://localhost:3000";
  const rows = ["A", "B", "C", "D", "E"];
  const MAX_SEATS = totalTickets;

  // =========================
  // 取得座位
  // =========================
  useEffect(() => {
    fetch(`${apiBase}/api/showings/${showingID}/seats`)
      .then((res) => res.json())
      .then(setSeats)
      .catch(() => setSeats([]));
  }, [showingID]);

  // =========================
  // ⭐ 取得票種 & 餐點
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
  // ✅ 前往付款（重點在這）
  // =========================
  const handleNext = () => {
    if (selectedSeats.length !== MAX_SEATS) {
      alert(`請選擇 ${MAX_SEATS} 個座位`);
      return;
    }

    navigate("/payment", {
      state: {
        showing,
        selectedSeats,
        ticketCounts,
        mealCounts,
        tickets,        // ⭐ 關鍵
        meals,          // ⭐ 關鍵
        totalPrice: totalPriceFromMeal,
        memberID,       // ⭐ 關鍵
        memberBalance,  // ⭐ 關鍵
      },
    });
  };

  const seatsByRow = rows.map((row) =>
    seats
      .filter((s) => s.seatNumber.startsWith(row))
      .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        選擇座位
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {showing.movieName} ｜ {showing.showingTime}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: "center", mb: 4, py: 1, bgcolor: "#eee" }}>
        <Typography fontWeight="bold">銀幕 SCREEN</Typography>
      </Box>

      {seatsByRow.map((rowSeats, index) => (
        <Box key={index} mb={2}>
          <Typography>{rows[index]} 排</Typography>
          <Grid container spacing={1}>
            {rowSeats.map((seat) => (
              <Grid item key={seat.seatNumber}>
                <Button
                  variant={
                    selectedSeats.includes(seat.seatNumber)
                      ? "contained"
                      : "outlined"
                  }
                  color={seat.seatState === 1 ? "error" : "primary"}
                  disabled={seat.seatState === 1}
                  onClick={() => toggleSeat(seat.seatNumber)}
                >
                  {seat.seatNumber}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Box mt={4} textAlign="right">
        <Button variant="contained" size="large" onClick={handleNext}>
          前往付款
        </Button>
      </Box>
    </Box>
  );
}
