import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Mainpage.css'
import SelectServer from './SelectServer';
import InputBox from './InputBox';
import Button from './Button';

const Mainpage = () => {
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState('스카니아');
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = (e: FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 이벤트를 방지
    navigate(`/Guildpage?server=${encodeURIComponent(selectedServer)}&input=${encodeURIComponent(inputValue)}`);
  };

  return (
    <form onSubmit={handleButtonClick} className="MainPage-Contents">
      <SelectServer value={selectedServer} onChange={setSelectedServer} />
      <InputBox value={inputValue} onChange={setInputValue} />
      <Button type="submit">Enter</Button>
    </form>
  );
};

export default Mainpage;
