import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mainpage from './component/Mainpage';
import Guildpage from './component/Guildpage';
import Graphpage from './component/Graphpage';
import Adminpage from './component/Adminpage'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/Guildpage" element={<Guildpage />} />
        <Route path="/Graphpage" element={<Graphpage />} />
        <Route path="/Adminpage" element={<Adminpage />} />
      </Routes>
    </Router>
  );
};

export default App;