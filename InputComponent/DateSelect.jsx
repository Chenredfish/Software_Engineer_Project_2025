// DateSelect.jsx
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function DateSelect() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // 模擬資料庫回傳
    const fetchDates = async () => {
      const data = [
        { id: 1, date: "2025/02/01" },
        { id: 2, date: "2025/02/02" },
        { id: 3, date: "2025/02/03" },
      ];
      setDates(data);
    };

    // 資料庫 API 範例
    // const fetchDates = async () => {
    //   const res = await fetch("/api/dates");
    //   const data = await res.json();
    //   setDates(data);
    // };

    fetchDates();
  }, []);

  return (
    <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
      <TextField
        id="date-select"
        select
        label="日期"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        placeholder="日期"
        helperText="請選擇日期"
      >
        {dates.map((item) => (
          <MenuItem key={item.id} value={item.date}>
            {item.date}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
