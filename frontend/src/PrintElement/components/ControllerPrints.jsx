// src/components/ControllerPrints.jsx
import React from "react";
import { Alert } from "./SharedUI";

// 規格書中 C4 CheckLogin() 含 Print 行為：顯示成功或錯誤
export function ControllerLoginResult({ success }) {
  return (
    <Alert type={success ? "success" : "danger"}>
      {success ? "管理員登入成功" : "帳號或密碼錯誤"}
    </Alert>
  );
}