import React from 'react';
import '../style/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <h1 className="title">Guild Page</h1>
      <nav className="nav">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;