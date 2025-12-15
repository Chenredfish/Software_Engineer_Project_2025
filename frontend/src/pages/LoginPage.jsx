import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";


// 你已有的 PrintElement（路徑依你專案結構）
import { PrintLoginResult } from "../PrintElement/components/LoginPrints";

// MUI（如果你專案已經有用 MUI，這段可直接用）
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Link
} from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();

  // tab：0=登入、1=註冊
  const [tab, setTab] = useState(0);

  // input
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  // 登入結果
  const [hasTried, setHasTried] = useState(false);
  const [loginOk, setLoginOk] = useState(false);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    if (newValue === 1) navigate("/register"); // 點「註冊會員」就跳頁
  };

  const handleLogin = async () => {
    setHasTried(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        account,
        password
      });

      if (res.data?.success) {
        setLoginOk(true);
        localStorage.setItem("sessionToken", res.data.sessionToken);
        localStorage.setItem("memberID", res.data.member.memberID);
        navigate("/browse");
      } else {
        setLoginOk(false);
      }
    } catch (e) {
      setLoginOk(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
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
        {[
          { label: "影城介紹", path: "/cinemas" },
          { label: "活動介紹", path: "/event" },
          { label: "電影介紹", path: "/movies" },
          { label: "餐飲介紹", path: "/food" },
          { label: "訂票系統", path: "/book" }, // ⭐ 重點
          { label: "快搜系統", path: "/search" },
          { label: "登入 / 註冊會員", path: "/login" }
        ].map((item) => (
          <Typography
            key={item.label}
            component={RouterLink}
            to={item.path}
            sx={{
              fontSize: 14,
              color: "#000",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>

      {/* 中間置中框框 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Box sx={{ width: 520, border: "2px solid #000" }}>
          {/* Tab 標籤（登入會員 / 註冊會員） */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: "2px solid #000",
              "& .MuiTab-root": { fontWeight: "bold" }
            }}
          >
            <Tab label="登入會員" />
            <Tab label="註冊會員" />
          </Tabs>

          <Box sx={{ p: 4 }}>
            <Typography sx={{ mb: 1 }}>帳號</Typography>
            <TextField
              fullWidth
              placeholder="請輸入帳號"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography sx={{ mb: 1 }}>密碼</Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  width: 120,
                  border: "2px solid #000",
                  color: "#000"
                }}
              >
                登入
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Link
                component="button"
                underline="none"
                sx={{ fontSize: 12, color: "#000" }}
                onClick={() => {
                  // 你之後要接忘記密碼流程（L7-L15）可從這裡開始
                  alert("忘記密碼流程尚未接上（可先做畫面/假流程）");
                }}
              >
                忘記密碼
              </Link>
            </Box>

            {/* 登入結果（你已做好的 PrintLoginResult） */}
            {hasTried && <PrintLoginResult success={loginOk} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
