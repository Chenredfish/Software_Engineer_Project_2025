// src/components/BookPrints.jsx (MUI Version)

import React from "react";
import {
  Card, CardContent, CardHeader,
  Typography, List, ListItem,
  Box, Grid, Chip, Alert,
} from "@mui/material";

/* ------------------------ 工具元件 (MUI 版) ------------------------ */

function InfoCard({ title, subtitle, children }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={title}
        subheader={subtitle}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: "bold" },
          "& .MuiCardHeader-subheader": { color: "gray" },
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function KeyValue({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" my={1}>
      <Typography fontWeight="bold">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

/* ------------------------ 各顯示元件 ------------------------ */

export function DisplayCinema({ items = [] }) {
  return (
    <InfoCard title="選擇查詢影城">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((c, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              <Typography>{c}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplayMovie({ items = [] }) {
  return (
    <InfoCard title="選擇查詢電影">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((m, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              <Typography>{m}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplayDate({ items = [] }) {
  return (
    <InfoCard title="選擇查詢日期">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {items.map((d, i) => (
            <Chip key={i} label={d} variant="outlined" />
          ))}
        </Box>
      )}
    </InfoCard>
  );
}

export function DisplayShowing({ items = [] }) {
  return (
    <InfoCard title="選擇查詢場次">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <Grid container spacing={1}>
          {items.map((s, i) => (
            <Grid item xs={6} md={4} key={i}>
              <Box
                border={1}
                borderRadius={1}
                p={1}
                textAlign="center"
                sx={{ borderColor: "#888" }}
              >
                {s}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </InfoCard>
  );
}

export function DisplayType({ items = [] }) {
  return (
    <InfoCard title="可選擇票種">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((t, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              <Typography>{t}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function ShowNumError({ message }) {
  return (
    <Alert severity="error" sx={{ my: 1 }}>
      {message || "票種張數不符（必須介於 1~10）"}
    </Alert>
  );
}

export function DisplayMenu({ items = [] }) {
  return (
    <InfoCard title="可選擇餐點">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((m, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              <Typography>{m}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplaySeat({ seats = [] }) {
  const seatColor = (state) =>
    state === "sold"
      ? "#ffcdd2"
      : state === "picked"
      ? "#bbdefb"
      : "#ffffff";

  return (
    <InfoCard title="座位狀態" subtitle="紅=已售、白=空位、藍=選中">
      {seats.length === 0 ? (
        <Typography color="text.secondary">尚無座位資料</Typography>
      ) : (
        <Grid container spacing={1}>
          {seats.map((s, i) => (
            <Grid item xs={1.5} key={i}>
              <Box
                width={35}
                height={35}
                border={1}
                borderRadius={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ backgroundColor: seatColor(s.state) }}
              >
                <Typography variant="caption">{s.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </InfoCard>
  );
}

export function DisplayInfo({
  cinema,
  movie,
  date,
  showing,
  typeSummary,
  menuSummary,
  seatsSummary,
  total,
}) {
  return (
    <InfoCard title="購票資訊">
      <KeyValue label="影城" value={cinema} />
      <KeyValue label="電影" value={movie} />
      <KeyValue label="場次" value={`${date || ""} ${showing || ""}`} />

      {typeSummary && <KeyValue label="票數" value={typeSummary} />}
      {seatsSummary && <KeyValue label="訂票座位" value={seatsSummary} />}
      {menuSummary && <KeyValue label="餐飲" value={menuSummary} />}
      {total != null && <KeyValue label="總計" value={`$${total}`} />}
    </InfoCard>
  );
}

export function DisplayPayWay({ ways = ["信用卡", "儲值卡"] }) {
  return (
    <InfoCard title="付款方式">
      <List>
        {ways.map((w, i) => (
          <ListItem key={i} sx={{ pl: 0 }}>
            <Typography>{w}</Typography>
          </ListItem>
        ))}
      </List>
    </InfoCard>
  );
}

export function DisplayPayError({ message }) {
  return (
    <Alert severity="error" sx={{ my: 1 }}>
      {message || "付款失敗，重新填寫卡片資訊"}
    </Alert>
  );
}

export function DisplayPaySuccess({ orderId }) {
  return (
    <Alert severity="success" sx={{ my: 1 }}>
      付款成功！訂票序號：{orderId || "———"}
    </Alert>
  );
}

export function DisplayTicket({ order }) {
  return (
    <InfoCard title="你已完成訂票">
      {order ? (
        <>
          <KeyValue label="影城" value={order.theater} />
          <KeyValue label="電影" value={order.movie} />
          <KeyValue label="場次" value={order.datetime} />
          <KeyValue label="票數" value={(order.type || []).join("、")} />
          <KeyValue label="訂票座位" value={(order.seats || []).join("、")} />
          <KeyValue label="餐飲" value={(order.menu || []).join("、")} />
          <KeyValue label="總計" value={`$${order.total}`} />

          <Alert severity="info" sx={{ mt: 2 }}>
            訂票序號：<span style={{ fontFamily: "monospace" }}>{order.ticketCode}</span>
          </Alert>
        </>
      ) : (
        <Typography color="text.secondary">尚無訂單資料</Typography>
      )}
    </InfoCard>
  );
}
