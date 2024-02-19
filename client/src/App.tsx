import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Mainpage from './pages/MainPage/Mainpage';
import Guildpage from './pages/GuildPage/Guildpage';
import Graphpage from './pages/GraphPage/Graphpage';
import Adminpage from './pages/AdminPage/Adminpage';
import Loginpage from './pages/LoginPage/Loginpage';
import SignUppage from './pages/SingUpPage/SignUppage';
import Mypage from './pages/MyPage/Mypage';

import { Box, CssBaseline, Typography, Toolbar } from '@mui/material';

const App: React.FC = () => {
  const mainItems = ['Inbox', 'Starred', 'Send email', 'Drafts'];
  const secondaryItems = ['All mail', 'Trash', 'Spam'];

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar mainItems={mainItems} secondaryItems={secondaryItems} />
        
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 5 }}
        >
          <Toolbar />

          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/Guildpage/:worldName/:guildName" element={<Guildpage />} />
            <Route path="/Graphpage/:memberName" element={<Graphpage />} />
            <Route path="/Adminpage" element={<Adminpage />} />
            <Route path="/Login" element={<Loginpage />} />
            <Route path="/SignUp" element={<SignUppage />} />
            <Route path="/Mypage" element={<Mypage />} />
          </Routes>

        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default App;
