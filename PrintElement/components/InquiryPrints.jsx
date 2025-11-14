// src/components/InquiryPrints.jsx
import React from "react";
import { Alert, InfoCard, KeyValue } from "./SharedUI";

export function ReturnInquiry({ records = [] }) {
  return (
    <InfoCard title="訂票紀錄">
      {records.length === 0 ? <div className="text-gray-500">沒有紀錄</div> :
        <div className="space-y-2">
          {records.map((r, i) => (
            <div key={i} className="border rounded p-2">
              <KeyValue label="訂票日期" value={r.date} />
              <KeyValue label="訂票狀態" value={r.status} />
              <KeyValue label="影城" value={r.theater} />
              <KeyValue label="電影" value={r.movie} />
              <KeyValue label="場次" value={r.showing} />
              <KeyValue label="座位" value={(r.seats || []).join("、")} />
              <KeyValue label="訂票序號" value={r.code} />
            </div>
          ))}
        </div>}
    </InfoCard>
  );
}

export function PrintRefundFalse({ message }) {
  return <Alert type="danger">{message || "退票失敗（已取票或不符合開演兩小時規定）"}</Alert>;
}

export function DisplayRefundSuccess({ code, amount, method }) {
  return (
    <Alert type="success">
      已成功退票（序號 {code || "———"}）。退款金額 ${amount || 0}，方式：{method || "原路退回"}。
    </Alert>
  );
}