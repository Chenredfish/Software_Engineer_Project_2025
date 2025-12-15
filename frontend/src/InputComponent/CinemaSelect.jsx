import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function CinemaSelect({ cinemas, value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="影城"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText="請選擇影城"
      sx={{ mt: 2 }}
    >
      {cinemas.map((c) => (
        <MenuItem key={c.cinemaID} value={c.cinemaID}>
          {c.cinemaName}
        </MenuItem>
      ))}
    </TextField>
  );
}
