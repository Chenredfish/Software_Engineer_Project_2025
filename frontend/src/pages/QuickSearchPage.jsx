import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuickSearchPage() {
  const navigate = useNavigate();
  const apiBase = "http://localhost:3000";

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showings, setShowings] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowing, setSelectedShowing] = useState(null);

  // 會員狀態
  const [member, setMember] = useState(null);
  const [dialogMsg, setDialogMsg] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // 場次狀態
  const [noShowingMsg, setNoShowingMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  /* ---------- 檢查會員登入 ---------- */
  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      setDialogMsg("請先登入會員才能訂票");
      setOpenDialog(true);
      return;
    }

    fetch(`${apiBase}/api/auth/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionToken
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMember(data.member);
        } else {
          setDialogMsg("登入狀態失效，請重新登入");
          setOpenDialog(true);
        }
      })
      .catch(() => {
        setDialogMsg("登入狀態失效，請重新登入");
        setOpenDialog(true);
      });
  }, []);

  /* ---------- 取得電影 & 影城 ---------- */
  useEffect(() => {
    axios.get(`${apiBase}/api/movies`).then(res => setMovies(res.data));
    axios.get(`${apiBase}/api/cinemas`).then(res => setCinemas(res.data));
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
        onChange={e => {
          setSelectedMovie(e.target.value);
          setShowings([]);
          setSelectedShowing(null);
          setHasSearched(false);
        }}
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
        onChange={async e => {
          const cinemaID = e.target.value;
          setSelectedCinema(cinemaID);
          setSelectedTheater("");
          setTheaters([]);
          setShowings([]);
          setSelectedShowing(null);
          setHasSearched(false);

          if (!cinemaID) return;

          try {
            const res = await axios.get(
              `${apiBase}/api/cinemas/${cinemaID}/theaters`
            );
            setTheaters(res.data.theaters || []);
          } catch {
            setTheaters([]);
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
        onChange={e => {
          setSelectedTheater(e.target.value);
          setShowings([]);
          setSelectedShowing(null);
          setHasSearched(false);
        }}
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
        disabled={!selectedMovie || !selectedTheater}
        onClick={async () => {
          try {
            const res = await axios.get(
              `${apiBase}/api/showings/${selectedMovie}/${selectedTheater}`
            );

            const result = res.data.showings || [];
            setShowings(result);
            setSelectedShowing(null);
            setHasSearched(true);

            if (result.length === 0) {
              setNoShowingMsg("此影廳目前沒有可售場次");
            } else {
              setNoShowingMsg("");
            }
          } catch {
            setShowings([]);
            setSelectedShowing(null);
            setHasSearched(true);
            setNoShowingMsg("此影廳目前沒有可售場次");
          }
        }}
      >
        查詢場次
      </Button>

      {/* 場次選擇 */}
      <select
        style={{ width: "100%", marginBottom: 8, padding: 6 }}
        disabled={showings.length === 0}
        onChange={e => {
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

      {/* 無場次提示 */}
      {hasSearched && noShowingMsg && (
        <Typography sx={{ color: "red", fontSize: 13, mb: 1 }}>
          {noShowingMsg}
        </Typography>
      )}

      {/* 查詢座位 */}
      <Button
        fullWidth
        variant="contained"
        disabled={!selectedShowing}
        onClick={() => {
          if (!member) {
            setDialogMsg("請先登入會員才能訂票");
            setOpenDialog(true);
            return;
          }

          navigate("/mealselect", {
            state: {
              showing: selectedShowing,
              memberID: member.memberID,
              memberBalance: member.memberBalance,
              memberName: member.memberName,
              ticketCounts: { T00001: 1 },
              mealCounts: {},
              totalPrice: 0
            }
          });
        }}
      >
        查詢座位
      </Button>

      {/* 登入提示 Dialog */}
      <Dialog open={openDialog} onClose={() => navigate("/login")}>
        <DialogTitle>錯誤</DialogTitle>
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/login")} autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
