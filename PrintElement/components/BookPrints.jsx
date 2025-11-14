// src/components/BookPrints.jsx
import React from "react";
import { Alert, InfoCard, KeyValue } from "./SharedUI";

export function DisplayCinema({ items = [] }) {
  return (
    <InfoCard title="選擇查詢影城">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((c, i) => <li key={i}>{c}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplayMovie({ items = [] }) {
  return (
    <InfoCard title="選擇查詢電影">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplayDate({ items = [] }) {
  return (
    <InfoCard title="選擇查詢日期">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <div className="flex flex-wrap gap-2">{items.map((d, i) => (
          <span key={i} className="px-3 py-1 rounded-full border">{d}</span>
        ))}</div>}
    </InfoCard>
  );
}

export function DisplayShowing({ items = [] }) {
  return (
    <InfoCard title="選擇查詢場次">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {items.map((s, i) => <div key={i} className="px-3 py-2 rounded border">{s}</div>)}
        </div>}
    </InfoCard>
  );
}

export function DisplayType({ items = [] }) {
  return (
    <InfoCard title="可選擇票種">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>}
    </InfoCard>
  );
}

export function ShowNumError({ message }) {
  return <Alert type="danger">{message || "票種張數不符（必須介於 1~10）"}</Alert>;
}

export function DisplayMenu({ items = [] }) {
  return (
    <InfoCard title="可選擇餐點">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplaySeat({ seats = [] }) {
  // seats: [{ label: "A1", state: "sold|empty|picked" }]
  const color = (s) => s === "sold" ? "bg-red-200" : s === "picked" ? "bg-blue-200" : "bg-white";
  return (
    <InfoCard title="座位狀態" subtitle="紅=已售、白=空位、藍=選中">
      {seats.length === 0 ? <div className="text-gray-500">尚無座位資料</div> :
        <div className="grid grid-cols-8 gap-2">
          {seats.map((s, i) => (
            <div key={i} className={`h-8 w-8 border rounded flex items-center justify-center ${color(s.state)}`}>
              <span className="text-xs">{s.label}</span>
            </div>
          ))}
        </div>}
    </InfoCard>
  );
}

export function DisplayInfo({ cinema, movie, date, showing, typeSummary, menuSummary, seatsSummary, total }) {
  return (
    <InfoCard title="購票資訊">
      <KeyValue label="影城" value={cinema} />
      <KeyValue label="電影" value={movie} />
      <KeyValue label="場次" value={`${date || ""} ${showing || ""}`.trim()} />
      {typeSummary && <KeyValue label="票數" value={typeSummary} />}
      {seatsSummary && <KeyValue label="訂票座位" value={seatsSummary} />}
      {menuSummary && <KeyValue label="餐飲" value={menuSummary} />}
      {total != null && <KeyValue label="總計" value={`$${total}`} />}
    </InfoCard>
  );
}

export function DisplayPayWay({ ways = ["信用卡", "儲值卡"] }) {
  return (
    <InfoCard title="付款方式">
      <ul className="list-disc pl-5">{ways.map((w, i) => <li key={i}>{w}</li>)}</ul>
    </InfoCard>
  );
}

export function DisplayPayError({ message }) {
  return <Alert type="danger">{message || "付款失敗，重新填寫卡片資訊"}</Alert>;
}

export function DisplayPaySuccess({ orderId }) {
  return <Alert type="success">付款成功！訂票序號：{orderId || "———"}</Alert>;
}

export function DisplayTicket({ order }) {
  // order: { theater, movie, datetime, seats: [], menu: [], total, ticketCode }
  return (
    <InfoCard title="你已完成訂票">
      {order ? (
        <div>
          <KeyValue label="影城" value={order.theater} />
          <KeyValue label="電影" value={order.movie} />
          <KeyValue label="場次" value={order.datetime} />
          <KeyValue label="票數" value={(order.type || []).join("、")} />
          <KeyValue label="訂票座位" value={(order.seats || []).join("、")} />
          <KeyValue label="餐飲" value={(order.menu || []).join("、")} />
          <KeyValue label="總計" value={`$${order.total}`} />
          <div className="mt-3">
            <Alert type="info">訂票序號：<span className="font-mono">{order.ticketCode}</span></Alert>
          </div>
        </div>
      ) : <div className="text-gray-500">尚無訂單資料</div>}
    </InfoCard>
  );
}