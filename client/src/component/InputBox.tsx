import React from 'react';
import '../style/InputBox.css';

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
      type="text"
      className="content-input"
      placeholder="텍스트를 입력하세요"
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default InputBox;