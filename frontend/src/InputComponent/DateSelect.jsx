import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function DateSelect({ dates, value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="日期"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 2 }}
    >
      {dates.length === 0 ? (
        <MenuItem value="" disabled>請先選擇場次</MenuItem>
      ) : (
        dates.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}
