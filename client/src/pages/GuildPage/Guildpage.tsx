import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
// import GuildDataFetcher from "./components/GuildDataFetcher";

interface GuildData {
  id: number;
  master_name: string;
  member_count: number;
  level: number;
  noblesse_skill_level: number;
  guild_mark: string;
  guild_mark_custom: string;
}

const Guildpage: React.FC = () => {
  const { worldName, guildName } = useParams();
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에 GET 요청을 보냅니다.
        const response = await fetch(`/Guild/${worldName}/${guildName}`);

        // 성공적으로 데이터를 가져온 경우
        if (response.ok) {
          const data = await response.json();
          console.log('서버로부터 받은 데이터:', data);
          setGuildData(data);
        } else {
          // 에러 응답인 경우
          console.error('서버에서 에러 응답 받음:', response.status);
        }
      } catch (error) {
        // 네트워크 오류 등의 경우
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    };
    fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
  }, [worldName, guildName]);

  const AdminButtonClick = () => {
    navigate(`/Adminpage`);
  };


  return (
    <div>
      {guildData && (
        <div>
          <div>
            <img src={`data:image/png;base64,${guildData.guild_mark_custom}`} width="34" height="34" />
            <h1>{guildName}</h1>
            <p>Lv.{guildData.level}</p>
          </div>
          <div>
            <p>마스터: {guildData.master_name}</p>
            <p>길드원: {guildData.member_count}명</p>
            <p>노블: {guildData.noblesse_skill_level}</p>
          </div>
        </div>
      )}
      <Button onClick={AdminButtonClick}>Admin</Button>
    </div>
  );
};

export default Guildpage;

