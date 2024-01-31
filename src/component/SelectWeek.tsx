import React from 'react';

interface SelectWeekProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
}

const SelectWeek: React.FC<SelectWeekProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div>
      <label htmlFor="weekPicker">주 선택: </label>
      <input
        type="week"
        id="weekPicker"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
};

export default SelectWeek;