import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from '../style/Guildpage.module.css'
import internal from "stream";

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

interface CharacterData {
  ocid: string;
}

interface ChacterDetails {
  character_level: number;
  character_class: string;
}

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const GUILD_ID_ENDPOINT = "/guild/id"
const GUILD_BASIC_ENDPOINT ="/guild/basic";
const CHARACTER_BASIC_ENDPOINT = "/character/baisc";

const GuildDataFetcher: React.FC<GuildDataFetcherProps> = ({ server, guild }) => {
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [guildDetails, setGuildDetails] = useState<GuildDetails | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [characterDetails, setCharacterDetails] = useState<ChacterDetails | null>(null);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_API_KEY;

  // 서버, 길드명으로 oguild_id(해당 길드 고유 코드) 조회 
  useEffect(() => {
    if (server && guild) {
      const url = `${API_BASE_URL}${GUILD_ID_ENDPOINT}?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(server)}`;

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

  // oguild_id로 길드 정보 조회
  useEffect(() => {
    if (guildData && guildData.oguild_id) {
      const currentDate = new Date();                 // 현재 날짜 객체 생성
      currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
      const formattedDate = currentDate.toISOString().split('T')[0];  // 날짜를 YYYY-MM-DD 형식으로 포매팅
      // URL에 포매팅된 날짜 포함
      const url = `${API_BASE_URL}${GUILD_BASIC_ENDPOINT}?oguild_id=${guildData.oguild_id}&date=${formattedDate}`;
      
      fetch(url, {
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

  // 길드원 이름으로 길드원 ocid 조회
  useEffect(() => {
    if(guildDetails && guildDetails.guild_member.length > 0) {
      const url = `${API_BASE_URL}/id?character_name=${encodeURIComponent(guildDetails.guild_member[0])}`;

      fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY || '',
        },
      })
      .then((response) => response.json())
      .then((data) => setCharacterData(data))
      .catch((error) =>
        console.error("Error fetching character data:", error)
      );
    }
  }, [guildDetails?.guild_member[0]]);

  // ocid로 길드원 정보 조회
  useEffect(() => {
    if(characterData && characterData.ocid) {
      const currentDate = new Date();                 // 현재 날짜 객체 생성
      currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
      const formattedDate = currentDate.toISOString().split('T')[0];  // 날짜를 YYYY-MM-DD 형식으로 포매팅
      const url = `${API_BASE_URL}${CHARACTER_BASIC_ENDPOINT}?ocid=${encodeURIComponent(characterData.ocid)}&date=${formattedDate}`
    
      fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY || '',
        },
      })
      .then((response) => response.json())
      .then((data) => setCharacterDetails(data))
      .catch((error) =>
        console.error("Error fetching character details:", error)
      );
    }
  }, [characterData]);

  const MemberClick = (memberName: string) => {
    navigate(`/Graphpage/${memberName}`);
  };

  return (
  //   <div>
  //     {guildDetails && (
  //       <ul className={styles.memberUl}>
  //         {guildDetails?.guild_member.map((member, index) => (
  //           <li key={0} className={styles.memberLi} onClick={() => MemberClick(member)}>{member}</li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
  <div>
    {guildDetails && guildDetails.guild_member.length > 0 && (
      <ul className={styles.memberUl}>
        <li
          key={0} // 또는 어떤 유니크한 값 사용
          className={styles.memberLi}
          onClick={() => MemberClick(guildDetails.guild_member[0])}
        >
          {guildDetails.guild_member[0]}
          {characterData && (
            <p>ocid: {characterData.ocid}</p>
          )}
        </li>
      </ul>
    )}
  </div>
);
};
export default GuildDataFetcher;
