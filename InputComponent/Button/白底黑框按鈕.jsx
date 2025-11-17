// LoginButton.jsx
import Button from "@mui/material/Button";

export default function LoginButton({ onClick }) {
  return (
    <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={onClick}>
      我要儲值
    </Button>
  );
}