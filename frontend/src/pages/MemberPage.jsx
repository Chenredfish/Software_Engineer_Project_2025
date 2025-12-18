import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MemberPage() {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("sessionToken");

  const [member, setMember] = useState(null);
  const [formData, setFormData] = useState({
    memberName: "",
    memberBirth: "",
    memberPhone: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // 🔒 密碼只能是英數字（不能有特殊符號）
  const passwordRegex = /^[A-Za-z0-9]+$/;

  // 未登入直接踢回登入頁
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
          setFormData({
            memberName: res.data.member.memberName,
            memberBirth: res.data.member.memberBirth,
            memberPhone: res.data.member.memberPhone,
            newPassword: "",
            confirmPassword: ""
          });
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, sessionToken]);

  // 取得會員訂票紀錄
  const fetchBookings = async () => {
    if (!member) return;
    setLoadingBookings(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/member/${member.memberID}`,
        { headers: { Authorization: sessionToken } }
      );
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch {
      alert("取得訂票紀錄失敗");
    }
    setLoadingBookings(false);
  };

  // 取消訂票
  const handleCancelBooking = async (orderID) => {
    if (!window.confirm("確定要取消這張電影票嗎？")) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/bookings/${orderID}`,
        { headers: { Authorization: sessionToken } }
      );
      if (res.data.success) {
        alert("取消成功");
        setBookings(bookings.filter(b => b.orderID !== orderID));
      }
    } catch {
      alert("取消失敗");
    }
  };

  const handleUpdate = async () => {
    // 🔐 密碼一致檢查
    if (formData.newPassword !== formData.confirmPassword) {
      alert("兩次密碼輸入不一致");
      return;
    }

    // 🔐 特殊符號檢查（只有在有輸入新密碼時才檢查）
    if (
      formData.newPassword &&
      !passwordRegex.test(formData.newPassword)
    ) {
      alert("密碼不可包含特殊符號，只能使用英文字母與數字");
      return;
    }

    const payload = {
      memberName: formData.memberName,
      memberBirth: formData.memberBirth,
      memberPhone: formData.memberPhone
    };

    if (formData.newPassword) payload.memberPwd = formData.newPassword;

    try {
      const res = await axios.put(
        `http://localhost:3000/api/members/${member.memberID}`,
        payload,
        { headers: { Authorization: sessionToken } }
      );

      if (res.data.success) {
        alert("會員資料修改成功");
        setMember({ ...member, ...payload });
        setFormData({ ...formData, newPassword: "", confirmPassword: "" });
      }
    } catch {
      alert("修改失敗");
    }
  };

  if (!member) return null;

  return (
    <Box sx={{ width: "80%", margin: "40px auto" }}>
      <Typography sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
        修改會員資料
      </Typography>

      <Box sx={{ display: "flex", gap: 6 }}>
        {/* 左側資料 */}
        <Box sx={{ flex: 1 }}>
          <EditableField
            label="您的姓名"
            value={formData.memberName}
            onChange={v => setFormData({ ...formData, memberName: v })}
          />
          <EditableField
            label="西元出生日期"
            value={formData.memberBirth}
            onChange={v => setFormData({ ...formData, memberBirth: v })}
          />
          <EditableField
            label="手機號碼"
            value={formData.memberPhone}
            onChange={v => setFormData({ ...formData, memberPhone: v })}
          />
          <Field label="身分證字號" value={member.memberID} />
        </Box>

        {/* 中間資料 */}
        <Box sx={{ flex: 1 }}>
          <Field label="電子信箱" value={member.memberAccount} />
          <Field label="密碼" value="********" />
          <EditableField
            label="新密碼（僅限英數字）"
            type="password"
            value={formData.newPassword}
            onChange={v => setFormData({ ...formData, newPassword: v })}
          />
          <EditableField
            label="確認新密碼"
            type="password"
            value={formData.confirmPassword}
            onChange={v => setFormData({ ...formData, confirmPassword: v })}
          />
        </Box>

        {/* 右側餘額 */}
        <Box
          sx={{
            width: 200,
            border: "1px solid #999",
            padding: 2,
            height: "fit-content"
          }}
        >
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>儲值資訊</Typography>
          <Typography sx={{ fontSize: 14 }}>
            目前餘額：{member.memberBalance}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/topup")}
          >
            我要儲值
          </Button>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="outlined" onClick={handleUpdate}>
          修改
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* ===== 訂票管理區塊 ===== */}
      <Box>
        <Typography sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
          我的電影票
        </Typography>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Button variant="contained" onClick={fetchBookings} disabled={loadingBookings}>
            {loadingBookings ? "載入中..." : "刷新我的電影票"}
          </Button>
        </Box>

        {bookings.length === 0 && !loadingBookings && (
          <Typography sx={{ textAlign: "center", color: "#666" }}>
            尚無訂票紀錄
          </Typography>
        )}

        {bookings.map((b) => (
          <Box
            key={b.orderID}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                {b.movieName || '未知電影'} - {b.cinemaName || '未知影城'}
              </Typography>
              <Typography>訂單編號: {b.orderID}</Typography>
              <Typography>放映時間: {b.showingTime ? new Date(b.showingTime).toLocaleString('zh-TW') : '未知時間'}</Typography>
              <Typography>廳別: {b.theaterName || b.showingID}</Typography>
              <Typography>座位: {b.seatNumber}</Typography>
              <Typography>票種: {b.ticketClassName || b.ticketTypeID} {b.ticketClassPrice ? `($${b.ticketClassPrice})` : ''}</Typography>
              {b.mealName && <Typography>餐點: {b.mealName} {b.mealsPrice ? `($${b.mealsPrice})` : ''}</Typography>}
              <Typography>付款方式: {b.paymentMethod === 'balance' ? '儲值卡' : b.paymentMethod === 'creditcard' ? '信用卡' : b.paymentMethod || '未知'}</Typography>
              <Typography>訂單狀態: {b.orderStatusName || '未知狀態'}</Typography>
              <Typography sx={{ fontSize: '0.85em', color: '#666' }}>
                訂票時間: {b.bookingTime ? new Date(b.bookingTime).toLocaleString('zh-TW') : '未知時間'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCancelBooking(b.orderID)}
            >
              退票
            </Button>
          </Box>
        ))}
      </Box>

      <Typography sx={{ textAlign: "center", fontSize: 12, color: "#666", mt: 3 }}>
        會員資料更改成功介面示意圖
      </Typography>
    </Box>
  );
}

/* ====== 共用元件 ====== */
function Field({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 14, mb: 0.5 }}>{label}</Typography>
      <input
        value={value}
        readOnly
        style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
      />
    </Box>
  );
}

function EditableField({ label, value, onChange, type = "text" }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 14, mb: 0.5 }}>{label}</Typography>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
      />
    </Box>
  );
}
