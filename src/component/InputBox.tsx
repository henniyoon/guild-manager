import React, { useState } from 'react';
import '../style/InputBox.css'

const InputBox = () => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputText(e.target.value);
  };

  return (
    <input
      type="text"
      className="content-input"
      placeholder="텍스트를 입력하세요"
      value={inputText}
      onChange={handleInputChange}
    />
  );
};

export default InputBox;