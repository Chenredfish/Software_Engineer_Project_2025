import TextField from "@mui/material/TextField";
import React from 'react';

export default function IdNumberInput({ value, onChange }) {
  return (
    <TextField
      id="id-number-input"
      label="身分證字號"
      variant="outlined"
      placeholder="請輸入身分證字號"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
