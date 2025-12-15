import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function TheaterSelect({ theaters, value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="影廳"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 2 }}
    >
      {theaters.length === 0 ? (
        <MenuItem value="" disabled>請先選擇影城</MenuItem>
      ) : (
        theaters.map((t) => (
          <MenuItem key={t.theaterID} value={t.theaterID}>
            {t.theaterName}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}
