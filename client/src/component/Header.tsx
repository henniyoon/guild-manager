import React from 'react';
import '../style/Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Header: React.FC = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <h1 className="title">
        <Link to="/">Guild Page</Link>
      </h1>
      <nav className="nav">
        <Link to="/">Home</Link>
        {!isLoggedIn && (
          <>
            <Link to="/SignUp">회원가입</Link>
            <Link to="/Login">로그인</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <span>{userInfo?.username}</span>
            <button onClick={logout}>로그아웃</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;