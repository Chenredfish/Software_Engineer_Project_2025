import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

export default function RelatedBrowsePage() {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("sessionToken");

  const [hotMovies, setHotMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showings, setShowings] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowing, setSelectedShowing] = useState(null);

  const [member, setMember] = useState(null);
  const [checkedLogin, setCheckedLogin] = useState(false);

  const [noShowingMsg, setNoShowingMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  /* ---------- 熱門電影 ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => setHotMovies(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  /* ---------- 電影 & 影城 ---------- */
  useEffect(() => {
    axios.get("http://localhost:3000/api/movies").then(res => setMovies(res.data));
    axios.get("http://localhost:3000/api/cinemas").then(res => setCinemas(res.data));
  }, []);

  /* ---------- 會員登入狀態 ---------- */
  useEffect(() => {
    if (!sessionToken) {
      setCheckedLogin(true);
      return;
    }

    axios
      .get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: sessionToken }
      })
      .then(res => {
        if (res.data.success) setMember(res.data.member);
        setCheckedLogin(true);
      })
      .catch(() => setCheckedLogin(true));
  }, [sessionToken]);

  /* ---------- 登出 ---------- */
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { headers: { Authorization: sessionToken } }
      );
    } catch {}
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("memberID");
    navigate("/login");
  };

  return (
    <Box>
      {/* ================= 上方導覽列 ================= */}
      <Box sx={{ position: "relative", borderBottom: "2px solid #000", py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <NavItem text="影城介紹" onClick={() => navigate("/cinemas")} />
          <NavItem text="電影介紹" onClick={() => navigate("/movies")} />
          <NavItem text="餐飲介紹" onClick={() => navigate("/food")} />
          <NavItem text="訂票系統" onClick={() => navigate("/book")} />
          <NavItem text="快搜系統" onClick={() => navigate("/quick-search")} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: 1
          }}
        >
          {sessionToken ? (
            <>
              <NavItem text="會員資料" onClick={() => navigate("/member")} />
              <Typography>|</Typography>
              <NavItem text="登出會員" onClick={handleLogout} />
            </>
          ) : (
            <NavItem text="登入 / 註冊會員" onClick={() => navigate("/login")} />
          )}
        </Box>
      </Box>

      {/* ================= 主內容 ================= */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 6 }}>
        {/* -------- 左側熱門電影 -------- */}
        <Box sx={{ width: 420 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>熱門電影</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {hotMovies.map(movie => (
              <Box
                key={movie.movieID}
                sx={{ width: 120, cursor: "pointer" }}
                onClick={() => navigate(`/movies/${movie.movieID}`)}
              >
                <Box
                  component="img"
                  src={`http://localhost:3000/${movie.moviePhoto}`}
                  alt={movie.movieName}
                  sx={{ width: "100%", border: "1px solid #ccc" }}
                />
                <Typography sx={{ fontSize: 12, mt: 0.5 }}>
                  {movie.movieName}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* -------- 右側快搜（修正版） -------- */}
        <Box sx={{ border: "2px solid #000", p: 3, width: 260 }}>
          <Typography sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
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
                  `http://localhost:3000/api/cinemas/${cinemaID}/theaters`
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
                  `http://localhost:3000/api/showings/${selectedMovie}/${selectedTheater}`
                );
                const result = res.data.showings || [];
                setShowings(result);
                setSelectedShowing(null);
                setHasSearched(true);
                setNoShowingMsg(
                  result.length === 0 ? "此影廳目前沒有可售場次" : ""
                );
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

          {/* 場次 */}
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
            onClick={() =>
              navigate("/mealselect", {
                state: {
                  showing: selectedShowing,
                  memberID: member?.memberID,
                  memberName: member?.memberName,
                  memberBalance: member?.memberBalance,
                  ticketCounts: { T00001: 1 },
                  mealCounts: {},
                  totalPrice: 0
                }
              })
            }
          >
            查詢座位
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function NavItem({ text, onClick }) {
  return (
    <Typography sx={{ fontSize: 14, cursor: "pointer" }} onClick={onClick}>
      {text}
    </Typography>
  );
}
