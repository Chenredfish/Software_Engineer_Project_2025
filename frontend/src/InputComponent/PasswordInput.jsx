import TextField from "@mui/material/TextField";
import React from 'react';

export default function PasswordInput({ value, onChange }) {
  return (
    <TextField
      id="password-input"
      label="密碼"
      type="password"
      variant="outlined"
      placeholder="請輸入密碼"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
