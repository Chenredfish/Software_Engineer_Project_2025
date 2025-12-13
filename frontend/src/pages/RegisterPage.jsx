import React, { useState } from "react";
import TextField from '@mui/material/TextField';


// Input Components
import NameInput from "../InputComponent/NameInput";
import BirthdayInput from "../InputComponent/BirthdayInput";
import IdNumberInput from "../InputComponent/IdNumberInput";
import PhoneInput from "../InputComponent/PhoneInput";
import PasswordInput from "../InputComponent/PasswordInput";
import RegisterButton from "../InputComponent/Button/White background with black border button";

// Error Components
import {
  ShowEmailError,
  ShowPwdError,
  ShowPwdRepeatError,
  ShowIdError,
  ShowNumberError
} from "../PrintElement/components/SignPrints";

import { checkEmailFormat, checkPwdFormat, checkPwdRepeat, checkPhoneNumber } from "../Check/SignCheck";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    let newErrors = {};

    if (!checkEmailFormat(email)) newErrors.email = true;
    if (!checkPwdFormat(password)) newErrors.password = true;
    if (!checkPwdRepeat(password, password2)) newErrors.password2 = true;
    if (!checkPhoneNumber(phone)) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberID: idNumber,
          memberAccount: email,
          memberPwd: password,
          memberName: name,
          memberBirth: birth,
          memberPhone: phone
        })
      });

      const result = await res.json();
      if (result.success) {
        setProfile(result.member);
      } else {
        alert(result.error);
      }
    } catch (e) {
      alert("註冊失敗：" + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <NameInput value={name} onChange={setName} />
      <BirthdayInput value={birth} onChange={setBirth} />
      <IdNumberInput value={idNumber} onChange={setIdNumber} />
      <PhoneInput value={phone} onChange={setPhone} />
      <TextField
        id="email-input"
        label="電子信箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      {errors.email && <ShowEmailError />}
      <PasswordInput value={password} onChange={setPassword} />
      <PasswordInput value={password2} onChange={setPassword2} />
      {errors.password && <ShowPwdError />}
      {errors.password2 && <ShowPwdRepeatError />}

      <RegisterButton text={loading ? "註冊中..." : "註冊"} onClick={handleRegister} />

      {profile && (
        <div style={{ marginTop: 20 }}>
          <h3>註冊成功</h3>
          <p>姓名: {profile.memberName}</p>
          <p>生日: {profile.memberBirth}</p>
          <p>電話: {profile.memberPhone}</p>
          <p>電子信箱: {profile.memberAccount}</p>
        </div>
      )}
    </div>
  );
}
