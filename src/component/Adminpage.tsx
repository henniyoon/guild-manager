import React, { useState, useEffect } from 'react';
import '../style/Adminpage.module.css'
interface TableRowData {
  id: number;
  name: string;
  score: number;
  suro: number;
  flag: number;
}

const Adminpage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 편집 모드 상태
  const [editedData, setEditedData] = useState<TableRowData[]>([]);

  useEffect(() => {
    fetch('/api/records')
      .then(response => response.json())
      .then(data => {
        setTableData(data); // 원본 데이터 상태 설정
        setEditedData(data); // 편집될 데이터 상태도 초기화
      })
      .catch(error => console.error('데이터를 불러오는 데 실패했습니다:', error));
  }, []);

  // 편집 모드 전환 함수
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

const handleInputChange = (id: number, field: string, value: string) => {
  setEditedData(editedData => editedData.map(row =>
    row.id === id ? { ...row, [field]: value } : row
  ));
};
  
  const handleSaveClick = () => {
    console.log('전송할 데이터:', editedData); // 전송할 데이터 로깅  
    // 서버에 데이터 전송
    fetch('/api/updateRecords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData), // editedData는 배열이어야 합니다
    })
    .then(response => response.json())
    .then(data => {
      console.log('저장 결과:', data);
      // 저장 후 필요한 로직 처리
    })
    .catch(error => console.error('데이터 저장 실패:', error));
  
    setIsEditMode(false); // 편집 모드 종료
  };

  return (
    <div>
      <h1>관리자 페이지</h1>
      <button onClick={toggleEditMode}>{isEditMode ? '취소' : '수정'}</button>
      <button onClick={handleSaveClick}>저장</button>
      <table>
        <thead>
          {/* ... */}
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
{
  isEditMode ? (
    <>
      <input type="text" defaultValue={row.name} onChange={(e) => handleInputChange(row.id, 'name', e.target.value)} />
      <input type="text" defaultValue={row.score} onChange={(e) => handleInputChange(row.id, 'score', e.target.value)} />
      <input type="text" defaultValue={row.suro} onChange={(e) => handleInputChange(row.id, 'suro', e.target.value)} />
      <input type="text" defaultValue={row.flag} onChange={(e) => handleInputChange(row.id, 'flag', e.target.value)} />
    </>
  ) : (
    <>
      <td>{row.name}</td>
      <td>{row.score}</td>
      <td>{row.suro}</td>
      <td>{row.flag}</td>
    </>
  )
}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpage;
