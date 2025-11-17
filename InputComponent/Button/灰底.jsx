// NoButton.jsx
import Button from "@mui/material/Button";

export default function NoButton({ onClick }) {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 1, backgroundColor: "#9e9e9e", "&:hover": { backgroundColor: "#757575" } }}
      onClick={onClick}
    >
      否
    </Button>
  );
}
