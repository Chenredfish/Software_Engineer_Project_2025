// SessionSelect.jsx
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SessionSelect() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    // 模擬資料庫回傳
    const fetchSessions = async () => {
      const data = [
        { id: 1, time: "10:30" },
        { id: 2, time: "13:00" },
        { id: 3, time: "15:45" },
        { id: 4, time: "19:20" },
      ];
      setSessions(data);
    };

    // 資料庫 API
    // const fetchSessions = async () => {
    //   const res = await fetch("/api/sessions");
    //   const data = await res.json();
    //   setSessions(data);
    // };

    fetchSessions();
  }, []);

  return (
    <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
      <TextField
        id="session-select"
        select
        label="場次"
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
        placeholder="場次"
        helperText="請選擇場次"
      >
        {sessions.map((s) => (
          <MenuItem key={s.id} value={s.time}>
            {s.time}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
