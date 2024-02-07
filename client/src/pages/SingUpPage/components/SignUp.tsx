import React, { useState } from "react";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("회원가입 성공:", data);
        window.location.href = "/login";
      } else {
        console.error("회원가입 실패:", data.message);
        // 회원가입 실패 처리 로직
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
    }
  };

  const checkDuplicateUsername = async () => {
    try {
      const response = await fetch(`/checkUsername?username=${username}`);
      const data = await response.json();
      if (data.isDuplicate) {
        alert("이미 사용중인 사용자 이름입니다.");
      } else {
        alert("사용 가능한 사용자 이름입니다.");
      }
    } catch (error) {
      console.error("사용자 이름 중복 확인 실패:", error);
    }
  };

  const checkDuplicateEmail = async () => {
    try {
      const response = await fetch(`/checkEmail?email=${email}`);
      const data = await response.json();
      if (data.isDuplicate) {
        alert("이미 사용중인 이메일입니다.");
      } else {
        alert("사용 가능한 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <button type="button" onClick={checkDuplicateUsername}>
          중복 확인
        </button>
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <button type="button" onClick={checkDuplicateEmail}>
          중복 확인
        </button>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <button type="submit">회원가입</button>
    </form>
  );
};

export default Signup;
