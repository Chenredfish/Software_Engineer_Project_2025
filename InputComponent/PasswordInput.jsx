// PasswordInput.jsx
// 整合用途: L4 登入密碼, S8 註冊密碼, 可重用於 C3 管理員密碼輸入
import TextField from "@mui/material/TextField";

export default function PasswordInput() {
  return (
    <TextField
      id="password-input"
      label="密碼"
      type="password"
      variant="outlined"
      placeholder="請輸入密碼"
      fullWidth
      margin="normal"
    />
  );
}
