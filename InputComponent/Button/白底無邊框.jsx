// ForgotPasswordButton.jsx
import Button from "@mui/material/Button";

export default function ForgotPasswordButton({ onClick }) {
  return (
    <Button
      variant="text" // 無外框、無背景
      fullWidth
      sx={{
        color: "#000", // 黑色文字，可改
        backgroundColor: "#fff", // 白底
        textTransform: "none", // 不自動大寫
        "&:hover": {
          backgroundColor: "#f0f0f0", // 滑鼠懸停淺灰
        },
      }}
      onClick={onClick}
    >
      忘記密碼
    </Button>
  );
}
