import '../style/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <h1 className="title">
        <Link to="/">Guild Page</Link>
      </h1>
      <nav className="nav">
        <a href="/">Home</a>
        <a href="/SignUp">회원가입</a>
        <a href="/Login">로그인</a>
      </nav>
    </header>
  );
};

export default Header;