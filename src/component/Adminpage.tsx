import React, { useState, useEffect } from 'react';
import '../style/Adminpage.module.css'

// 예시 데이터 타입
interface TableRowData {
  id: number;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
}

const Adminpage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/records');
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>관리자 페이지</h1>
      <table>
        <thead>
          <tr>
            <th>열 1</th>
            <th>열 2</th>
            <th>열 3</th>
            <th>열 4</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
              <td>{row.column4}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpage;
