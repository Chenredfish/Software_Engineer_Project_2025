// src/components/MemberChangePrints.jsx
import React from "react";
import { Alert, InfoCard, KeyValue } from "./SharedUI";

export function ShowMemberInfo({ profile }) {
  const p = profile || {};
  return (
    <InfoCard title="會員資料">
      {profile ? (
        <div>
          <KeyValue label="姓名" value={p.name} />
          <KeyValue label="Email" value={p.email} />
          <KeyValue label="電話" value={p.phone} />
          <KeyValue label="儲值餘額" value={p.balance != null ? `$${p.balance}` : "—"} />
        </div>
      ) : <div className="text-gray-500">尚無資料</div>}
    </InfoCard>
  );
}

export function MemberChangeError({ message }) {
  return <Alert type="danger">{message || "更改資料失敗"}</Alert>;
}

export function DisplaySaveSuccess({ message }) {
  return <Alert type="success">{message || "已成功更新資料"}</Alert>;
}

export function DisplayTopUpError({ message }) {
  return <Alert type="danger">{message || "加值失敗，請確認付款資訊"}</Alert>;
}

export function DisplayTopUpSuccess({ amount, balance }) {
  return <Alert type="success">加值成功！金額 ${amount || 0}，新餘額 ${balance != null ? balance : "—"}</Alert>;
}