// controllerValidators.jsx
// -----------------------------
// 管理員功能檢查函式 (Check)
// -----------------------------

/**
 * C4: CheckLogin()
 * 對比管理員資料庫帳號密碼
 * @param {string} inputAccount
 * @param {string} inputPwd
 * @param {{account:string, pwd:string}} db - 管理員帳密資料
 * @returns {boolean} true = 登入成功, false = 帳號或密碼錯誤
 */
export function checkC4(inputAccount, inputPwd, db) {
  return db.account === inputAccount && db.pwd === inputPwd;
}

/**
 * C5~C8: 資料操作檢查 (示例)
 * 可根據業務需求調整正則或邏輯
 * @param {string} data - 使用者輸入
 * @param {function} validateFn - 驗證函式
 * @returns {boolean} true = 合法, false = 不合法
 */
export function checkC5toC8(data, validateFn) {
  return validateFn(data);
}
