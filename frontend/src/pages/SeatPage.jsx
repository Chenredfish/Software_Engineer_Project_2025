import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";

export default function SeatSelectPage() {
  const { state } = useLocation(); // BookPage 傳過來的 session
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const apiBase = "http://localhost:3000";

  const showing = state?.session;

  // 取得座位資訊
  useEffect(() => {
    if (!sessionId) return;
    const fetchSeats = async () => {
      try {
        const res = await fetch(`${apiBase}/api/seats?showingID=${sessionId}`);
        const data = await res.json();
        setSeats(data); // seatNumber, seatState (0=空, 1=已訂)
      } catch (err) {
        console.error(err);
        alert("座位資料讀取失敗");
      }
    };
    fetchSeats();
  }, [sessionId]);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("請選擇至少一個座位");
      return;
    }
    // 跳到付款頁，傳送座位與 showingID
    navigate(`/payment/${sessionId}`, {
      state: { selectedSeats, showing },
    });
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        選取座位 - {showing?.movieName} ({showing?.showingTime})
      </Typography>

      <Box mt={2}>
        <Grid container spacing={1}>
          {seats.map((seat) => (
            <Grid item key={seat.seatNumber}>
              <Button
                variant={selectedSeats.includes(seat.seatNumber) ? "contained" : "outlined"}
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

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          前往付款
        </Button>
      </Box>
    </Box>
  );
}
