import React, { useState, useEffect } from 'react';
import getCurrentWeek from '../AdminPage/components/getCurrentWeek';

function NoblePage() {
    const [weeks, setWeeks] = useState<string[]>([]);
    const [numOfWeeksToShow, setNumOfWeeksToShow] = useState<number>(4); // 사용자가 원하는 주의 개수, 기본값은 4
    // 추가할 서버 응답 상태
    const [serverResponse, setServerResponse] = useState(null);

    useEffect(() => {
        let weeksToShow: string[] = [getCurrentWeek()]; // 현재 주를 포함합니다.
        const currentDate = new Date();

        for (let i = 1; i < numOfWeeksToShow; i++) {
            const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            const pastWeek = getCurrentWeekForDate(pastDate);
            weeksToShow.push(pastWeek);
        }

        setWeeks(weeksToShow);
        
        // 서버로부터 데이터 요청하는 부분
        const worldId = 1; // 예시로 사용할 world_id
        const name = "별빛"; // 예시로 사용할 길드 이름
        const week = getCurrentWeek(); // 현재 주를 계산하는 함수

        fetch(`/nobleCheck?world_id=${worldId}&name=${name}&week=${week}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setServerResponse(data); // 받아온 데이터를 상태에 저장
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, [numOfWeeksToShow]); // numOfWeeksToShow 값이 변경될 때마다 useEffect 훅을 다시 실행

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
                    min="1"
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
                    {/* 서버로부터 받아온 데이터를 렌더링할 위치 */}
                </tbody>
            </table>
            {/* 서버 응답 확인용 */}
            <div>
                <h3>서버 응답:</h3>
                <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
            </div>
        </div>
    );
}

export default NoblePage;
