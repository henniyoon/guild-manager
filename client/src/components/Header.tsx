import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AppBar from '@mui/material/AppBar';
import { Toolbar, Button, Typography } from '@mui/material';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();

  const renderAuthLinks = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Button component={Link} to="/SignUp" color="inherit" className={styles.link}>
            회원가입
          </Button>
          <Button component={Link} to="/Login" color="inherit" className={styles.link}>
            로그인
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button component={Link} to="/MyPage" color="inherit" className={styles.link}>
            {userInfo?.username}
          </Button>
          <Button color="inherit" onClick={logout} className={styles.link}>
            로그아웃
          </Button>
        </>
      );
    }
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar>
        <Link to="/" className={styles.logoLink}>
          <img src="/logo.png" className={styles.logo} alt="Guild Manager Logo" />
          <Typography variant="h5" noWrap>
            길드매니저
          </Typography>
        </Link>
        <div className={styles.grow} />
        <div className={styles.authLinks}>{renderAuthLinks()}</div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;