import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TopUpPage() {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("sessionToken");

  const [member, setMember] = useState(null);
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 取得會員資料
  useEffect(() => {
    if (!sessionToken) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: sessionToken }
      })
      .then(res => {
        if (res.data.success) {
          setMember(res.data.member);
        }
      });
  }, [navigate, sessionToken]);

  const handlePay = async () => {
    setError("");
    setSuccess("");

    const topupAmount = Number(amount);

    if (!topupAmount || topupAmount <= 0) {
      setError("＊請輸入正確儲值金額");
      return;
    }

    if (!cardNumber || !cvv || !month || !year) {
      setError("＊請填寫完整信用卡資訊");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/members/${member.memberID}/topup`,
        { amount: topupAmount },
        {
          headers: { Authorization: sessionToken }
        }
      );

      if (res.data.success) {
        setSuccess(`成功儲值 ${topupAmount}`);
      }
    } catch (e) {
      setError(e.response?.data?.error || "＊付款失敗");
    }
  };

  if (!member) return null;

  return (
    <Box sx={{ width: "80%", margin: "40px auto" }}>
      <Box sx={{ display: "flex", gap: 6 }}>
        {/* 左側：儲值資訊 */}
        <Box sx={{ width: 360, border: "1px solid #999", p: 3 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            儲值資訊
          </Typography>
          <Typography>會員姓名：{member.memberName}</Typography>
          <Typography>會員信箱：{member.memberAccount}</Typography>
          <Typography sx={{ mb: 1 }}>
            目前餘額：{member.memberBalance}
          </Typography>

          <Typography sx={{ mt: 2 }}>儲值金額</Typography>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />

          {error && (
            <Typography sx={{ color: "red", fontSize: 12, mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* 右側：信用卡 */}
        <Box sx={{ width: 360 }}>
          <Typography>信用卡卡號</Typography>
          <input
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            style={{ width: "100%", padding: 6, marginBottom: 10 }}
          />

          <Typography>安全碼</Typography>
          <input
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            style={{ width: 120, padding: 6, marginBottom: 10 }}
          />

          <Typography>卡片到期日</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <input
              placeholder="月"
              value={month}
              onChange={e => setMonth(e.target.value)}
              style={{ width: 60, padding: 6 }}
            />
            <input
              placeholder="年"
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{ width: 80, padding: 6 }}
            />
          </Box>

          <Button variant="outlined" onClick={handlePay}>
            確認付款
          </Button>

          {success && (
            <Typography sx={{ color: "green", mt: 2 }}>
              {success}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
