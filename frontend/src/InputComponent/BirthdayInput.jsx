import TextField from "@mui/material/TextField";
import React from 'react';

export default function BirthdayInput({ value, onChange }) {
  return (
    <TextField
      id="birthday-input"
      label="生日"
      variant="outlined"
      placeholder="請輸入生日（例如：2003-05-21）"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
