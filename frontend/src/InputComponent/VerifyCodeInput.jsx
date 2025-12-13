import TextField from "@mui/material/TextField";

export default function VerifyCodeInput({ value, onChange }) {
  return (
    <TextField
      id="verify-code-input"
      label="驗證碼"
      variant="outlined"
      placeholder="請輸入驗證碼"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
