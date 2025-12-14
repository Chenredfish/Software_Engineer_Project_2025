import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function MovieSelect({ movies, value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="電影"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText="請選擇電影"
      sx={{ mt: 2 }}
    >
      {movies.map((m) => (
        <MenuItem key={m.movieID} value={m.movieID}>
          {m.movieName}
        </MenuItem>
      ))}
    </TextField>
  );
}
