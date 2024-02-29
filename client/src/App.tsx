import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Mainpage from "./pages/MainPage/Mainpage";
import Guildpage from "./pages/GuildPage/Guildpage";
import Graphpage from "./pages/GraphPage/Graphpage";
import Adminpage from "./pages/AdminPage/Adminpage";
import Loginpage from "./pages/LoginPage/Loginpage";
import SignUppage from "./pages/SingUpPage/SignUppage";
import Mypage from "./pages/MyPage/Mypage";
import Noblepage from "./pages/NoblePage/Noblepage";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <div className="appContainer">
      <Header />
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route
            path="/Guildpage/:worldName/:guildName"
            element={<Guildpage />}
          />
          <Route path="/Graphpage/:memberName" element={<Graphpage />} />
          <Route
            path="/Adminpage/:worldName/:guildName"
            element={<Adminpage />}
          />
          <Route path="/Login" element={<Loginpage />} />
          <Route path="/SignUp" element={<SignUppage />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Noble" element={<Noblepage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
