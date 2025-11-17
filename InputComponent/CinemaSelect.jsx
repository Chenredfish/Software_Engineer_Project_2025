// CinemaSelect.jsx
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function CinemaSelect() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");

  // 模擬從資料庫抓資料
  useEffect(() => {
    // 這裡改成你的 API，例如 fetch("/api/cinemas")
    const fetchCinemas = async () => {
      const data = [
        { id: 1, name: "台北信義威秀" },
        { id: 2, name: "台中新光影城" },
        { id: 3, name: "台南南紡威秀" },
      ];
      setCinemas(data);
    };


    // 資料庫API放置位置
   // const fetchCinemas = async () => {  
        //const response = await fetch("/your-api/cinemas");
        //const data = await response.json();
        //setCinemas(data);
   // };

    fetchCinemas();
  }, []);

  return (
    <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
      <TextField
        id="cinema-select"
        select
        label="影城"
        value={selectedCinema}
        onChange={(e) => setSelectedCinema(e.target.value)}
        placeholder="影城"
        helperText="請選擇影城"
      >
        {cinemas.map((cinema) => (
          <MenuItem key={cinema.id} value={cinema.name}>
            {cinema.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
