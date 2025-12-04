// memberValidators.jsx
// -----------------------------
// 會員修改與儲值流程檢查函式 (Check)
// -----------------------------

/**
 * M2: CheckSign()
 * 確認使用者是否登入
 * @param {boolean} isLoggedIn
 * @returns {boolean} true = 已登入, false = 未登入
 */
export function checkM2(isLoggedIn) {
  return isLoggedIn === true;
}

/**
 * M6: CheckPhoneFmt()
 * 檢查電話號碼格式
 * @param {string} phone
 * @returns {boolean} true = 格式正確, false = 格式錯誤
 */
export function checkM6(phone) {
  const phoneRegex = /^[0-9]{8,15}$/; // 簡單示例: 8~15位數字
  return phoneRegex.test(phone);
}

/**
 * M7: CheckEmailFmt()
 * 檢查電子郵件格式
 * @param {string} email
 * @returns {boolean} true = 格式正確, false = 格式錯誤
 */
export function checkM7(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * M8: CheckPwdFmt()
 * 檢查密碼格式
 * @param {string} pwd
 * @returns {boolean} true = 格式正確, false = 格式錯誤
 */
export function checkM8(pwd) {
  // 密碼至少6位，包含字母和數字
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return pwdRegex.test(pwd);
}

/**
 * M16: CheckPayAccount()
 * 檢查銀行帳號是否可使用
 * @param {string} accountInput
 * @param {string[]} validAccounts
 * @returns {boolean} true = 可使用, false = 不可使用
 */
export function checkM16(accountInput, validAccounts) {
  return validAccounts.includes(accountInput);
}
