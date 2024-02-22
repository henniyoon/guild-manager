import React from 'react';
import styles from "../styles/SelectWeek.module.css";

interface SelectWeekProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
}

const SelectWeek: React.FC<SelectWeekProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div>
      <input
        placeholder='?'
        className={styles.weekSelecter}
        type="week"
        id="weekPicker"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
};

export default SelectWeek;