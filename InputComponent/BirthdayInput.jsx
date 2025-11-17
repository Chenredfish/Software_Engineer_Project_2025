// BirthdayInput.jsx
import TextField from "@mui/material/TextField";

export default function BirthdayInput() {
  return (
    <TextField
      id="birthday-input"
      label="生日"
      variant="outlined"
      placeholder="請輸入生日（例如：2003/05/21）"
      fullWidth
      margin="normal"
    />
  );
}
