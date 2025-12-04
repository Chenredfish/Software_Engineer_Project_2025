// AccountInput.jsx
// 整合用途: L3 登入帳號輸入, 可重用於 C2 管理員帳號輸入
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
