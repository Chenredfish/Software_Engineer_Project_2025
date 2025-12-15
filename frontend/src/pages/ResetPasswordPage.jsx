import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("＊請填寫所有欄位");
      return;
    }

    if (password !== confirm) {
      setError("＊兩次密碼不一致");
      return;
    }

    setError("");

    try {
      const res = await axios.put(
        "http://localhost:3000/api/auth/password-reset",
        {
          resetToken: token,
          newPassword: password
        }
      );

      if (res.data.success) {
        alert("密碼修改成功，請重新登入");
        navigate("/login");
      }
    } catch (e) {
      setError("＊重設密碼失敗或連結已失效");
    }
  };

  return (
    <Box sx={{ width: 360, mx: "auto", mt: 8, textAlign: "center" }}>
      <Typography sx={{ fontWeight: "bold", mb: 2 }}>
        忘記密碼
      </Typography>

      <Typography sx={{ fontSize: 14 }}>新密碼</Typography>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="請輸入新密碼"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <Typography sx={{ fontSize: 14 }}>確認密碼</Typography>
      <input
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="請再次輸入新密碼"
        style={{ width: "100%", padding: 8 }}
      />

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={handleReset}
      >
        修改密碼
      </Button>

      {error && (
        <Typography sx={{ color: "red", fontSize: 12, mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
