// EmailInput.jsx
// 整合用途: L8 忘記密碼Email輸入, S3 註冊Email輸入
import TextField from "@mui/material/TextField";

export default function EmailInput() {
  return (
    <TextField
      id="email-input"
      label="電子信箱"
      type="email"
      variant="outlined"
      placeholder="請輸入電子信箱"
      fullWidth
      margin="normal"
    />
  );
}
