import TextField from "@mui/material/TextField";

export default function PhoneInput({ value, onChange }) {
  return (
    <TextField
      id="phone-input"
      label="電話號碼"
      variant="outlined"
      placeholder="請輸入電話號碼"
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
