import React from 'react';
import '../styles/SelectServer.css';

interface SelectServerProps {
  value: string;
  onChange: (value: string) => void;
}

const SelectServer = ({ value, onChange }: SelectServerProps) => {
  const options = ['스카니아', '루나', '엘리시움','리부트2'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select title="SelectServer" className="content-select" value={value} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );
};

export default SelectServer;
