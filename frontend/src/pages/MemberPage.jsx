import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
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

  // 未登入直接踢回登入頁
  useEffect(() => {
    if (!sessionToken) {
      navigate("/login");
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
      .catch(() => {
        navigate("/login");
      });
  }, [navigate, sessionToken]);

  const handleUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("兩次密碼輸入不一致");
      return;
    }

    const payload = {
      memberName: formData.memberName,
      memberBirth: formData.memberBirth,
      memberPhone: formData.memberPhone
    };

    if (formData.newPassword) {
      payload.memberPwd = formData.newPassword;
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/api/members/${member.memberID}`,
        payload,
        {
          headers: {
            Authorization: sessionToken
          }
        }
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
            label="新密碼"
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
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            儲值資訊
          </Typography>
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

      <Typography
        sx={{ textAlign: "center", fontSize: 12, color: "#666", mt: 3 }}
      >
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
