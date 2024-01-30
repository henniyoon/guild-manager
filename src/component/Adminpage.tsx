import React, { useState, useEffect } from 'react';
import '../style/Adminpage.module.css'

interface TableRowData {
  name: string;
  score: number;
  suro: number;
  flag: number;
}

const Adminpage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);

  useEffect(() => {
    fetch('/api/records')
      .then(response => response.json())
      .then(data => {
        console.log('받은 데이터:', data); // 데이터 확인
        setTableData(data); // 받은 데이터를 tableData 상태에 저장
      })
      .catch(error => console.error('데이터를 불러오는 데 실패했습니다:', error));
  }, []);

  return (
    <div>
      <h1>관리자 페이지</h1>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>주간점수</th>
            <th>수로</th>
            <th>플래그</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.score}</td>
              <td>{row.suro}</td>
              <td>{row.flag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpage;