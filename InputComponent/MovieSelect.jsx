// MovieSelect.jsx
// 整合用途: 整合 B8, Br6, Br21 的電影選擇功能
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function MovieSelect() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  useEffect(() => {
    // 模擬資料庫回傳
    const fetchMovies = async () => {
      const data = [
        { id: 1, name: "咒術迴戰 0" },
        { id: 2, name: "鬼滅之刃 無限列車篇" },
        { id: 3, name: "你的名字" },
      ];
      setMovies(data);
    };

    // 資料庫 API 範例
    // const fetchMovies = async () => {
    //   const res = await fetch("/api/movies");
    //   const data = await res.json();
    //   setMovies(data);
    // };

    fetchMovies();
  }, []);

  return (
    <Box sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}>
      <TextField
        id="movie-select"
        select
        label="電影"
        value={selectedMovie}
        onChange={(e) => setSelectedMovie(e.target.value)}
        placeholder="電影"
        helperText="請選擇電影"
      >
        {movies.map((movie) => (
          <MenuItem key={movie.id} value={movie.name}>
            {movie.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
