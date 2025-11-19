import React, { useState } from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";

export default function CardSelector() {
  const [cardType, setCardType] = useState("");

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: 300, gap: 1 }}>
      <Typography>付款方式:</Typography>
      <FormControl sx={{ flex: 1, bgcolor: "white", border: "1px solid black" }}>
        <Select
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          displayEmpty
          sx={{
            "& .MuiSelect-select": { color: "black", padding: "8px" },
            "& fieldset": { border: "none" },
          }}
        >
          <MenuItem value="">
            <em>請選擇</em>
          </MenuItem>
          <MenuItem value="credit">信用卡</MenuItem>
          <MenuItem value="stored">儲值卡</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
