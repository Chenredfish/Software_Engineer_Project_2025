// src/components/SignPrints.jsx — MUI Version (Style A)

import React from "react";
import {
  Card, CardHeader, CardContent,
  Typography, Box
} from "@mui/material";

/* ------------------------ 共用線框 InfoCard ------------------------ */
function InfoCard({ title, children }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={title}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: "bold" }
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ------------------------ 共用 KeyValue ------------------------ */
function KeyValue({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" my={1}>
      <Typography fontWeight="bold">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

/* ------------------------ 錯誤訊息（圖片樣式：紅色小字） ------------------------ */
export function ShowEmailError() {
  return <Typography color="error">*Email 不符合格式</Typography>;
}

export function ShowEmailRepeatError() {
  return <Typography color="error">*Email 已被使用</Typography>;
}

export function ShowPwdError() {
  return <Typography color="error">*密碼格式不符合</Typography>;
}

export function ShowPwdRepeatError() {
  return <Typography color="error">*兩次密碼不同</Typography>;
}

export function ShowIdError() {
  return <Typography color="error">*此身分證字號已被使用</Typography>;
}

export function ShowNumberError() {
  return <Typography color="error">*手機格式不符合</Typography>;
}

/* ------------------------ 註冊資訊（成功畫面） ------------------------ */

export function ShowSign({ profile }) {
  return (
    <InfoCard title="註冊資訊">
      {profile ? (
        <>
          <KeyValue label="您的姓名" value={profile.name} />
          <KeyValue label="西元出生日期" value={profile.birth} />
          <KeyValue label="手機號碼" value={profile.number} />
          <KeyValue label="身分證字號" value={profile.id} />
          <KeyValue label="電子信箱" value={profile.email} />

          {/* 註冊成功時顯示的大灰框（依示意圖畫出） */}
          <Box
            sx={{
              mt: 3,
              width: 260,
              height: 120,
              mx: "auto",
              borderRadius: "30px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column"
            }}
          >
            <Typography fontWeight="bold">已完成註冊</Typography>
            <Typography sx={{ mt: 1 }}>請重新登入</Typography>
          </Box>
        </>
      ) : (
        <Typography color="text.secondary">尚無註冊資訊</Typography>
      )}
    </InfoCard>
  );
}
