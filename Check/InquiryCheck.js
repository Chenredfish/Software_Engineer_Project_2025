// inquiryValidators.jsx
// -----------------------------
// 訂票紀錄查詢與退票流程檢查函式 (Check)
// -----------------------------

/**
 * In2: CheckSign()
 * 檢查使用者是否已登入
 * @param {boolean} isLoggedIn
 * @returns {boolean} true = 已登入, false = 未登入
 */
export function checkIn2(isLoggedIn) {
  return isLoggedIn === true;
}

/**
 * In4: CheckGetTicket()
 * 確認使用者是否已取票
 * @param {boolean} hasTakenTicket
 * @returns {boolean} true = 已取票, false = 未取票
 */
export function checkIn4(hasTakenTicket) {
  return hasTakenTicket === true;
}

/**
 * In5: CheckTwoHours()
 * 確認是否為放映前兩小時內
 * @param {Date} showTime - 放映時間
 * @param {Date} nowTime - 當前時間
 * @returns {boolean} true = 仍在放映前兩小時內, false = 已超過
 */
export function checkIn5(showTime, nowTime) {
  if (!(showTime instanceof Date) || !(nowTime instanceof Date)) return false;
  const diffMs = showTime - nowTime; // 毫秒差
  const diffHours = diffMs / (1000 * 60 * 60); // 轉小時
  return diffHours >= 2; // 放映前兩小時內
}

/**
 * In6: CheckRefund()
 * 確認訂單是否已退票
 * @param {boolean} isRefunded
 * @returns {boolean} true = 已退票, false = 未退票
 */
export function checkIn6(isRefunded) {
  return isRefunded === true;
}

/**
 * In8: GetPayWay()
 * 確認使用者付款方式
 * @param {string} payWay - 使用者付款方式 ('bank' 或 'card')
 * @returns {string} 'bank' 或 'card'，不合法會回傳空字串 ''
 */
export function checkIn8(payWay) {
  if (payWay === "bank") return "bank";
  if (payWay === "card") return "card";
  return "";
}
