import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/Guildpage.module.css'
import Button from '../../components/Button';

interface GuildData {
  id: number;
  master_name: string;
  member_count: number;
  level: number;
  noblesse_skill_level: number;
  guild_mark: string;
  guild_mark_custom: string;
}

interface CharacterData {
  id: number;
  guild_id: number;
  name: string;
  class: string;
  level: number;
  image: string;
}

const Guildpage: React.FC = () => {
  const { worldName, guildName } = useParams();
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData[] | null>(null);
  const navigate = useNavigate();

  // 길드 정보 불러오기 서버에 GET 요청
  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        const response = await fetch(`/Guild/${worldName}/${guildName}`);

        if (response.ok) {
          const data = await response.json();
          console.log('서버로부터 받은 데이터:', data);
          setGuildData(data);
        } else {
          console.error('서버에서 에러 응답 받음:', response.status);
        }

      } catch (error) {
        // 네트워크 오류 등의 경우
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    };
    fetchGuildData();
  }, [worldName, guildName]);

  // 길드원 정보 불러오기 서버에 GET 요청
  useEffect(() => {
    const fetchGuildMembers = async () => {
      try {
        const response = await fetch(`/GuildMembers/${worldName}/${guildName}`);

        if (response.ok) {
          const data = await response.json();
          console.log('서버로부터 받은 데이터:', data);
          setCharacterData(data);
        } else {
          console.error('서버에서 에러 응답 받음:', response.status);
        }

      } catch (error) {
        // 네트워크 오류 등의 경우
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    };
    fetchGuildMembers();
  }, [worldName, guildName]);

  const AdminButtonClick = () => {
    navigate(`/Adminpage`);
  };

  const handleMemberClick = (character: CharacterData) => {
    // 캐릭터 카드를 클릭했을 때 해당 경로로 이동
    navigate(`/Graphpage/${character.name}`);
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

      {characterData && characterData.length > 0 && (
        <div className={styles.memberUl}>
          {characterData.map((character, index) => (
            <div
              key={index}
              className={styles.memberLi}
              onClick={() => handleMemberClick(character)}
            >
              <div className={`${styles.padding15} ${styles.card}`}>
                <>
                  <img
                    src={character.image}
                    alt="Character Image"
                    className={styles.characterImage}
                  />
                  <h4>{character.name}</h4>
                  <p>Lv.{character.level}</p>
                  <p>{character.class}</p>
                </>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guildpage;