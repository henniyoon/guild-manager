import React from 'react';
import '../style/Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header: React.FC = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <header className="header p-1" style={{ textAlign: 'center', padding: '10px 0' }}>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <Link to="/" style={linkStyle}>
              <img src="/logo.png" style={{ maxHeight: '50px', marginRight: '10px' }} alt="Guild Manager Logo" />
              길드매니저
            </Link>
          </a>
        </div>
      </nav>
      <nav className="nav">
        {!isLoggedIn && (
          <>
            <Link to="/SignUp">회원가입</Link>
            <Link to="/Login">로그인</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link to="/MyPage">{userInfo?.username}</Link>
            {/* <span>{userInfo?.username}</span> */}
            <button onClick={logout}>로그아웃</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;