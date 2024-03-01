import React, { useState } from "react";
import "../styles/SignUp.css"
import Button from '@mui/material/Button';

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인을 위한 상태 추가
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 불일치 에러 메시지를 위한 상태

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자 입력을 username 상태에 반영합니다.
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValidLength = value.length >= 4 && value.length <= 20; // 여기로 이동
    const containsOnlyLettersAndNumbers = /^[A-Za-z0-9]+$/.test(value); // 여기로 이동

    setEmail(value);

    if (!isValidLength || !containsOnlyLettersAndNumbers) {
      setEmailError(
        "ID는 4글자 이상 20글자 이하의 영어와 숫자만 포함할 수 있습니다."
      );
    } else {
      setEmailError(""); // 에러 조건이 없으면 에러 메시지 초기화
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    if (emailError) {
      alert(emailError); // 이메일 관련 에러가 있는 경우 경고 메시지 표시
      return; // 함수 실행 중단
    }

    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 에러 설정
      alert("비밀번호가 일치하지 않습니다."); // 사용자에게 알림
      return; // 함수 실행 중단
    }

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
        window.location.href = "/login"; // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        console.error("회원가입 실패:", data.message);
        alert(`중복확인을 해주세요.`); // 서버에서 반환한 실패 메시지를 사용자에게 표시
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("회원가입 요청 실패"); // 네트워크 오류 등의 예외 처리 시 사용자에게 알림
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const checkDuplicateUsername = async () => {
    const regex = /^[A-Za-z0-9가-힣]{1,8}$/; // 한글, 숫자, 영어를 포함하고 최대 8글자

    if (!regex.test(username)) {
      alert(
        "사용자 이름은 한글, 숫자, 영어로만 구성되어야 하며, 최대 8글자까지 입력 가능합니다."
      );
      return; // 유효성 검사에 실패한 경우 여기서 함수 실행을 중단
    }

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
    const isValidLength = email.length >= 4 && email.length <= 20;
    const containsOnlyLettersAndNumbers = /^[A-Za-z0-9]+$/.test(email);
    // 이메일 길이와 문자 유형이 유효성 검사 기준을 만족하는지 확인
    if (!isValidLength || !containsOnlyLettersAndNumbers) {
      alert("ID는 4글자 이상 20글자 이하의 영어와 숫자만 포함할 수 있습니다.");
      return; // 유효성 검사에 실패한 경우 여기서 함수 실행을 중단
    }

    try {
      const response = await fetch(`/checkEmail?email=${email}`);
      const data = await response.json();
      if (data.isDuplicate) {
        alert("이미 사용중인 ID입니다.");
      } else {
        alert("사용 가능한 ID입니다.");
      }
    } catch (error) {
      console.error("ID 중복 확인 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <Button
          variant="contained" 
          type="button"
          onClick={checkDuplicateUsername}
          className="check-btn"
        >
          중복 확인
        </Button>
      </div>
      <div>
        <label htmlFor="email">ID:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <Button
          variant="contained" 
          type="button"
          onClick={checkDuplicateEmail}
          className="check-btn"
        >
          중복 확인
        </Button>
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
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>
      <Button variant="contained" type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
  회원가입
</Button>
    </form>
  );
};

export default Signup;
