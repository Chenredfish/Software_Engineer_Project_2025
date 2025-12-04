import TextField from "@mui/material/TextField";

export default function EmailInput({ value, onChange }) {
  return (
    <TextField
      id="email-input"
      label="電子信箱"
      type="email"
      variant="outlined"
      placeholder="請輸入電子信箱"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
