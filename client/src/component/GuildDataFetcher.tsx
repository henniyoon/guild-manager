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
  guild_member: string[];
}

interface CharacterData {
  ocid: string;
}

interface CharacterDetails {
  character_name: string;
  character_level: number;
  character_class: string;
  character_image: string;
}

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const GUILD_ID_ENDPOINT = "/guild/id"
const GUILD_BASIC_ENDPOINT = "/guild/basic";
const CHARACTER_BASIC_ENDPOINT = "/character/basic";

const GuildDataFetcher: React.FC<GuildDataFetcherProps> = ({ server, guild }) => {
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [guildDetails, setGuildDetails] = useState<GuildDetails | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData[] | null>(null);
  const [characterDetails, setCharacterDetails] = useState<CharacterDetails[] | null>(null);
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
  }, [server, guild, API_KEY]);

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
  }, [guildData, API_KEY]);

  // 길드원 이름으로 길드원 ocid 조회
  useEffect(() => {
    if (guildDetails && guildDetails.guild_member.length > 0) {
      const memberNames = guildDetails.guild_member;

      Promise.all(
        memberNames.map((memberName) => {
          const url = `${API_BASE_URL}/id?character_name=${encodeURIComponent(memberName)}`;

          return fetch(url, {
            headers: {
              "x-nxopen-api-key": API_KEY || '',
            },
          })
            .then((response) => response.json());
        })
      )
        .then((dataList) => setCharacterData(dataList))
        .catch((error) =>
          console.error("Error fetching character data:", error)
        );
    }
  }, [guildDetails?.guild_member, API_KEY]);


  // ocid로 길드원 정보 조회
  useEffect(() => {
    if (characterData && characterData.length > 0) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const formattedDate = currentDate.toISOString().split('T')[0];

      Promise.all(
        characterData.map((character) => {
          const url = `${API_BASE_URL}${CHARACTER_BASIC_ENDPOINT}?ocid=${encodeURIComponent(character.ocid)}&date=${formattedDate}`;

          return fetch(url, {
            headers: {
              "x-nxopen-api-key": API_KEY || '',
            },
          })
            .then((response) => response.json());
        })
      )
        .then((detailsList) => setCharacterDetails(detailsList))
        .catch((error) =>
          console.error("Error fetching character details:", error)
        );
    }
  }, [characterData, API_KEY]);

  const handleMemberClick = (memberName: string) => {
    navigate(`/Graphpage/${memberName}`);
  };

  return (
    <div>
      {guildDetails && guildDetails.guild_member.length > 0 && (
        <div className={styles.memberUl}>
          {guildDetails.guild_member.map((member, index) => (
            <div
              key={index}
              className={styles.memberLi}
              onClick={() => handleMemberClick(member)}
            >
              <div className={`${styles.padding15} ${styles.card}`}>
                <h4>{member}</h4>
                {characterDetails && characterDetails[index] && (
                  <>
                    <img
                      src={characterDetails[index].character_image}
                      alt="Character Image"
                      className={styles.characterImage}
                    />
                    {/* <h4>{characterDetails[index].character_name}</h4> */}
                    <p>Lv.{characterDetails[index].character_level}</p>
                    <p>{characterDetails[index].character_class}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default GuildDataFetcher;
