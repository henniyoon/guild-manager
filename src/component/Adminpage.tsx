import React, { useState } from 'react';
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
  // 테이블 데이터를 상태로 관리
  const [tableData, setTableData] = useState<TableRowData[]>([
    // 여기에 초기 데이터를 넣거나, API 호출을 통해 데이터를 가져올 수 있습니다.
    { id: 1, column1: 'Data1', column2: 'Data2', column3: 'Data3', column4: 'Data4' },
    // 추가 행 데이터...
  ]);

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
