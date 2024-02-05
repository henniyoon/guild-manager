import React, { useState, useEffect } from "react";
import "../style/Adminpage.module.css";
import SelectWeek from '../component/SelectWeek';
interface TableRowData {
  id: number;
  name: string;
  weekly_score: number;
  suro_score: number;
  flag_score: number;
}

function getCurrentWeek() {
  const currentDate = new Date();
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  // .getTime()을 사용하여 Date 객체를 밀리초 단위의 숫자로 변환
  const pastDaysOfYear = (currentDate.getTime() - firstDayOfYear.getTime()) / 86400000;
  // 첫째 날이 일요일이 아니라면 +1을 하지 않고, 대신 첫째 날의 getDay() 값을 빼줍니다.
  const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
  return `${currentDate.getFullYear()}-W${currentWeek.toString().padStart(2, '0')}`;
}
const Adminpage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<TableRowData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentWeek());

  // 데이터를 불러오는 함수
  const fetchTableData = () => {
    // selectedDate를 사용하여 서버에 요청 보내기
    const url = `/api/records?week=${encodeURIComponent(selectedDate)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        setEditedData(data);
      })
      .catch((error) =>
        console.error("데이터를 불러오는 데 실패했습니다:", error)
      );
  };

  useEffect(() => {
    fetchTableData();
  }, [selectedDate]);

  // 편집 모드 전환 함수
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    const parsedValue =
      field === "weekly_score" ||
      field === "suro_score" ||
      field === "flag_score"
        ? parseInt(value, 10)
        : value;
    setEditedData((editedData) =>
      editedData.map((row) =>
        row.id === id ? { ...row, [field]: parsedValue } : row
      )
    );
  };

  const handleSaveClick = () => {
    console.log("전송할 데이터:", editedData); // 전송할 데이터 로깅
    // 서버에 데이터 전송
    fetch("/api/updateRecords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData), // editedData는 배열이어야 합니다
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("저장 결과:", data);
        fetchTableData();
      })
      .catch((error) => console.error("데이터 저장 실패:", error));

    setIsEditMode(false); // 편집 모드 종료
  };

  return (
    <div>
      <h1>관리자 페이지</h1>
      <SelectWeek selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <button onClick={toggleEditMode}>{isEditMode ? "취소" : "수정"}</button>
      <button onClick={handleSaveClick}>저장</button>
      <table>
        <thead>{/* ... */}</thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              {isEditMode ? (
                <>
                  <input
                    title="insert-name"
                    type="text"
                    defaultValue={row.name}
                    onChange={(e) =>
                      handleInputChange(row.id, "name", e.target.value)
                    }
                  />
                  <input
                    title="insert-weekly_score"
                    type="number"
                    defaultValue={row.weekly_score}
                    onChange={(e) =>
                      handleInputChange(row.id, "weekly_score", e.target.value)
                    }
                  />
                  <input
                    title="insert-suro_score"
                    type="number"
                    defaultValue={row.suro_score}
                    onChange={(e) =>
                      handleInputChange(row.id, "suro_score", e.target.value)
                    }
                  />
                  <input
                    title="insert-flag_score"
                    type="number"
                    defaultValue={row.flag_score}
                    onChange={(e) =>
                      handleInputChange(row.id, "flag_score", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <td>{row.name}</td>
                  <td>{row.weekly_score}</td>
                  <td>{row.suro_score}</td>
                  <td>{row.flag_score}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpage;
