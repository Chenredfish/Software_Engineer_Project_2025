// AccountInput.jsx
import TextField from "@mui/material/TextField";

export default function AccountInput() {
  return (
    <TextField
      id="account-input"
      label="帳號"
      variant="outlined"
      placeholder="請輸入帳號"
      fullWidth
      margin="normal"
    />
  );
}
