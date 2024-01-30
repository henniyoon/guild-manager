import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Mainpage.css'
import SelectServer from './SelectServer';
import InputBox from './InputBox';
import Button from './Button';

const Mainpage = () => {
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState('스카니아');
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    navigate(`/Guildpage?server=${encodeURIComponent(selectedServer)}&input=${encodeURIComponent(inputValue)}`);
  };

  return (
    <div className="MainPage-Contents">
      <SelectServer value={selectedServer} onChange={setSelectedServer} />
      <InputBox value={inputValue} onChange={setInputValue} />
      <Button onClick={handleButtonClick}>Enter</Button>
    </div>
  );
};

export default Mainpage;
