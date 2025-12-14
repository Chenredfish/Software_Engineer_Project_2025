import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

export default function SessionSelect({ movieID, cinemaID, value, onChange, setDate }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!movieID || !cinemaID) {
      setSessions([]);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/showings", {
          params: { movieID, cinemaID }
        });
        setSessions(res.data);
      } catch (err) {
        console.error("Fetch sessions error:", err);
      }
    };

    fetchSessions();
  }, [movieID, cinemaID]);

  const handleChange = (id) => {
    onChange(id);
    const selected = sessions.find((s) => s.showingID === id);
    if (selected) setDate(selected.date); // 選擇場次帶出日期
  };

  return (
    <TextField
      select
      fullWidth
      label="場次"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      sx={{ mt: 2 }}
    >
      {sessions.length === 0 ? (
        <MenuItem value="" disabled>請先選擇電影與影城</MenuItem>
      ) : (
        sessions.map((s) => (
          <MenuItem key={s.showingID} value={s.showingID}>
            {s.startTime} ({s.room})
          </MenuItem>
        ))
      )}
    </TextField>
  );
}
