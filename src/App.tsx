import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './component/Mainpage';
import Guildpage from './component/Guildpage';
import Graphpage from './component/Graphpage';
import Adminpage from './component/Adminpage'
import Loginpage from './component/Loginpage';
import SignUppage from './component/SignUppage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/Guildpage/:server/:guild" element={<Guildpage />} />
      <Route path="/Graphpage/:memberName" element={<Graphpage />} />
      <Route path="/Adminpage" element={<Adminpage />} />
      <Route path="/Login" element={<Loginpage />} />
      <Route path="/SignUp" element={<SignUppage />} />
    </Routes>
  );
};

export default App;