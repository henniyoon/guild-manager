import React, { useEffect, useState } from 'react';
import styles from "../styles/SelectWeek.module.css";
import '../../../styles/Footer.module.css'

interface SelectWeekProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
}

const SelectWeek: React.FC<SelectWeekProps> = ({ selectedDate, onDateChange }) => {
  const [minWeek, setMinWeek] = useState('');
  const [maxWeek, setMaxWeek] = useState('');

  useEffect(() => {
    const today = new Date();
    const past28Days = new Date(today.setDate(today.getDate() - 28));
    const next7Days = new Date(today.setDate(today.getDate() + 35)); // 28일 전에서 다시 35일을 더해줍니다 (7일 후)

    const formatWeek = (date: Date) => {
      const year = date.getFullYear();
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      return `${year}-W${weekNumber < 10 ? `0${weekNumber}` : weekNumber}`;
    };

    setMinWeek(formatWeek(past28Days));
    setMaxWeek(formatWeek(next7Days));
  }, []);

  return (
    <div>
      <input
        placeholder='주를 선택하세요'
        className={styles.weekSelecter}
        type="week"
        id="weekPicker"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={minWeek}
        max={maxWeek}
      />
    </div>
  );
};

export default SelectWeek;
