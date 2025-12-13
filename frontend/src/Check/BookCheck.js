// bookingValidators.jsx
// -----------------------------
// 購票流程檢查函式 (Check)
// -----------------------------

/**
 * B2: CheckSign()
 * 檢查使用者是否已登入
 * @param {boolean} isLoggedIn
 * @returns {boolean} true = 已登入, false = 未登入
 */
export function checkB2(isLoggedIn) {
  return isLoggedIn === true;
}

/**
 * B16: CheckTicketNum()
 * 檢查使用者選擇票數是否在合法範圍
 * @param {number} num - 使用者選擇張數
 * @param {number} max - 最大可購票張數 (預設 10)
 * @returns {boolean} true = 合法, false = 不合法
 */
export function checkB16(num, max = 10) {
  if (typeof num !== "number") return false;
  return num > 0 && num <= max;
}

/**
 * B28: CheckPayAccount()
 * 檢查銀行帳號是否可使用
 * @param {string} accountInput - 使用者輸入帳號
 * @param {string[]} validAccounts - 可用銀行帳號列表
 * @returns {boolean} true = 可用, false = 不可用
 */
export function checkB28(accountInput, validAccounts) {
  return validAccounts.includes(accountInput);
}

/**
 * B29: CheckBalance()
 * 檢查儲值卡餘額是否充足
 * @param {number} balance - 儲值卡餘額
 * @param {number} totalCost - 訂單總額
 * @returns {boolean} true = 餘額充足, false = 餘額不足
 */
export function checkB29(balance, totalCost) {
  if (typeof balance !== "number" || typeof totalCost !== "number") return false;
  return balance >= totalCost;
}
