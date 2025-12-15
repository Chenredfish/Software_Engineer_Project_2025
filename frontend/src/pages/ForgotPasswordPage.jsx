import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 發送驗證碼
  const handleSendMail = async () => {
    setError("");
    setSuccessMsg("");

    if (!account) {
      setError("＊請輸入電子信箱");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { account }
      );

      if (res.data.success) {
        setSuccessMsg("驗證碼已寄送至您的信箱");
      }
    } catch {
      setError("系統錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 驗證成功後直接跳 reset
  const handleConfirm = () => {
    setError("");
    setSuccessMsg("");

    if (!account) {
      setError("＊請輸入電子信箱");
      return;
    }

    if (!verifyCode) {
      setError("＊請輸入驗證碼");
      return;
    }

    // ⭐ 關鍵：跳轉到 reset 頁，把資料一起帶過去
    navigate("/reset-password", {
      state: {
        account,
        verificationCode: verifyCode
      }
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Box sx={{ width: 420, border: "2px solid #000", p: 4 }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}>
          忘記密碼
        </Typography>

        {/* Email */}
        <Typography sx={{ fontSize: 14, mb: 1 }}>
          請輸入電子信箱
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <input
            value={account}
            onChange={e => setAccount(e.target.value)}
            placeholder="請輸入電子信箱"
            style={{ flex: 1, padding: "8px" }}
          />

          <Button
            variant="outlined"
            onClick={handleSendMail}
            disabled={loading}
          >
            發送驗證碼
          </Button>
        </Box>

        {/* 驗證碼 */}
        <Typography sx={{ fontSize: 14, mb: 1 }}>
          請輸入驗證碼
        </Typography>

        <input
          value={verifyCode}
          onChange={e => setVerifyCode(e.target.value)}
          placeholder="請輸入驗證碼"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px"
          }}
        />

        <Button fullWidth variant="outlined" onClick={handleConfirm}>
          確認
        </Button>

        {error && (
          <Typography sx={{ color: "red", fontSize: 12, mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {successMsg && (
          <Typography sx={{ fontSize: 13, mt: 2, textAlign: "center" }}>
            {successMsg}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
