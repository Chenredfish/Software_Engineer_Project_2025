import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function TheaterSelect({
  theaters = [],
  value = "",
  onChange,
  disabled = false
}) {
  return (
    <TextField
      select
      fullWidth
      label="影廳"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || theaters.length === 0}
      sx={{ mt: 2 }}
    >
      {/* 預設提示 */}
      <MenuItem value="" disabled>
        {theaters.length === 0 ? "請先選擇影城" : "請選擇影廳"}
      </MenuItem>

      {/* 影廳選項 */}
      {theaters.map((t) => (
        <MenuItem key={t.theaterID} value={t.theaterID}>
          {t.theaterName}
        </MenuItem>
      ))}
    </TextField>
  );
}
