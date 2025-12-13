// src/components/InquiryPrints.jsx — MUI Version (Style A)

import React from "react";
import {
  Card, CardHeader, CardContent,
  Typography, Alert, Box
} from "@mui/material";

/* ------------------------ 共用 KeyValue（MUI版） ------------------------ */
function KeyValue({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" my={0.5}>
      <Typography fontWeight="bold">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

/* ------------------------ 共用 InfoCard ------------------------ */
function InfoCard({ title, children }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={title}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: "bold" },
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ------------------------ 訂票紀錄 ------------------------ */

export function ReturnInquiry({ records = [] }) {
  return (
    <InfoCard title="訂票紀錄">
      {records.length === 0 ? (
        <Typography color="text.secondary">沒有紀錄</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {records.map((r, i) => (
            <Card
              key={i}
              variant="outlined"
              sx={{ p: 2 }}
            >
              <KeyValue label="訂票日期" value={r.date} />
              <KeyValue label="訂票狀態" value={r.status} />
              <KeyValue label="影城" value={r.theater} />
              <KeyValue label="電影" value={r.movie} />
              <KeyValue label="場次" value={r.showing} />
              <KeyValue label="座位" value={(r.seats || []).join("、")} />
              <KeyValue label="訂票序號" value={r.code} />
            </Card>
          ))}
        </Box>
      )}
    </InfoCard>
  );
}

/* ------------------------ 退票失敗訊息 ------------------------ */

export function PrintRefundFalse({ message }) {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {message || "退票失敗（已取票或不符合開演兩小時規定）"}
    </Alert>
  );
}

/* ------------------------ 退票成功訊息 ------------------------ */

export function DisplayRefundSuccess({ code, amount, method }) {
  return (
    <Alert severity="success" sx={{ my: 2 }}>
      已成功退票（序號 {code || "———"}）。退款金額 ${amount || 0}，方式：{method || "原路退回"}。
    </Alert>
  );
}
