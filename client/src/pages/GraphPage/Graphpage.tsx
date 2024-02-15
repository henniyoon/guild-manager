import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const GraphPage = () => {
    const [chartData, setChartData] = useState({});

    const loadChartData = async () => {
        const response = await axios.get('/api/records'); // API 엔드포인트 경로는 실제 환경에 맞게 조정
        const records = response.data;

        // 데이터 가공
        const labels = records.map((record: { week: any; }) => record.week);
        const data = records.map((record: { weekly_score: any; }) => record.weekly_score);

        setChartData({
            labels,
            datasets: [
                {
                    label: '주간 점수',
                    data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    useEffect(() => {
        loadChartData();
    }, []);

    return (
        <div>
            <h2>유저의 기록을 그래프로 보여주기</h2>
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default GraphPage;
