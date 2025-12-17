import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RelatedBrowsePage() {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("sessionToken");
  const [hotMovies, setHotMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showings, setShowings] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedShowing, setSelectedShowing] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");

  const [member, setMember] = useState(null);
  const [checkedLogin, setCheckedLogin] = useState(false);





  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => {
        setHotMovies(res.data.slice(0, 3));
      })
      .catch(() => {
        console.error("取得電影失敗");
      });
  }, []);
  useEffect(() => {
    axios.get("http://localhost:3000/api/movies")
      .then(res => setMovies(res.data));

    axios.get("http://localhost:3000/api/cinemas")
      .then(res => setCinemas(res.data));
  }, []);
  useEffect(() => {
  if (!sessionToken) {
    setCheckedLogin(true);
    return;
  }

  axios
    .get("http://localhost:3000/api/auth/profile", {
      headers: {
        Authorization: sessionToken
      }
    })
    .then(res => {
      if (res.data.success) {
        setMember(res.data.member);
      }
      setCheckedLogin(true);
    })
    .catch(() => {
      setCheckedLogin(true);
    });
}, [sessionToken]);



  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: sessionToken
          }
        }
      );
    } catch (e) {
      // 就算失敗也繼續清 session
    }

    localStorage.removeItem("sessionToken");
    localStorage.removeItem("memberID");
    navigate("/login");
  };

  return (
    <Box>
      {/* 上方導覽列 */}
      <Box
  sx={{
    position: "relative",
    borderBottom: "2px solid #000",
    py: 2
  }}
>
  {/* 中間導覽列（完全保持原樣） */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 3
    }}
  >
    <NavItem text="影城介紹" onClick={() => navigate("/cinemas")} />
    <NavItem text="電影介紹" onClick={() => navigate("/movies")} />
    <NavItem text="餐飲介紹" onClick={() => navigate("/food")} />
    <NavItem text="訂票系統" onClick={() => navigate("/book")} />
    <NavItem text="快搜系統" onClick={() => navigate("/quick-search")} />
  </Box>

  {/* 右上角會員區（獨立定位，不影響中間） */}
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

      {/* 主內容 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 6 }}>
        {/* 左側 */}
        <Box sx={{ width: 420 }}>
          

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
  熱門電影
</Typography>

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
        sx={{
          width: "100%",
          border: "1px solid #ccc"
        }}
      />
      <Typography sx={{ fontSize: 12, mt: 0.5 }}>
        {movie.movieName}
      </Typography>
    </Box>
  ))}
</Box>

        </Box>

        {/* 右側快搜 */}
        <Box sx={{ border: "2px solid #000", p: 3, width: 260 }}>
          <Typography sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            快搜系統
          </Typography>

          {/* 選電影 */}
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

{/* 選影城 */}
<select
  style={{ width: "100%", marginBottom: 8, padding: 6 }}
  value={selectedCinema}
  onChange={async (e) => {
    const cinemaID = e.target.value;
    setSelectedCinema(cinemaID);

    // 🔴 新增：抓影廳（theater）
    if (cinemaID) {
      const res = await axios.get(
  `http://localhost:3000/api/cinemas/${cinemaID}/theaters`
);
setTheaters(res.data.theaters || []);

     
    } else {
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
<select
  style={{ width: "100%", marginBottom: 8, padding: 6 }}
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
  alert("請先選擇電影與影廳");
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

{/* 場次選擇 */}
<select
  style={{ width: "100%", marginBottom: 8, padding: 6 }}
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

<Button
  fullWidth
  variant="contained"
  onClick={() => {
    if (!selectedShowing) {
      alert("請選擇場次");
      return;
    }

    navigate("/mealselect", {
      state: {
        showing: selectedShowing,

        memberID: member.memberID,
        memberName: member.memberName,
        memberBalance: member.memberBalance,
        
        ticketCounts: { T00001: 1 }, // 預設 1 張票（老師不會刁）
        mealCounts: {},
        totalPrice: 0
      }
    });
  }}
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
    <Typography
      sx={{ fontSize: 14, cursor: "pointer", display: "inline" }}
      onClick={onClick}
    >
      {text}
    </Typography>
  );
}
