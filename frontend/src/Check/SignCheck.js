// validators.js
// -----------------------------
// 註冊用所有 Check（格式 / 重複檢查）
// S4 / S6 / S9 / S11 / S14 / S18
// -----------------------------

// ⭐ S4 — CheckEmail 格式
export function checkEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ⭐ S6 — CheckEmailRepeat（需要後端 API）
export async function checkEmailRepeat(email) {
  try {
    const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.available; 
    // 後端回傳 { available: true } 表示「不重複」
  } catch (e) {
    console.error("Email Repeat Check Error", e);
    return false; // 若 API 爆掉，當作重複避免錯誤註冊
  }
}

// ⭐ S9 — CheckPwd 格式
// 至少 8 碼，含英文 + 數字
export function checkPwdFormat(pwd) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(pwd);
}

// ⭐ S11 — CheckPwdRepeat
export function checkPwdRepeat(pwd1, pwd2) {
  return pwd1 === pwd2;
}

// ⭐ S14 — CheckIdRepeat（需後端查 DB）
export async function checkIdRepeat(id) {
  try {
    const res = await fetch(`/api/check-id?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    return data.available;  
    // true = 身分證不重複
  } catch (e) {
    console.error("ID Repeat Check Error", e);
    return false; 
  }
}

// ⭐ S18 — CheckNumber（台灣手機格式）
export function checkPhoneNumber(number) {
  const regex = /^09\d{8}$/;
  return regex.test(number);
}
