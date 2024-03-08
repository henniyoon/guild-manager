import React, { useState, useEffect } from 'react';
import getCurrentWeek from '../AdminPage/components/getCurrentWeek';

function NoblePage() {
    const [weeks, setWeeks] = useState<string[]>([]);
    const [numOfWeeksToShow, setNumOfWeeksToShow] = useState<number>(4);
    const [serverResponse, setServerResponse] = useState(null);

    // 주 계산 로직을 별도 함수로 분리
    const calculateWeeksToShow = (numOfWeeks: number): string[] => {
        const weeksToShow: string[] = [];
        const currentDate = new Date();
    
        for (let i = 0; i < numOfWeeks; i++) {
            // 매번 원래 currentDate로부터 계산하여 각 주의 시작일을 찾습니다.
            const weekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (7 * i));
            weeksToShow.push(getCurrentWeekForDate(weekStartDate));
        }
    
        return weeksToShow;
    };
    useEffect(() => {
        const weeksToShow = calculateWeeksToShow(numOfWeeksToShow);
        setWeeks(weeksToShow);

        const worldId = 1;
        const name = "별빛";
        // weeks 배열을 쿼리 스트링으로 변환
        const weeksQueryString = weeksToShow.map(week => `weeks=${week}`).join('&');

        fetch(`/nobleCheck?world_id=${worldId}&name=${name}&${weeksQueryString}`)
            .then(response => response.json())
            .then(data => {
                setServerResponse(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        // 의존성 배열에는 numOfWeeksToShow만 포함시킵니다.
    }, [numOfWeeksToShow]);

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
            <div>
                <h3>서버 응답:</h3>
                <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
            </div>
        </div>
    );
}

export default NoblePage;
