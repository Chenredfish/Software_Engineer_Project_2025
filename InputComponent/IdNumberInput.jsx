// IdNumberInput.jsx
import TextField from "@mui/material/TextField";

export default function IdNumberInput() {
  return (
    <TextField
      id="id-number-input"
      label="身分證字號"
      variant="outlined"
      placeholder="請輸入身分證字號"
      fullWidth
      margin="normal"
    />
  );
}
