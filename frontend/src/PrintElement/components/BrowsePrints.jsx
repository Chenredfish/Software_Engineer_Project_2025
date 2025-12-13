// src/components/BrowsePrints.jsx — MUI Version (Style A)
// 完整線框白底風格，符合你的示意圖。

import React from "react";
import {
  Card, CardHeader, CardContent,
  Typography, List, ListItem,
  Box, Chip, Grid
} from "@mui/material";

/* ------------------------ 共用元件 ------------------------ */

function InfoCard({ title, subtitle, children }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={title}
        subheader={subtitle}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: "bold" },
          "& .MuiCardHeader-subheader": { color: "gray" }
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ------------------------ 各元件改寫 ------------------------ */

export function DisplayCinema({ items = [] }) {
  return (
    <InfoCard title="影城資訊">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((c, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              {c}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplayChoose({ options = ["電影", "影城", "餐飲", "活動", "快搜"] }) {
  return (
    <InfoCard title="可查詢項目">
      <Box display="flex" flexWrap="wrap" gap={1}>
        {options.map((o, i) => (
          <Chip key={i} label={o} variant="outlined" />
        ))}
      </Box>
    </InfoCard>
  );
}

export function DisplayMovie({ items = [] }) {
  return (
    <InfoCard title="電影列表">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((m, i) => (
            <ListItem key={i} sx={{ pl: 0 }}>
              {m}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function MovieDetail({ detail }) {
  const d = detail || {};
  return (
    <InfoCard title={d.title || "電影詳情"}>
      <Box sx={{ lineHeight: 1.8 }}>
        {d.director && <Typography>導演：{d.director}</Typography>}
        {d.actors && (
          <Typography>
            演員：{Array.isArray(d.actors) ? d.actors.join("、") : d.actors}
          </Typography>
        )}
        {d.runtime && <Typography>片長：{d.runtime}</Typography>}
        {d.intro && (
          <Typography sx={{ mt: 1 }}>{d.intro}</Typography>
        )}
      </Box>
    </InfoCard>
  );
}

export function DisplayCinemaInfo({ detail }) {
  const d = detail || {};
  return (
    <InfoCard title={d.name || "影城資訊"}>
      {d.address && <Typography>地址：{d.address}</Typography>}
      {d.phone && <Typography>電話：{d.phone}</Typography>}
      {d.rooms && <Typography>影廳數：{d.rooms}</Typography>}
    </InfoCard>
  );
}

export function CinemaDetail({ detail }) {
  return <DisplayCinemaInfo detail={detail} />;
}

export function DisplayMenu({ items = [] }) {
  return (
    <InfoCard title="餐飲列表">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((m, i) => (
            <ListItem sx={{ pl: 0 }} key={i}>
              {m}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function MenuDetail({ detail }) {
  const d = detail || {};
  return (
    <InfoCard title={d.name || "餐飲詳情"}>
      {d.price != null && <Typography>價格：${d.price}</Typography>}
      {d.description && (
        <Typography sx={{ mt: 1 }}>{d.description}</Typography>
      )}
    </InfoCard>
  );
}

export function DisplayActivities({ items = [] }) {
  return (
    <InfoCard title="活動列表">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((a, i) => (
            <ListItem sx={{ pl: 0 }} key={i}>
              {a}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function ActivitiesDetail({ detail }) {
  const d = detail || {};
  return (
    <InfoCard title={d.name || "活動詳情"}>
      {d.date && <Typography>日期：{d.date}</Typography>}
      {d.content && (
        <Typography sx={{ mt: 1 }}>{d.content}</Typography>
      )}
    </InfoCard>
  );
}

export function DisplayMovieOrCinema({ mode = "電影" }) {
  return (
    <InfoCard title="快搜項目">
      <Typography>目前選擇：{mode}</Typography>
    </InfoCard>
  );
}

export function DisplayMovieFromDB({ items = [] }) {
  return (
    <InfoCard title="資料庫：電影">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((m, i) => (
            <ListItem sx={{ pl: 0 }} key={i}>
              {m}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplayCinemaFromDB({ items = [] }) {
  return (
    <InfoCard title="資料庫：影城">
      {items.length === 0 ? (
        <Typography color="text.secondary">目前無資料</Typography>
      ) : (
        <List dense>
          {items.map((c, i) => (
            <ListItem sx={{ pl: 0 }} key={i}>
              {c}
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
}

export function DisplayDateFromDB({ items = [] }) {
  return (
    <InfoCard title="可選擇日期">
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

export function DisplaySeat({ seats = [] }) {
  const seatColor = (state) =>
    state === "sold"
      ? "#ffcdd2" // 紅色淡色（已售）
      : state === "picked"
      ? "#bbdefb" // 藍色淡色（選取）
      : "#ffffff"; // 白色（空位）

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
