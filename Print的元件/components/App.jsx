// Example App (optional demo)
// src/App.jsx
import React from "react";
import {
  PrintLoginResult, ReturnCode, PrintCodeResult, PrintResetPwdResult,
  ShowEmailError, ShowSign, DisplayCinema as BookDisplayCinema, DisplayTicket,
  ReturnInquiry, DisplayRefundSuccess, DisplayMovie as BrowseDisplayMovie,
} from "./components";

export default function App() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">威泰影城 Print 元件 Demo</h1>
      <PrintLoginResult success />
      <ReturnCode code="A7C9-42" />
      <PrintCodeResult ok />
      <PrintResetPwdResult ok />
      <ShowEmailError />
      <ShowSign profile={{ name: "王小明", email: "test@example.com", id: "A123456789", birth: "2000-01-01", number: "0912-345-678" }} />
      <BookDisplayCinema items={["台北信義威泰", "桃園中壢威泰"]} />
      <DisplayTicket order={{ theater: "信義", movie: "絕地戰警", datetime: "2025/11/12 19:00", seats: ["A1","A2"], menu: ["爆米花套"], total: 560, ticketCode: "WT-9F3K1" }} />
      <ReturnInquiry records={[{ date: "2025/11/01", theater: "信義", showing: "19:10", movie: "沙丘2", seats: ["B3","B4"], code: "X1Z9", status: "已取票" }]} />
      <DisplayRefundSuccess code="X1Z9" amount={280} method="信用卡" />
      <BrowseDisplayMovie items={["沙丘2", "名偵探柯南", "腦筋急轉彎2"]} />
    </div>
  );
}