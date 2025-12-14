import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Button, Paper } from "@mui/material";

import MovieSelect from "../InputComponent/MovieSelect";
import CinemaSelect from "../InputComponent/CinemaSelect";
import SessionSelect from "../InputComponent/SessionSelect";
import DateSelect from "../InputComponent/DateSelect";
import SeatMap from "../InputComponent/SeatSelect";

export default function BookPage() {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [movieId, setMovieId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  const apiBase = "http://localhost:3000";

  /* ---------------- 取得電影與影城資料 ---------------- */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${apiBase}/api/movies`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Fetch movies error:", err);
        alert("電影資料讀取失敗：" + err.message);
      }
    };

    const fetchCinemas = async () => {
      try {
        const res = await fetch(`${apiBase}/api/cinemas`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCinemas(data);
      } catch (err) {
        console.error("Fetch cinemas error:", err);
        alert("影城資料讀取失敗：" + err.message);
      }
    };

    fetchMovies();
    fetchCinemas();
  }, []);

  /* ---------------- 依電影 + 影城取得場次 ---------------- */
  useEffect(() => {
    if (!movieId || !cinemaId) {
      setSessions([]);
      setSessionId("");
      setSelectedSession(null);
      setDate("");
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/showings?movieID=${movieId}&cinemaID=${cinemaId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSessions(data);
        setSessionId("");
        setSelectedSession(null);
        setDate("");
      } catch (err) {
        console.error("Fetch showings error:", err);
        alert("場次資料讀取失敗：" + err.message);
      }
    };

    fetchSessions();
  }, [movieId, cinemaId]);

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        我要訂票
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" gap={4}>
        {/* 左：查詢條件 */}
        <Box sx={{ minWidth: 280 }}>
          <MovieSelect movies={movies} value={movieId} onChange={setMovieId} />
          <CinemaSelect cinemas={cinemas} value={cinemaId} onChange={setCinemaId} />
          <SessionSelect
            movieID={movieId}
            cinemaID={cinemaId}
            value={sessionId}
            onChange={(id) => {
              setSessionId(id);
              const session = sessions.find((s) => s.showingID === id);
              setSelectedSession(session);
              if (session) setDate(session.date); // 選場次帶出日期
            }}
            setDate={setDate}
          />
          <DateSelect dates={date ? [date] : []} value={date} onChange={setDate} />
        </Box>

        {/* 右：查詢結果 */}
        <Paper sx={{ p: 3, minWidth: 320 }}>
          <Typography fontWeight="bold">查詢結果</Typography>

          {selectedSession ? (
            <>
              <Typography sx={{ mt: 2 }}>
                電影：{selectedSession.movieName}
              </Typography>
              <Typography>時間：{selectedSession.startTime}</Typography>
              <Typography color="error">金額：${selectedSession.price}</Typography>

              <Button sx={{ mt: 2 }} variant="contained">
                選擇座位
              </Button>
            </>
          ) : (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              請先選擇電影、影城與場次
            </Typography>
          )}
        </Paper>
      </Box>

      {/* 座位 */}
      {selectedSession && <SeatMap />}
    </Box>
  );
}
