import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/Guildpage.module.css'
import Button from '../../components/Button';
import { Container, Card, Row, Col } from 'react-bootstrap';

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
    <Container>
      {/* <img src="/guildpage.png"></img> */}
      {guildData && (
        <Row className="m-3">
          <Col xs={12} md={3}>
            <Row className="align-items-center">
              <Col xs="auto" className="p-0">
                <img src={`data:image/png;base64,${guildData.guild_mark_custom}`} width="34" height="34" alt="Guild Mark" />
              </Col>
              <Col xs="auto" className="p-0">
                <h1 className="fw-bold">{guildName}</h1>
              </Col>
              <Col xs="auto">
                <p>Lv.{guildData.level}</p>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={7}>
            <p>마스터: {guildData.master_name}</p>
            <p>길드원: {guildData.member_count}명</p>
            <p>노블: {guildData.noblesse_skill_level}</p>
          </Col>
          <Col xs={12} md={2} className="text-end">
            <Button className="mt-1 mb-1 contents" onClick={AdminButtonClick}>Admin</Button>
          </Col>
        </Row>
      )}

      {characterData && characterData.length > 0 && (
        <Row xs={1} md={5} className="mt-2 g-4 justify-content-center">
          {characterData.map((character, index) => (
            // <Col  className="mb-3">
            <Card key={index} className="m-2 p-2 border-dark text-center d-flex flex-column h-100" onClick={() => handleMemberClick(character)} style={{ width: '100%', maxWidth: '12rem' }}>
              {/* <div className=""> */}
              <Card.Img src={character.image} alt="Character Image" className="card-img-top p-3 pb-0" style={{ objectFit: 'cover' }} />
              <Card.Body className="p-2 flex-grow-1">
                {character.name} <br />
                Lv.{character.level} <br />
                {character.class}
              </Card.Body>
              {/* </div> */}
            </Card>
            // </Col>
          ))}
        </Row>
      )}
    </Container>
  );

};

export default Guildpage;