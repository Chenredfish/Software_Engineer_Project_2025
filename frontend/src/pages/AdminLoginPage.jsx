import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!account || !password) {
      setError("請輸入帳號與密碼");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/login",
        {
          account,
          password
        }
      );

      alert("管理員登入成功");
      localStorage.setItem("adminToken", res.data.adminToken);

      // 之後你可以導到後台頁
      navigate("/admin/dashboard");
    } catch (e) {
      setError(
        e.response?.data?.error || "登入失敗，請確認帳號密碼"
      );
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Box
        sx={{
          width: 420,
          border: "2px solid #000",
          p: 4
        }}
      >
        <Typography
          sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}
        >
          管理員登入
        </Typography>

        <Typography sx={{ fontSize: 14, mb: 1 }}>
          管理員帳號
        </Typography>
        <input
          value={account}
          onChange={e => setAccount(e.target.value)}
          placeholder="請輸入管理員帳號"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px"
          }}
        />

        <Typography sx={{ fontSize: 14, mb: 1 }}>
          管理員密碼
        </Typography>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="請輸入管理員密碼"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px"
          }}
        />

        <Button fullWidth variant="outlined" onClick={handleLogin}>
          登入
        </Button>

        {error && (
          <Typography
            sx={{ color: "red", fontSize: 12, mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
