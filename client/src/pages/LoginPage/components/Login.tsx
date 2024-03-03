import React, { useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import * as React from 'react';
import Button from '@mui/material/Button';
import '../styles/Login.css';

interface LoginProps {
  // 필요한 경우 추가 props 정의
}

interface decodedToken {
  username: string;
}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const decodedToken: decodedToken = jwtDecode(data.token);
        console.log("decodedToken : ", decodedToken)
        login({ username: decodedToken.username }); // 로그인 상태 업데이트
        localStorage.setItem("token", data.token); // 토큰 저장
        navigate("/"); // 홈페이지로 리다이렉트
      } else {
        console.error("로그인 실패:", data.message);
        setErrorMessage(data.message || "로그인에 실패했습니다."); // 오류 메시지 설정
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      setErrorMessage("로그인 요청 중 문제가 발생했습니다."); // 오류 메시지 설정
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <label htmlFor="email">ID:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <Button variant="contained" type="submit">로그인</Button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default Login;
