import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RelatedBrowsePage() {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("sessionToken");
  const [hotMovies, setHotMovies] = useState([]);

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
    <NavItem text="訂票系統" onClick={() => navigate("/booking")} />
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

          {[
            "選擇電影類型",
            "選擇電影名稱",
            "選擇電影日期",
            "選擇電影時間"
          ].map((t) => (
            <Button
              key={t}
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              onClick={() => alert("快搜功能尚未接入")}
            >
              {t}
            </Button>
          ))}

          <Button
            fullWidth
            variant="contained"
            onClick={() => alert("查詢功能尚未接入")}
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
