// NameInput.jsx
import TextField from "@mui/material/TextField";

export default function NameInput() {
  return (
    <TextField
      id="name-input"
      label="姓名"
      variant="outlined"
      placeholder="請輸入姓名"
      fullWidth
      margin="normal"
    />
  );
}
