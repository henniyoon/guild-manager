import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Mainpage.css'
import SelectServer from './components/SelectServer';
import InputBox from './components/InputBox';
import Button from '../../components/Button';

const Mainpage = () => {
  const navigate = useNavigate();
  const [worldName, setSelectedServer] = useState('스카니아');
  const [guildName, setInputValue] = useState('별빛');

  const handleButtonClick = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 서버에 데이터를 전송하는 fetch 사용
      await fetch(`/GuildPage/${encodeURIComponent(worldName)}/${encodeURIComponent(guildName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 필요에 따라 적절한 Content-Type 설정
        },
        // body에 필요한 데이터를 JSON 형태로 전달
        body: JSON.stringify({
          worldName: encodeURIComponent(worldName),
          guildName: encodeURIComponent(guildName),
        }),
      });

      // 성공적으로 요청이 완료되면 페이지 이동
      navigate(`/Guildpage/${encodeURIComponent(worldName)}/${encodeURIComponent(guildName)}`);
    } catch (error) {
      // 에러 처리
      console.error('Error submitting data:', error);
    }
  };

  return (
    <form onSubmit={handleButtonClick} className="MainPage-Contents">
      <SelectServer value={worldName} onChange={setSelectedServer} />
      <InputBox value={guildName} onChange={setInputValue} />
      <Button type="submit">Enter</Button>
    </form>
  );
};

export default Mainpage;
