import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SeatPage() {
  // =========================
  // Router 資料
  // =========================
  const { state } = useLocation();
  const navigate = useNavigate();

  const showing = state?.showing;
  const ticketCounts = state?.ticketCounts || {};
  const mealCounts = state?.mealCounts || {};
  const totalPriceFromMeal = state?.totalPrice || 0;

  const showingID = showing?.showingID;

  // 防呆：未選票或沒有 showingID
  if (!showingID || !Object.keys(ticketCounts).length) {
    return <Typography>請先選擇票種，才能選座位</Typography>;
  }

  // =========================
  // 計算總票數
  // =========================
  const totalTickets = Object.values(ticketCounts).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  // =========================
  // State
  // =========================
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const apiBase = "http://localhost:3000";
  const rows = ["A", "B", "C", "D", "E"];
  const MAX_SEATS = totalTickets; // 最大可選座位數量 = 票數總和

  // =========================
  // 取得座位資料
  // =========================
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch(`${apiBase}/api/showings/${showingID}/seats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("座位資料不是陣列", data);
          setSeats([]);
          return;
        }

        setSeats(data);
      } catch (err) {
        console.error("讀取座位失敗 👉", err);
        setSeats([]);
      }
    };

    fetchSeats();
  }, [showingID]);

  // =========================
  // 選取 / 取消座位
  // =========================
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
  // 前往付款頁
  // =========================
  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("請至少選擇一個座位");
      return;
    }

    navigate("/payment", {
      state: {
        showing,
        ticketCounts,
        mealCounts,
        totalPrice: totalPriceFromMeal,
        selectedSeats,
      },
    });
  };

  // =========================
  // 將座位依排分組
  // =========================
  const seatsByRow = rows.map((row) =>
    seats
      .filter((s) => s.seatNumber.startsWith(row))
      .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
  );

  // =========================
  // Render
  // =========================
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* 標題 */}
      <Typography variant="h5" fontWeight="bold">
        選擇座位
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {showing?.movieName} ｜ {showing?.showingTime}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* 銀幕 */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          py: 1,
          backgroundColor: "#eee",
          borderRadius: 1,
        }}
      >
        <Typography fontWeight="bold">銀幕 SCREEN</Typography>
      </Box>

      {/* 座位區 */}
      {seatsByRow.map((rowSeats, index) => (
        <Box key={index} mb={2}>
          <Typography sx={{ mb: 1 }}>{rows[index]} 排</Typography>

          <Grid container spacing={1}>
            {rowSeats.length === 0 && (
              <Typography color="text.secondary" sx={{ ml: 2 }}>
                （此排無座位）
              </Typography>
            )}

            {rowSeats.map((seat) => (
              <Grid item key={seat.seatNumber}>
                <Button
                  sx={{ minWidth: 48 }}
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

      {/* 已選座位 */}
      <Box mt={3}>
        <Typography>
          已選座位：{selectedSeats.length > 0 ? selectedSeats.join(", ") : " 尚未選擇"}
        </Typography>
        <Typography color="text.secondary">
          （最多可選 {MAX_SEATS} 張）
        </Typography>
      </Box>

      {/* 下一步 */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" size="large" onClick={handleNext}>
          去付款
        </Button>
      </Box>
    </Box>
  );
}
