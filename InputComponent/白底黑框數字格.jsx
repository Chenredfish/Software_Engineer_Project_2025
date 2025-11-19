// NumberInput.jsx
import TextField from "@mui/material/TextField";

export default function NumberInput({ value, onChange }) {
  const handleChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      onChange(val);
      return;
    }

    const num = Number(val);

    // 只允許 1~9
    if (num > 0 && num < 10) {
      onChange(val);
    }
  };

  return (
    <TextField
      type="number"
      value={value}
      onChange={handleChange}
      placeholder=""
      fullWidth
      sx={{
        backgroundColor: "white",          // 白底
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "black",          // 黑框
          },
          "&:hover fieldset": {
            borderColor: "black",          // hover 也保持黑框
          },
          "&.Mui-focused fieldset": {
            borderColor: "black",          // focus 也保持黑框
          },
        },
      }}
    />
  );
}
