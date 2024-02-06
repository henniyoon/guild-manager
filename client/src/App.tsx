import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from '../src/component/Mainpage';
import Guildpage from '../src/component/Guildpage';
import Graphpage from '../src/component/Graphpage';
import Adminpage from '../src/component/Adminpage'
// import Loginpage from '../src/component/Loginpage';
import SignUppage from '../src/component/SignUppage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/Guildpage/:server/:guild" element={<Guildpage />} />
      <Route path="/Graphpage/:memberName" element={<Graphpage />} />
      <Route path="/Adminpage" element={<Adminpage />} />
      {/* <Route path="/Login" element={<Loginpage />} /> */}
      <Route path="/SignUp" element={<SignUppage />} />
    </Routes>
  );
};

export default App;