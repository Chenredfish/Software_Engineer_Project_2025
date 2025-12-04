// NameInput.jsx
// 整合用途: S2 註冊姓名輸入, 可重用於 M9 GetUserName
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
