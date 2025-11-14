// src/components/BrowsePrints.jsx
import React from "react";
import { InfoCard } from "./SharedUI";

export function DisplayCinema({ items = [] }) {
  return (
    <InfoCard title="影城資訊">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((c, i) => <li key={i}>{c}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplayChoose({ options = ["電影", "影城", "餐飲", "活動", "快搜"] }) {
  return (
    <InfoCard title="可查詢項目">
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => <span key={i} className="px-3 py-1 rounded-full border">{o}</span>)}
      </div>
    </InfoCard>
  );
}

export function DisplayMovie({ items = [] }) {
  return (
    <InfoCard title="電影列表">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </InfoCard>
  );
}

export function MovieDetail({ detail }) {
  // detail: { title, director, actors, runtime, intro }
  const d = detail || {};
  return (
    <InfoCard title={d.title || "電影詳情"}>
      <div className="space-y-1 text-sm">
        {d.director && <div>導演：{d.director}</div>}
        {d.actors && <div>演員：{Array.isArray(d.actors) ? d.actors.join("、") : d.actors}</div>}
        {d.runtime && <div>片長：{d.runtime}</div>}
        {d.intro && <div className="mt-2">{d.intro}</div>}
      </div>
    </InfoCard>
  );
}

export function DisplayCinemaInfo({ detail }) {
  // detail: { name, address, phone, rooms }
  const d = detail || {};
  return (
    <InfoCard title={d.name || "影城資訊"}>
      {d.address && <div className="text-sm">地址：{d.address}</div>}
      {d.phone && <div className="text-sm">電話：{d.phone}</div>}
      {d.rooms && <div className="text-sm">影廳數：{d.rooms}</div>}
    </InfoCard>
  );
}

export function CinemaDetail({ detail }) {
  return <DisplayCinemaInfo detail={detail} />;
}

export function DisplayMenu({ items = [] }) {
  return (
    <InfoCard title="餐飲列表">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </InfoCard>
  );
}

export function MenuDetail({ detail }) {
  // detail: { name, price, description }
  const d = detail || {};
  return (
    <InfoCard title={d.name || "餐飲詳情"}>
      {d.price != null && <div className="text-sm">價格：${d.price}</div>}
      {d.description && <div className="text-sm mt-1">{d.description}</div>}
    </InfoCard>
  );
}

export function DisplayActivities({ items = [] }) {
  return (
    <InfoCard title="活動列表">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((a, i) => <li key={i}>{a}</li>)}</ul>}
    </InfoCard>
  );
}

export function ActivitiesDetail({ detail }) {
  const d = detail || {};
  return (
    <InfoCard title={d.name || "活動詳情"}>
      {d.date && <div className="text-sm">日期：{d.date}</div>}
      {d.content && <div className="text-sm mt-1">{d.content}</div>}
    </InfoCard>
  );
}

export function DisplayMovieOrCinema({ mode = "電影" }) {
  return (
    <InfoCard title="快搜項目">
      <div className="text-sm">目前選擇：{mode}</div>
    </InfoCard>
  );
}

export function DisplayMovieFromDB({ items = [] }) {
  return (
    <InfoCard title="資料庫：電影">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplayCinemaFromDB({ items = [] }) {
  return (
    <InfoCard title="資料庫：影城">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <ul className="list-disc pl-5">{items.map((c, i) => <li key={i}>{c}</li>)}</ul>}
    </InfoCard>
  );
}

export function DisplayDateFromDB({ items = [] }) {
  return (
    <InfoCard title="可選擇日期">
      {items.length === 0 ? <div className="text-gray-500">目前無資料</div> :
        <div className="flex flex-wrap gap-2">{items.map((d, i) => (
          <span key={i} className="px-3 py-1 rounded-full border">{d}</span>
        ))}</div>}
    </InfoCard>
  );
}

export function DisplaySeat({ seats = [] }) {
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