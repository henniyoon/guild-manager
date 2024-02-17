import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage/Mainpage';
import Guildpage from './pages/GuildPage/Guildpage';
import Graphpage from './pages/GraphPage/Graphpage';
import Adminpage from './pages/AdminPage/Adminpage'
import Loginpage from './pages/LoginPage/Loginpage';
import SignUppage from './pages/SingUpPage/SignUppage';
import Mypage from './pages/MyPage/Mypage';

const App: React.FC = () => {
  return (

    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/Guildpage/:worldName/:guildName" element={<Guildpage />} />
      <Route path="/Graphpage/:memberName" element={<Graphpage />} />
      <Route path="/Adminpage" element={<Adminpage />} />
      <Route path="/Login" element={<Loginpage />} />
      <Route path="/SignUp" element={<SignUppage />} />
      <Route path="/Mypage" element={<Mypage />} />
    </Routes>

  );
};

export default App;