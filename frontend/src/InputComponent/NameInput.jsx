// NameInput.jsx
import TextField from "@mui/material/TextField";
import React from 'react';

export default function NameInput({ value, onChange }) {
  return (
    <TextField
      id="name-input"
      label="姓名"
      variant="outlined"
      placeholder="請輸入姓名"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
