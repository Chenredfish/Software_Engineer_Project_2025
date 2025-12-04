// src/components/MemberChangePrints.jsx — MUI Version (Style A)

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box
} from "@mui/material";

/* ------------------------ 共用 InfoCard ------------------------ */
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
    <Box display="flex" justifyContent="space-between" my={0.5}>
      <Typography fontWeight="bold">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

/* ------------------------ 會員資料顯示（圖片左半） ------------------------ */

export function ShowMemberInfo({ profile }) {
  const p = profile || {};
  return (
    <InfoCard title="會員資料">
      {profile ? (
        <Box>
          <KeyValue label="您的姓名" value={p.name} />
          <KeyValue label="西元出生日期" value={p.birth} />
          <KeyValue label="手機號碼" value={p.phone} />
          <KeyValue label="身份證字號" value={p.id} />
          <KeyValue label="電子信箱" value={p.email} />
          <KeyValue
            label="儲值餘額"
            value={p.balance != null ? `$${p.balance}` : "—"}
          />
        </Box>
      ) : (
        <Typography color="text.secondary">尚無資料</Typography>
      )}
    </InfoCard>
  );
}

/* ------------------------ 更改會員資料失敗（符合圖片：紅字小字） ------------------------ */

export function MemberChangeError({ message }) {
  return (
    <Typography color="error" sx={{ mt: 1 }}>
      {message || "更改資料失敗"}
    </Typography>
  );
}

/* ------------------------ 更改成功（右側圓角框） ------------------------ */

export function DisplaySaveSuccess({ message }) {
  return (
    <Box
      sx={{
        mt: 2,
        width: 200,
        height: 80,
        backgroundColor: "#efefef",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <Typography fontWeight="bold">
        {message || "已修改完畢"}
      </Typography>
    </Box>
  );
}

/* ------------------------ 儲值失敗（紅字提示，非 Alert） ------------------------ */

export function DisplayTopUpError({ message }) {
  return (
    <Typography color="error" sx={{ mt: 2 }}>
      {message || "儲值失敗（超過金額上限或資訊錯誤）"}
    </Typography>
  );
}

/* ------------------------ 儲值成功（右側圓角框：符合圖片） ------------------------ */

export function DisplayTopUpSuccess({ amount, balance }) {
  return (
    <Box
      sx={{
        mt: 2,
        width: 220,
        height: 90,
        backgroundColor: "#efefef",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column"
      }}
    >
      <Typography fontWeight="bold">成功儲值 {amount || 0}</Typography>
      <Typography sx={{ mt: 1 }}>
        新餘額：{balance != null ? balance : "—"}
      </Typography>
    </Box>
  );
}
