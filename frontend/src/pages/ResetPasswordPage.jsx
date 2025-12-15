import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 從 forgot 帶過來的資料
  const { account, verificationCode } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");

    if (!password || !confirm) {
      setError("＊請填寫所有欄位");
      return;
    }

    if (password !== confirm) {
      setError("＊兩次密碼不一致");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:3000/api/auth/password-reset",
        {
          account,
          verificationCode,
          newPassword: password,
          confirmPassword: confirm
        }
      );

      if (res.data.success) {
        alert("密碼修改成功，請重新登入");
        navigate("/login");
      }
    } catch {
      setError("＊密碼不符合規定或驗證碼失效");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Box sx={{ width: 420, border: "2px solid #000", p: 4 }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}>
          忘記密碼
        </Typography>

        <Typography sx={{ fontSize: 14, mb: 1 }}>新密碼</Typography>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="請輸入新密碼"
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <Typography sx={{ fontSize: 14, mb: 1 }}>確認密碼</Typography>
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
          <Typography sx={{ color: "red", fontSize: 12, mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
