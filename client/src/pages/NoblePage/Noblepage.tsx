import React, { useState, useEffect } from 'react';
import getCurrentWeek from '../AdminPage/components/getCurrentWeek';

function NoblePage() {
    const [weeks, setWeeks] = useState<string[]>([]);
    const [numOfWeeksToShow, setNumOfWeeksToShow] = useState<number>(4); // 사용자가 원하는 주의 개수, 기본값은 4

    useEffect(() => {
        let weeksToShow: string[] = [getCurrentWeek()]; // 현재 주를 포함합니다.
        const currentDate = new Date();

        for (let i = 1; i < numOfWeeksToShow; i++) { // numOfWeeksToShow 값을 기준으로 반복
            // 이전 주를 계산하기 위해 현재 날짜에서 7일씩 빼줍니다.
            const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            const pastWeek = getCurrentWeekForDate(pastDate);
            weeksToShow.push(pastWeek);
        }

        setWeeks(weeksToShow);
    }, [numOfWeeksToShow]); // numOfWeeksToShow 값이 변경될 때마다 useEffect 훅을 다시 실행

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
            <div>
                <label htmlFor="weekCount">표시할 주의 개수 선택:</label>
                <input
                    id="weekCount"
                    type="number"
                    value={numOfWeeksToShow}
                    onChange={e => setNumOfWeeksToShow(parseInt(e.target.value))}
                    min="1" // 최소 1주
                />
            </div>
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
