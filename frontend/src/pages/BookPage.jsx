import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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

  const [member, setMember] = useState(null); // 存會員資訊
  const [dialogMsg, setDialogMsg] = useState(""); // 對話框訊息
  const [openDialog, setOpenDialog] = useState(false); // 控制對話框開關

  const apiBase = "http://localhost:3000";

  /* ----------- 檢查會員登入 ----------- */
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
        "Authorization": sessionToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMember(data.member);
        } else {
          setDialogMsg("會員身份驗證失敗，請重新登入");
          setOpenDialog(true);
        }
      })
      .catch(() => {
        setDialogMsg("會員身份驗證失敗，請重新登入");
        setOpenDialog(true);
      });
  }, []);

  /* ----------- 取得電影 & 影城 ----------- */
  useEffect(() => {
    fetch(`${apiBase}/api/movies`)
      .then(res => res.json())
      .then(setMovies)
      .catch(() => alert("電影資料讀取失敗"));

    fetch(`${apiBase}/api/cinemas`)
      .then(res => res.json())
      .then(setCinemas)
      .catch(() => alert("影城資料讀取失敗"));
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

    fetch(`${apiBase}/api/showings/${movieId}/${theaterId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.showings);
        } else {
          setSessions([]);
        }
        setSessionId("");
        setSelectedSession(null);
      })
      .catch(() => alert("場次資料讀取失敗"));
  }, [movieId, theaterId]);

  /* ----------- 前往 SeatPage ----------- */
  const handleBooking = (selectedSession) => {
    if (!member) {
      setDialogMsg("請先登入會員才能訂票");
      setOpenDialog(true);
      return;
    }

    if (!selectedSession) return;

    navigate("/mealselect", {
      state: {
        showing: selectedSession,

        // 🔑 往下傳的會員資料
        memberID: member.memberID,
        memberBalance: member.memberBalance,
        memberName: member.memberName,
      },
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
            setSelectedSession(sessions.find((s) => s.showingID === id));
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!selectedSession}
          onClick={() => handleBooking(selectedSession)}
        >
          前往選擇餐點
        </Button>
      </Box>

      {/* ----------- MUI Dialog for Error ----------- */}
      <Dialog open={openDialog} onClose={() => navigate("/login")}>
        <DialogTitle>錯誤</DialogTitle>
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => navigate("/login")}
            color="primary"
            autoFocus
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
