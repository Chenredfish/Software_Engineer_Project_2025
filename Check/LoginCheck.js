// loginValidators.js
// -----------------------------
// 會員登入、忘記密碼流程驗證
// L2 / L5 / L11 / L14
// -----------------------------

// L2: CheckLoginState()
// 模擬檢查是否已登入
// 參數: session 或 token，這裡簡單傳入 state
export function checkLoginState(state) {
  return state === true;
}

// L5: CheckLogin()
// 對比帳號密碼
// userDB: 模擬使用者資料庫 [{account, password, email}]
export function checkLogin(account, password, userDB) {
  const user = userDB.find((u) => u.account === account);
  if (!user) return false; // 找不到帳號
  return user.password === password;
}

// L11: CheckCode()
// 驗證碼是否正確
export function checkCode(inputCode, correctCode) {
  return inputCode === correctCode;
}

// L14: CheckResetPwd()
// 確認兩次密碼是否相同
// 並可同時檢查密碼格式
export function checkResetPwd(pwd1, pwd2) {
  if (pwd1 !== pwd2) return false; // 不一致
  // 格式檢查: 至少8碼，英文+數字
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(pwd1);
}
