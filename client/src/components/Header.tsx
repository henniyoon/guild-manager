import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "../styles/Header.module.css";

const Header = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
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
          <button onClick={handleLogout} className={styles.link}>
            로그아웃
          </button>
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logoLink}>
        <img src="/logo.png" className={styles.logoImage} alt="Guild Manager Logo" />
        <div style={{ marginLeft: "5px" }}>
          <div className={styles.boldText}>메소</div>
          <div className={styles.boldText}>메이플길드관리소</div>
        </div>
      </Link>
      <div className={styles.grow} />
      <div className={styles.authLinks}>{renderAuthLinks()}</div>
    </div>
  );
};

export default Header;
