// src/components/SignPrints.jsx
import React from "react";
import { Alert, InfoCard, KeyValue } from "./SharedUI";

export function ShowEmailError() {
  return <Alert type="danger">Email 不符合格式</Alert>;
}

export function ShowEmailRepeatError() {
  return <Alert type="danger">Email 已重複</Alert>;
}

export function ShowPwdError() {
  return <Alert type="danger">密碼不符合格式</Alert>;
}

export function ShowPwdRepeatError() {
  return <Alert type="danger">兩次密碼輸入不同</Alert>;
}

export function ShowIdError() {
  return <Alert type="danger">身分證字號已被使用</Alert>;
}

export function ShowNumberError() {
  return <Alert type="danger">電話號碼不符合格式</Alert>;
}

export function ShowSign({ profile }) {
  // profile: { name, email, id, birth, number }
  return (
    <InfoCard title="註冊資訊">
      {profile ? (
        <div>
          <KeyValue label="姓名" value={profile.name} />
          <KeyValue label="Email" value={profile.email} />
          <KeyValue label="身分證字號" value={profile.id} />
          <KeyValue label="生日" value={profile.birth} />
          <KeyValue label="電話" value={profile.number} />
        </div>
      ) : (
        <div className="text-gray-500">尚無註冊資訊</div>
      )}
    </InfoCard>
  );
}