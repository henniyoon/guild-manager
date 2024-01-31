import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import GuildDataFetcher from "./GuildDataFetcher";

const Guildpage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const server = queryParams.get("server");
  const input = queryParams.get("input");
  const navigate = useNavigate();

  const AdminButtonClick = () => {
    navigate(`/Adminpage`);
  };

  return (
    <div>
      <h1>결과 페이지</h1>
      <p>선택된 서버: {server}</p>
      <p>입력된 값: {input}</p>
      <Button onClick={AdminButtonClick}>Admin</Button>
      <GuildDataFetcher server={server} input={input} />
    </div>
  );
};

export default Guildpage;
