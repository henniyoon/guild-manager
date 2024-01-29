import React, { useState } from 'react';
import '../style/SelectServer.css'

const SelectServer = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const options = ['옵션 1', '옵션 2', '옵션 3']; // 옵션 목록

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(e.target.value);
  };

  return (
    <select title="SelectServer" className="content-select" value={selectedOption} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );
};
export default SelectServer;