import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mainpage from './component/Mainpage';
import Guildpage from './component/Guildpage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/result" element={<Guildpage />} />
      </Routes>
    </Router>
  );
};

export default App;