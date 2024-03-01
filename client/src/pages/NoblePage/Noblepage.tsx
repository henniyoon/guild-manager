import React, { useState, useEffect } from 'react';
import getCurrentWeek from '../AdminPage/components/getCurrentWeek';

function NoblePage() {
    const [weeks, setWeeks] = useState<string[]>([]);
  
    useEffect(() => {
      let weeksToShow: string[] = [getCurrentWeek()]; // 현재 주를 포함합니다.
      const currentDate = new Date();
  
      for (let i = 1; i <= 3; i++) {
        // 이전 주를 계산하기 위해 현재 날짜에서 7일씩 빼줍니다.
        const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        const pastWeek = getCurrentWeekForDate(pastDate);
        weeksToShow.push(pastWeek);
      }
  
      setWeeks(weeksToShow);
    }, []);
  
    // 특정 날짜를 기준으로 주를 계산하는 함수
    function getCurrentWeekForDate(date: Date): string {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
      return `${date.getFullYear()}-W${currentWeek.toString().padStart(2, "0")}`;
    }
  
    return (
      <div>
        <h2>Noble Page</h2>
        <table>
          <thead>
            <tr>
              {weeks.map((week, index) => (
                <th key={index}>{week}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 데이터 렌더링 위치 */}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default NoblePage;