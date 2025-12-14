//登入子系統
import React, { useState } from "react";
import AccountInput from "../InputComponent/AccountInput";
import PasswordInput from "../InputComponent/PasswordInput";
import { PrintLoginResult } from "../PrintElement/LoginPrints";
import axios from "axios";

function LoginPage() {
  // L2: CheckLoginState
  const [isLogin, setIsLogin] = useState(false);
  const [hasTried, setHasTried] = useState(false);

  // L3, L4
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  // L5: CheckLogin
  const handleLogin = async () => {
    setHasTried(true);

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        account,
        password
      });

      if (res.data.success) {
        localStorage.setItem("sessionToken", res.data.sessionToken);
        localStorage.setItem("memberID", res.data.member.memberID);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    } catch (err) {
      setIsLogin(false);
    }
  };

  return (
    <>
      <AccountInput value={account} setValue={setAccount} />
      <PasswordInput value={password} setValue={setPassword} />

      <button onClick={handleLogin}>登入</button>

      {/* L6: PrintLoginResult */}
      {hasTried && <PrintLoginResult success={isLogin} />}
    </>
  );
}

export default LoginPage;
