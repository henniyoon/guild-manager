import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphPage = () => {
    const { memberName } = useParams();
    
    // 'ChartData' 타입에 맞는 초기 상태 설정
    const [chartData, setChartData] = useState<ChartData<"bar", (number | [number, number] | null)[], string>>({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/Graphpage/${memberName}`);
                const data = response.data;
                const weeks = data.map((item: { week: any; }) => item.week);
                const weeklyScores = data.map((item: { weekly_score: any; }) => item.weekly_score);
                const suroScores = data.map((item: { suro_score: any; }) => item.suro_score);
                const flagScores = data.map((item: { flag_score: any; }) => item.flag_score);

                setChartData({
                    labels: weeks,
                    datasets: [
                        {
                            label: '주간 점수',
                            data: weeklyScores,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        },
                        {
                            label: '수로 점수',
                            data: suroScores,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        },
                        {
                            label: '플래그 점수',
                            data: flagScores,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [memberName]);

    return (
        <div>
            <h2>{memberName}의 기록 차트</h2>
            <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        </div>
    );
};

export default GraphPage;
