import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import styles from "../styles/Chart.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

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
  const [weeklyScoreData, setWeeklyScoreData] = useState<
    ChartData<"line", number[], string>
  >({
    labels: [],
    datasets: [],
  });
  const [suroScoreData, setSuroScoreData] = useState<
    ChartData<"line", number[], string>
  >({
    labels: [],
    datasets: [],
  });
  const [flagScoreData, setFlagScoreData] = useState<
    ChartData<"line", number[], string>
  >({
    labels: [],
    datasets: [],
  });

  // 각 그래프의 표시 여부를 관리하는 useState 훅을 추가합니다.
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null);

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

        // 데이터를 week 기준으로 오름차순 정렬
        const sortedData = data.sort(
          (a: { week: string }, b: { week: string }) => {
            const weekA = a.week.split("-W");
            const weekB = b.week.split("-W");
            const yearA = parseInt(weekA[0], 10);
            const yearB = parseInt(weekB[0], 10);
            const weekNumA = parseInt(weekA[1], 10);
            const weekNumB = parseInt(weekB[1], 10);

            if (yearA !== yearB) {
              return yearA - yearB;
            } else {
              return weekNumA - weekNumB;
            }
          }
        );
        const weeks = sortedData.map((item: { week: any }) => item.week);
        const weeklyScores = sortedData.map(
          (item: { weekly_score: any }) => item.weekly_score
        );
        const suroScores = sortedData.map(
          (item: { suro_score: any }) => item.suro_score
        );
        const flagScores = sortedData.map(
          (item: { flag_score: any }) => item.flag_score
        );

        // 주간 점수 데이터 설정
        setWeeklyScoreData({
          labels: weeks,
          datasets: [
            {
              label: "주간 점수",
              data: weeklyScores,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              fill: false,
            },
          ],
        });

        // 수로 점수 데이터 설정
        setSuroScoreData({
          labels: weeks,
          datasets: [
            {
              label: "수로 점수",
              data: suroScores,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              fill: false,
            },
          ],
        });

        // 플래그 점수 데이터 설정
        setFlagScoreData({
          labels: weeks,
          datasets: [
            {
              label: "플래그 점수",
              data: flagScores,
              borderColor: "rgba(255, 206, 86, 1)",
              backgroundColor: "rgba(255, 206, 86, 0.5)",
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [memberName]);

  // 라디오 버튼을 클릭할 때 선택된 그래프를 변경합니다.
  const handleGraphChange = (graphName: string) => {
    setSelectedGraph(graphName);
  };

  return (
    <div className={styles.chartContainer}>
      <h2>{memberName}의 기록 차트</h2>
      {/* 라디오 버튼 그룹 */}
      <div className={styles.toggleButtons}>
        <div className={styles.toggleButton}>
          <input
            type="radio"
            title="weeklyScore"
            name="graph"
            id="weeklyScore"
            checked={selectedGraph === "주간 점수"}
            onChange={() => handleGraphChange("주간 점수")}
          />
          <label htmlFor="weeklyScore" className={styles.slider}></label>
          <span className={styles.toggleButtonLabel}>주간 점수</span>
        </div>
        <div className={styles.toggleButton}>
          <input
            type="radio"
            title="suroScore"
            name="graph"
            id="suroScore"
            checked={selectedGraph === "수로 점수"}
            onChange={() => handleGraphChange("수로 점수")}
          />
          <label htmlFor="suroScore" className={styles.slider}></label>
          <span className={styles.toggleButtonLabel}>수로</span>
        </div>
        <div className={styles.toggleButton}>
          <input
            type="radio"
            title="flagScore"
            name="graph"
            id="flagScore"
            checked={selectedGraph === "플래그 점수"}
            onChange={() => handleGraphChange("플래그 점수")}
          />
          <label htmlFor="flagScore" className={styles.slider}></label>
          <span className={styles.toggleButtonLabel}>플래그</span>
        </div>
      </div>
      {/* 선택된 그래프만 표시 */}
      {selectedGraph === "주간 점수" && (
        <div className={styles.graph}>
          <h3>주간 점수</h3>
          <Line data={weeklyScoreData} options={options} />
        </div>
      )}
      {selectedGraph === "수로 점수" && (
        <div className={styles.graph}>
          <h3>수로</h3>
          <Line data={suroScoreData} options={options} />
        </div>
      )}
      {selectedGraph === "플래그 점수" && (
        <div className={styles.graph}>
          <h3>플래그</h3>
          <Line data={flagScoreData} options={options} />
        </div>
      )}
    </div>
  );
  
};

export default Chart;
