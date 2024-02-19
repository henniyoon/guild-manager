import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SelectServerProps {
  value: string;
  onChange: (value: string) => void;
}

const SelectServer = ({ value, onChange }: SelectServerProps) => {
  const options = ['스카니아', '루나', '엘리시움', '리부트2'];

  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      displayEmpty
      // inputProps={{ 'aria-label': 'Without label' }}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectServer;
