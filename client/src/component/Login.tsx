import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  // 필요한 경우 추가 props 정의
}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('로그인 성공:', data);
        login({ username: data.username }); // 로그인 상태 업데이트
        localStorage.setItem('token', data.token); // 토큰 저장
        navigate('/'); // 홈페이지로 리다이렉트
      } else {
        console.error('로그인 실패:', data.message);
        setErrorMessage(data.message || '로그인에 실패했습니다.'); // 오류 메시지 설정
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      setErrorMessage('로그인 요청 중 문제가 발생했습니다.'); // 오류 메시지 설정
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="email"
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
      <button type="submit">로그인</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default Login;
