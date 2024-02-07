// * useContext 훅과 AuthProvider를 사용하여 로그인 정보(인증상태)를 전역으로 공유할 수 있도록 해주는 컴포넌트

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: { username?: string } | null;
  login: (user: { username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username?: string } | null>(null);

  const login = (user: { username: string }) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};