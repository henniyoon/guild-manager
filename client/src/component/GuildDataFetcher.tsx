import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../style/Guildpage.module.css'

interface GuildDataFetcherProps {
  server: string | undefined;
  guild: string | undefined;
}

interface GuildData {
  oguild_id: string;
}

interface GuildDetails {
  guild_member: string[]  ;
}

const GuildDataFetcher: React.FC<GuildDataFetcherProps> = ({ server, guild }) => {
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [guildDetails, setGuildDetails] = useState<GuildDetails | null>(null);
  const navigate = useNavigate();

  // ! API 키는 숨겨야 됨 -> 환경변수나 서버에서 관리하도록 수정
  const API_KEY =
  process.env.REACT_APP_API_KEY;

  // 서버, 길드명으로 oguild_id 조회
  useEffect(() => {
    if (server && guild) {
      const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(
        guild
      )}&world_name=${encodeURIComponent(server)}`;

      fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY || '',
        },
      })
      .then((response) => response.json())  // API 응답이 성공하면 JSON 형식으로 데이터 변환
      .then((data) => setGuildData(data))   // JSON 형식으로 변환한 데이터를 상태 guildData에 저장
      .catch((error) => 
        console.error("Error fetching guild data:", error)
      );
    }
  }, [server, guild]);

  // oguild_id로 나머지 길드 정보 조회
  useEffect(() => {
    if (guildData && guildData.oguild_id) {
      const currentDate = new Date();                 // 현재 날짜 객체 생성
      currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
      const formattedDate = currentDate.toISOString().split('T')[0];  // 날짜를 YYYY-MM-DD 형식으로 포매팅
      // URL에 포매팅된 날짜 포함
      const guildDetailsUrl = `https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=${guildData.oguild_id}&date=${formattedDate}`;
      
      fetch(guildDetailsUrl, {
        headers: {
          "x-nxopen-api-key": API_KEY || '',
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
    navigate(`/Graphpage/${memberName}`);
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
