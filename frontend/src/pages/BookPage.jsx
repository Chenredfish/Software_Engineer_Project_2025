import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";

import MovieSelect from "../InputComponent/MovieSelect";
import CinemaSelect from "../InputComponent/CinemaSelect";
import TheaterSelect from "../InputComponent/theaterselect"; // 新增
import SessionSelect from "../InputComponent/SessionSelect";
import DateSelect from "../InputComponent/DateSelect";
import SeatMap from "../InputComponent/SeatSelect";

export default function BookPage() {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [movieId, setMovieId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [theaterId, setTheaterId] = useState("");
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

  /* ---------------- 依 cinemaID 取得 theater ---------------- */
  useEffect(() => {
    if (!cinemaId) {
      setTheaters([]);
      setTheaterId("");
      setSessions([]);
      setSessionId("");
      setSelectedSession(null);
      setDate("");
      return;
    }

    const fetchTheaters = async () => {
      try {
        const res = await fetch(`${apiBase}/api/theaters?cinemaID=${cinemaId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTheaters(data);
        setTheaterId("");
        setSessions([]);
        setSessionId("");
        setSelectedSession(null);
        setDate("");
      } catch (err) {
        console.error("Fetch theaters error:", err);
        alert("影廳資料讀取失敗：" + err.message);
      }
    };

    fetchTheaters();
  }, [cinemaId]);

  /* ---------------- 依 movieID + theaterID 取得場次 ---------------- */
  useEffect(() => {
    if (!movieId || !theaterId) {
      setSessions([]);
      setSessionId("");
      setSelectedSession(null);
      setDate("");
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/showings?movieID=${movieId}&theaterID=${theaterId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const mapped = data.map((s) => {
          const dt = new Date(s.showingTime);
          const dateStr = dt.toISOString().split("T")[0];
          const timeStr = dt.toTimeString().split(" ")[0].slice(0, 5);
          const movie = movies.find((m) => m.movieID === s.movieID);
          return {
            ...s,
            date: dateStr,
            startTime: timeStr,
            movieName: movie?.movieName || "未知電影",
            price: 300
          };
        });

        setSessions(mapped);
        setSessionId("");
        setSelectedSession(null);
        setDate("");
      } catch (err) {
        console.error("Fetch showings error:", err);
        alert("場次資料讀取失敗：" + err.message);
      }
    };

    fetchSessions();
  }, [movieId, theaterId, movies]);

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
          <TheaterSelect theaters={theaters} value={theaterId} onChange={setTheaterId} />
          <SessionSelect
            sessions={sessions}
            value={sessionId}
            onChange={(id) => {
              setSessionId(id);
              const session = sessions.find((s) => s.showingID === id);
              setSelectedSession(session);
              if (session) setDate(session.date);
            }}
          />
          <DateSelect dates={date ? [date] : []} value={date} onChange={setDate} />
        </Box>
      </Box>

      {/* 座位 */}
      {selectedSession && <SeatMap />}
    </Box>
  );
}
