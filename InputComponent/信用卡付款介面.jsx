import React, { useState, useEffect } from "react";

// Plain React implementation (no external UI library) so it builds in sandboxed environments
// Includes:
// - 信用卡卡號自動分組顯示 (4-4-4-4...)
// - Luhn 檢查
// - CVV (3-4 digits) 驗證
// - 到期月/年選單
// - 簡單的測試案例顯示（用於開發與除錯）

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [errors, setErrors] = useState({ card: "", cvv: "", expiry: "" });

  // Luhn algorithm
  const luhnCheck = (num) => {
    const clean = num.replace(/\s+/g, "");
    if (!/^[0-9]+$/.test(clean) || clean.length < 12) return false; // minimal length guard
    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateCVV = (v) => /^[0-9]{3,4}$/.test(v);

  const formatCardNumber = (raw) => {
    const digits = raw.replace(/\D/g, "");
    // group by 4
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    // live validation
    setErrors((prev) => ({ ...prev, card: formatted.length ? (luhnCheck(formatted) ? "" : "信用卡號格式錯誤") : "" }));
  };

  const handleCvvChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    // limit to 4
    setCvv(digits.slice(0, 4));
    setErrors((prev) => ({ ...prev, cvv: digits.length ? (validateCVV(digits) ? "" : "安全碼需為 3 或 4 位數字") : "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardValid = luhnCheck(cardNumber);
    const cvvValid = validateCVV(cvv);
    const expiryValid = !!month && !!year;

    setErrors({
      card: cardValid ? "" : "信用卡號格式錯誤",
      cvv: cvvValid ? "" : "安全碼需為 3 或 4 位數字",
      expiry: expiryValid ? "" : "請選擇卡片到期日",
    });

    if (cardValid && cvvValid && expiryValid) {
      alert("付款成功！");
    }
  };

  // --- Simple test cases viewer for developer/debugging ---
  const sampleCards = [
    { num: "4242 4242 4242 4242", expect: true }, // common Stripe test Visa
    { num: "4111 1111 1111 1111", expect: true },
    { num: "4000 0000 0000 0002", expect: false },
    { num: "1234 5678 9012 3456", expect: false },
  ];
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const results = sampleCards.map((c) => ({ ...c, pass: luhnCheck(c.num) }));
    setTestResults(results);
  }, []);

  // small inline styles so the component is self-contained in the preview
  const styles = {
    container: {
      width: 360,
      padding: 16,
      fontFamily: 'Inter, Roboto, sans-serif',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    label: { display: 'block', fontSize: 12, marginBottom: 6, color: '#374151' },
    input: { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 },
    row: { display: 'flex', gap: 8 },
    small: { fontSize: 12, color: '#ef4444' },
    button: { marginTop: 12, padding: '10px 12px', borderRadius: 6, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer' },
    helper: { marginTop: 12, fontSize: 12, color: '#6b7280' },
    testBox: { marginTop: 14, padding: 8, background: '#f8fafc', borderRadius: 6, fontSize: 13 }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container} noValidate>
      <div style={{ marginBottom: 10 }}>
        <label style={styles.label} htmlFor="card">信用卡卡號</label>
        <input
          id="card"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={handleCardChange}
          style={styles.input}
        />
        {errors.card && <div style={{ ...styles.small, marginTop: 6 }}>{errors.card}</div>}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="cvv">安全碼</label>
          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            maxLength={4}
            style={styles.input}
            autoComplete="cc-csc"
          />
          {errors.cvv && <div style={{ ...styles.small, marginTop: 6 }}>{errors.cvv}</div>}
        </div>

        <div style={{ width: 160 }}>
          <label style={styles.label}>卡片到期日</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ ...styles.input, padding: '8px' }}>
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ ...styles.input, padding: '8px' }}>
              <option value="">年</option>
              {Array.from({ length: 12 }, (_, i) => `${new Date().getFullYear() + i}`).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {errors.expiry && <div style={{ ...styles.small, marginTop: 6 }}>{errors.expiry}</div>}
        </div>
      </div>

      <button type="submit" style={styles.button}>確認付款</button>

      <div style={styles.helper}>提示：卡號輸入會自動移除非數字並每 4 位分一組顯示。</div>

      <div style={styles.testBox}>
        <strong>開發測試 (Luhn 檢查)</strong>
        <ul>
          {testResults.map((t) => (
            <li key={t.num}>
              {t.num} — 預期: {t.expect ? 'valid' : 'invalid'} — 偵測: {t.pass ? 'valid' : 'invalid'}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
