import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuickSearchPage() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showings, setShowings] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowing, setSelectedShowing] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/api/movies").then(res => setMovies(res.data));
    axios.get("http://localhost:3000/api/cinemas").then(res => setCinemas(res.data));
  }, []);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        快搜系統
      </Typography>

      {/* 電影 */}
      <select
        style={{ width: "100%", marginBottom: 8, padding: 6 }}
        value={selectedMovie}
        onChange={(e) => setSelectedMovie(e.target.value)}
      >
        <option value="">選擇電影</option>
        {movies.map(m => (
          <option key={m.movieID} value={m.movieID}>
            {m.movieName}
          </option>
        ))}
      </select>

      {/* 影城 */}
      <select
        style={{ width: "100%", marginBottom: 8, padding: 6 }}
        value={selectedCinema}
        onChange={async (e) => {
          const cinemaID = e.target.value;
          setSelectedCinema(cinemaID);
          setSelectedTheater("");
          setShowings([]);

          if (cinemaID) {
            const res = await axios.get(
              `http://localhost:3000/api/cinemas/${cinemaID}/theaters`
            );
            setTheaters(res.data.theaters || []);
          }
        }}
      >
        <option value="">選擇影城</option>
        {cinemas.map(c => (
          <option key={c.cinemaID} value={c.cinemaID}>
            {c.cinemaName}
          </option>
        ))}
      </select>

      {/* 影廳 */}
      <select
        style={{ width: "100%", marginBottom: 8, padding: 6 }}
        value={selectedTheater}
        onChange={(e) => setSelectedTheater(e.target.value)}
      >
        <option value="">選擇影廳</option>
        {theaters.map(t => (
          <option key={t.theaterID} value={t.theaterID}>
            {t.theaterName}
          </option>
        ))}
      </select>

      {/* 查詢場次 */}
      <Button
        fullWidth
        variant="outlined"
        sx={{ mb: 1 }}
        onClick={async () => {
          if (!selectedMovie || !selectedTheater) {
            alert("請選擇電影與影廳");
            return;
          }

          const res = await axios.get(
            `http://localhost:3000/api/showings/${selectedMovie}/${selectedTheater}`
          );
          setShowings(res.data.showings || []);
        }}
      >
        查詢場次
      </Button>

      {/* 場次 */}
      <select
        style={{ width: "100%", marginBottom: 12, padding: 6 }}
        onChange={(e) => {
          const s = showings.find(sh => sh.showingID === e.target.value);
          setSelectedShowing(s);
        }}
      >
        <option value="">選擇時間</option>
        {showings.map(s => (
          <option key={s.showingID} value={s.showingID}>
            {s.showingTime}
          </option>
        ))}
      </select>

      {/* 查詢座位 */}
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          if (!selectedShowing) {
            alert("請選擇場次");
            return;
          }

          navigate("/seat", {
            state: {
              showing: selectedShowing,
              ticketCounts: { T00001: 1 },
              mealCounts: {},
              totalPrice: 0
            }
          });
        }}
      >
        查詢座位
      </Button>
    </Box>
  );
}
