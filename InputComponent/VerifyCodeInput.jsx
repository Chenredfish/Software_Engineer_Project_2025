// VerifyCodeInput.jsx
// 整合用途: L11 忘記密碼驗證碼輸入，需要整合到登入流程
import TextField from "@mui/material/TextField";

export default function VerifyCodeInput() {
  return (
    <TextField
      id="verify-code-input"
      label="驗證碼"
      variant="outlined"
      placeholder="請輸入驗證碼"
      fullWidth
      margin="normal"
    />
  );
}
