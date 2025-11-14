// src/components/LoginPrints.jsx
import React from "react";
import { Alert, InfoCard } from "./SharedUI";

export function PrintLoginResult({ success }) {
  return (
    <Alert type={success ? "success" : "danger"}>
      {success ? "登入成功" : "帳號或密碼錯誤"}
    </Alert>
  );
}

export function ReturnCode({ code }) {
  return (
    <InfoCard title="忘記密碼驗證碼">
      <div className="font-mono text-xl tracking-widest">{code || "———"}</div>
    </InfoCard>
  );
}

export function PrintCodeResult({ ok }) {
  return (
    <Alert type={ok ? "success" : "danger"}>
      {ok ? "驗證碼正確" : "驗證碼錯誤，查無電子郵件"}
    </Alert>
  );
}

export function PrintResetPwdResult({ ok, message }) {
  return (
    <Alert type={ok ? "success" : "danger"}>
      {ok ? "修改成功" : message || "密碼不符合規定"}
    </Alert>
  );
}