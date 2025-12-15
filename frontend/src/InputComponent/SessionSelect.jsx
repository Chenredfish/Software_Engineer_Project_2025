import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SessionSelect({ sessions, value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="場次"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 2 }}
      disabled={sessions.length === 0}
    >
      {sessions.length === 0 ? (
        <MenuItem value="" disabled>
          請先選擇電影與影廳
        </MenuItem>
      ) : (
        sessions.map((s) => (
          <MenuItem key={s.showingID} value={s.showingID}>
            {s.showingTime} {/* 直接顯示完整時間 */}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}
