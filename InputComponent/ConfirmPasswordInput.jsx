// ConfirmPasswordInput.jsx
import TextField from "@mui/material/TextField";

export default function ConfirmPasswordInput() {
  return (
    <TextField
      id="confirm-password-input"
      label="確認密碼"
      type="password"
      variant="outlined"
      placeholder="請再次輸入密碼"
      fullWidth
      margin="normal"
    />
  );
}
