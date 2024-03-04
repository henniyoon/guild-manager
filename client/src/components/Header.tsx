import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "../styles/Header.module.css";

const Header = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate('/');
  };

  const renderAuthLinks = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Link to="/SignUp" className={styles.link}>
            회원가입
          </Link>
          <Link to="/Login" className={styles.link}>
            로그인
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/MyPage" className={styles.link}>
            {userInfo?.username}
          </Link>
          {/* 로그아웃 Link 대신 div 사용 */}
          <div onClick={handleLogout} className={styles.link} style={{cursor: 'pointer'}}>
            로그아웃
          </div>
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logoLink}>
        <img src="/logo.png" className={styles.logoImage} alt="Guild Manager Logo" />
        <div style={{ marginLeft: "5px" }}>
          <div className={styles.boldText} style={{fontSize: "24px"}}>메소</div>
          <div className={styles.boldText}>메이플길드관리소</div>
        </div>
      </Link>
      <div className={styles.grow} />
      <div className={styles.authLinks}>{renderAuthLinks()}</div>
    </div>
  );
};

export default Header;
