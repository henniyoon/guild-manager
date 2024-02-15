import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend, 
  ChartData 
} from 'chart.js';

// Line 차트에 필요한 요소들을 등록합니다.
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend
);

const Chart = () => {
    const { memberName } = useParams();
    
    // 각 점수에 대한 ChartData 상태를 별도로 관리합니다.
    const [weeklyScoreData, setWeeklyScoreData] = useState<ChartData<"line", number[], string>>({
        labels: [],
        datasets: []
    });
    const [suroScoreData, setSuroScoreData] = useState<ChartData<"line", number[], string>>({
        labels: [],
        datasets: []
    });
    const [flagScoreData, setFlagScoreData] = useState<ChartData<"line", number[], string>>({
        labels: [],
        datasets: []
    });
    const options = {
        scales: {
            x: {
                grid: {
                    display: false, // x축 격자선을 숨깁니다.
                },
            },
            y: {
                grid: {
                    display: false, // y축 격자선을 숨깁니다.
                },
                beginAtZero: true,
            },
        },
        responsive: true,
    };

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 최상단으로 이동
        const fetchData = async () => {
            try {
                const response = await axios.get(`/Graphpage/${memberName}`);
                const data = response.data;
                const weeks = data.map((item: { week: any; }) => item.week).reverse();
                const weeklyScores = data.map((item: { weekly_score: any; }) => item.weekly_score).reverse();
                const suroScores = data.map((item: { suro_score: any; }) => item.suro_score).reverse();
                const flagScores = data.map((item: { flag_score: any; }) => item.flag_score).reverse();

                // 주간 점수 데이터 설정
                setWeeklyScoreData({
                    labels: weeks,
                    datasets: [{
                        label: '주간 점수',
                        data: weeklyScores,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        fill: false,
                    }]
                });

                // 수로 점수 데이터 설정
                setSuroScoreData({
                    labels: weeks,
                    datasets: [{
                        label: '수로 점수',
                        data: suroScores,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        fill: false,
                    }]
                });

                // 플래그 점수 데이터 설정
                setFlagScoreData({
                    labels: weeks,
                    datasets: [{
                        label: '플래그 점수',
                        data: flagScores,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        fill: false,
                    }]
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
            <div>
                <h3>수로 점수</h3>
                <Line data={suroScoreData} options={options}/>
            </div>
            <div>
                <h3>플래그 점수</h3>
                <Line data={flagScoreData} options={options}/>
            </div>
            <div>
                <h3>주간 점수</h3>
                <Line data={weeklyScoreData} options={options}/>
            </div>
        </div>
    );
};

export default Chart;
