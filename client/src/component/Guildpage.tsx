import React, { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';
import GuildDataFetcher from "./GuildDataFetcher";

const Guildpage: React.FC = () => {
  const { server, guild } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // server와 guild를 사용하여 API 호출 또는 다른 작업 수행
    // 예: fetchData(server, guild);
  }, [server, guild]);

  const AdminButtonClick = () => {
    navigate(`/Adminpage`);
  };

  return (
    <div>
      <h1>{guild}</h1>
      {/* <p>선택된 서버: {server}</p>
      <p>입력된 값: {input}</p> */}
      <Button onClick={AdminButtonClick}>Admin</Button>
      <GuildDataFetcher server={server} guild={guild} />
    </div>
  );
};

export default Guildpage;
