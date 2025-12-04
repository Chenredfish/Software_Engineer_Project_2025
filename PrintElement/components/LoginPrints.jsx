// src/components/LoginPrints.jsx — MUI Version (Style A)

import React from "react";
import {
  Alert,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box
} from "@mui/material";

/* ------------------------ InfoCard (共用線框樣式) ------------------------ */
function InfoCard({ title, children }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={title}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: "bold", textAlign: "center" }
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ------------------------ 登入成功 / 失敗 ------------------------ */
export function PrintLoginResult({ success }) {
  return (
    <Alert severity={success ? "success" : "error"} sx={{ my: 2 }}>
      {success ? "登入成功" : "帳號或密碼錯誤"}
    </Alert>
  );
}

/* ------------------------ 忘記密碼：顯示驗證碼 ------------------------ */
export function ReturnCode({ code }) {
  return (
    <InfoCard title="忘記密碼驗證碼">
      <Box
        sx={{
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "1.5rem",
          letterSpacing: "0.3rem"
        }}
      >
        {code || "———"}
      </Box>
    </InfoCard>
  );
}

/* ------------------------ 驗證碼成功 / 失敗 ------------------------ */
export function PrintCodeResult({ ok }) {
  return (
    <Alert severity={ok ? "success" : "error"} sx={{ my: 2 }}>
      {ok ? "驗證碼正確" : "驗證碼錯誤，查無電子郵件"}
    </Alert>
  );
}

/* ------------------------ 修改密碼成功 / 失敗 ------------------------ */
export function PrintResetPwdResult({ ok, message }) {
  return (
    <Alert severity={ok ? "success" : "error"} sx={{ my: 2 }}>
      {ok ? "修改成功" : message || "密碼不符合規定"}
    </Alert>
  );
}
