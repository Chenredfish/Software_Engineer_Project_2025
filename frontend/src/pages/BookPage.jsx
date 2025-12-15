import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import MovieSelect from "../InputComponent/MovieSelect";
import CinemaSelect from "../InputComponent/CinemaSelect";
import TheaterSelect from "../InputComponent/theaterselect";
import SessionSelect from "../InputComponent/SessionSelect";

export default function BookPage() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [movieId, setMovieId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  const apiBase = "http://localhost:3000";

  /* ----------- 取得電影 & 影城 ----------- */
  useEffect(() => {
    fetch(`${apiBase}/api/movies`)
      .then(res => res.json())
      .then(setMovies)
      .catch(err => alert("電影資料讀取失敗"));

    fetch(`${apiBase}/api/cinemas`)
      .then(res => res.json())
      .then(setCinemas)
      .catch(err => alert("影城資料讀取失敗"));
  }, []);

  /* ----------- cinema → theaters ----------- */
  useEffect(() => {
    if (!cinemaId) {
      setTheaters([]);
      setTheaterId("");
      setSessions([]);
      setSessionId("");
      setSelectedSession(null);
      return;
    }

    fetch(`${apiBase}/api/cinemas/${cinemaId}/theaters`)
      .then(res => res.json())
      .then(data => {
        setTheaters(data.theaters || []);
        setTheaterId("");
        setSessions([]);
        setSessionId("");
        setSelectedSession(null);
      })
      .catch(() => alert("影廳資料讀取失敗"));
  }, [cinemaId]);

  /* ----------- movie + theater → sessions ----------- */
  useEffect(() => {
    if (!movieId || !theaterId) {
      setSessions([]);
      setSessionId("");
      setSelectedSession(null);
      return;
    }

    fetch(
      `${apiBase}/api/showings?movieID=${movieId}&theaterID=${theaterId}`
    )
      .then(res => res.json())
      .then(data => {
        setSessions(data || []);
        setSessionId("");
        setSelectedSession(null);
      })
      .catch(() => alert("場次資料讀取失敗"));
  }, [movieId, theaterId]);

  /* ----------- 前往 SeatPage ----------- */
  const handleBooking = () => {
    if (!selectedSession) return;

    // 使用 navigate state 傳資料
    navigate(`/seat/${selectedSession.showingID}`, {
      state: { showing: selectedSession },
    });
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        我要訂票
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ width: 300 }}>
        <MovieSelect movies={movies} value={movieId} onChange={setMovieId} />
        <CinemaSelect cinemas={cinemas} value={cinemaId} onChange={setCinemaId} />
        <TheaterSelect theaters={theaters} value={theaterId} onChange={setTheaterId} />

        <SessionSelect
          sessions={sessions}
          value={sessionId}
          onChange={(id) => {
            setSessionId(id);
            setSelectedSession(
              sessions.find((s) => s.showingID === id)
            );
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!selectedSession}
          onClick={handleBooking}
        >
          前往選座位
        </Button>
      </Box>
    </Box>
  );
}
