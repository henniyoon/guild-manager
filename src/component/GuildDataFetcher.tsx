import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../style/Guildpage.module.css'

interface GuildDataFetcherProps {
  server: string | null;
  input: string | null;
}

interface GuildData {
  oguild_id: string;
}

interface GuildDetails {
  guild_member: string[]  ;
}

const GuildDataFetcher: React.FC<GuildDataFetcherProps> = ({ server, input }) => {
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [guildDetails, setGuildDetails] = useState<GuildDetails | null>(null);
  const navigate = useNavigate();

  // ! API 키는 숨겨야 됨 -> 환경변수나 서버에서 관리하도록 수정
  const API_KEY =
  "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";

  useEffect(() => {
    if (server && input) {
      const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(
        input
      )}&world_name=${encodeURIComponent(server)}`;

      fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => setGuildData(data))
        .catch((error) => console.error("Error fetching guild data:", error));
    }
  }, [server, input]);

  useEffect(() => {
    if (guildData && guildData.oguild_id) {
      // 현재 날짜 객체 생성
      const currentDate = new Date();
      // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
      currentDate.setDate(currentDate.getDate() - 1);
  
      // 날짜를 YYYY-MM-DD 형식으로 포매팅
      const formattedDate = currentDate.toISOString().split('T')[0];
  
      // URL에 포매팅된 날짜 포함
      const guildDetailsUrl = `https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=${guildData.oguild_id}&date=${formattedDate}`;
      
      fetch(guildDetailsUrl, {
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => setGuildDetails(data))
        .catch((error) =>
          console.error("Error fetching guild details:", error)
        );
    }
  }, [guildData]);

  const MemberClick = (memberName: string) => {
    navigate(`/Graphpage?${memberName}`);
  };

  return (
    <div>
      {guildDetails && (
        <ul className={styles.memberUl}>
          {guildDetails?.guild_member.map((member, index) => (
            <li key={index} className={styles.memberLi} onClick={() => MemberClick(member)}>{member}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default GuildDataFetcher;
