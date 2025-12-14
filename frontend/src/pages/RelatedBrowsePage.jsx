import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function RelatedBrowsePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* 上方導覽列 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          py: 2,
          borderBottom: "2px solid #000"
        }}
      >
        <NavItem text="影城介紹" onClick={() => navigate("/cinemas")} />
        <NavItem text="活動介紹" onClick={() => navigate("/activities")} />
        <NavItem text="電影介紹" onClick={() => navigate("/movies")} />
        <NavItem text="餐飲介紹" onClick={() => navigate("/meals")} />
        <NavItem text="訂票系統" onClick={() => navigate("/booking")} />
        <NavItem text="快搜系統" onClick={() => navigate("/quick-search")} />
        <NavItem text="會員資料" onClick={() => navigate("/member")} />
      </Box>

      {/* 主內容 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 6 }}>
        {/* 左側 */}
        <Box sx={{ width: 420 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>最新公告</Typography>
          <Typography sx={{ fontSize: 14, mb: 2 }}>
            （公告 API 尚未接入）
          </Typography>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>熱門電影</Typography>
          <Typography sx={{ fontSize: 14 }}>
            （電影資料 API 尚未接入）
          </Typography>
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
      sx={{ fontSize: 14, cursor: "pointer" }}
      onClick={onClick}
    >
      {text}
    </Typography>
  );
}
