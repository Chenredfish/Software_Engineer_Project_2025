import Button from "@mui/material/Button";
import React from 'react';

export default function RegisterButton({ text = "登入", onClick }) {
  return (
    <Button
      variant="contained"   // 實心按鈕
      color="primary"       // 主色系
      fullWidth             // 寬度填滿父容器
      sx={{ mt: 2 }}        // 上方 margin
      onClick={onClick}     // 點擊事件
    >
      {text}
    </Button>
  );
}
