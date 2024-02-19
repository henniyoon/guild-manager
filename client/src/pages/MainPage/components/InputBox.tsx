import React from 'react';
import { TextField } from '@mui/material';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const InputBox = ({ value, onChange }: InputBoxProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <TextField
      id="filled-search"
      placeholder='길드를 검색하세요'
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default InputBox;
