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

  const drawerWidth = 240;

  return (
    <AppBar 
    position="fixed"
    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        
        <div className={styles.grow} />
        <div className={styles.authLinks}>{renderAuthLinks()}</div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;