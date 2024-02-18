import React from 'react';
import '../styles/InputBox.css'

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const InputBox = ({ value, onChange }: InputBoxProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="search"
      className="form-control border-0 bg-transparent text-white"
      placeholder="길드명을 입력하세요"
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default InputBox;