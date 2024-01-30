import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mainpage from './component/Mainpage';
import Guildpage from './component/Guildpage';
import Graphpage from './component/Graphpage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/Guildpage" element={<Guildpage />} />
        <Route path="/Graphpage" element={<Graphpage />} />
      </Routes>
    </Router>
  );
};

export default App;