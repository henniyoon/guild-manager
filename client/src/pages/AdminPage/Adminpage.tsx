import React, { useState, useEffect } from "react";
import styles from "./styles/Adminpage.module.css";
import SelectWeek from "./components/SelectWeek";
import { jwtDecode } from "jwt-decode";

interface TableRowData {
  id: number;
  character_id: number;
  character_name: string;
  name: string;
  weekly_score: number;
  suro_score: number;
  flag_score: number;
}

interface SortConfig {
  key: keyof TableRowData | null;
  direction: "ascending" | "descending";
}

function getCurrentWeek() {
  const currentDate = new Date();
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  // .getTime()을 사용하여 Date 객체를 밀리초 단위의 숫자로 변환
  const pastDaysOfYear =
    (currentDate.getTime() - firstDayOfYear.getTime()) / 86400000;
  // 첫째 날이 일요일이 아니라면 +1을 하지 않고, 대신 첫째 날의 getDay() 값을 빼줍니다.
  const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
  return `${currentDate.getFullYear()}-W${currentWeek
    .toString()
    .padStart(2, "0")}`;
}
const Adminpage: React.FC = () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<TableRowData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentWeek());
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  // 데이터를 불러오는 함수
  const fetchTableData = () => {
    // selectedDate를 사용하여 서버에 요청 보내기
    const url = `/records?week=${encodeURIComponent(selectedDate)}`;
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
      field === "character_id" ||
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
    fetch("/updateRecords", {
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

  const handleRowClick = (id: number) => {
    setSelectedRowId(id);
    console.log("선택된 행 : ", id);
  };

  // 새로운 행을 추가하기 위한 상태 정의
  const [newRowData, setNewRowData] = useState({
    character_name: "",
    weekly_score: "",
    suro_score: "",
    flag_score: "",
  });

  // 새로운 행 데이터 입력을 처리하는 핸들러
  const handleNewRowDataChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewRowData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 새로운 행을 추가하는 로직
  const handleAddNewRow = async () => {
    // 서버에 새로운 행 데이터를 전송하는 로직을 구현
    // 예: fetch API를 사용하여 서버에 POST 요청
    const response = await fetch("/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newRowData,
        noble_limit: 0, // noble_limit는 항상 0으로 설정
        week: selectedDate, // SelectWeek에서 선택된 주
      }),
    });

    if (response.ok) {
      // 데이터 추가 후 테이블 데이터 새로고침
      fetchTableData();
      // 입력 필드 초기화
      setNewRowData({
        character_name: "",
        weekly_score: "",
        suro_score: "",
        flag_score: "",
      });
    } else {
      console.error("데이터 추가 실패");
    }
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId === null) {
      alert("삭제할 행을 선택해주세요.");
      return;
    }
    // 서버에 선택된 행 삭제 요청을 보내는 로직 구현
    fetch(`/deleteRecord/${selectedRowId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("삭제 결과:", data);
        setSelectedRowId(null); // 삭제 후 선택된 행 ID 초기화
        fetchTableData(); // 삭제 후 테이블 데이터 새로고침
      })
      .catch((error) => console.error("데이터 삭제 실패:", error));
  };

  const sortData = (key: keyof TableRowData) => {
    setSortConfig((currentSortConfig) => {
      const newDirection =
        currentSortConfig.key === key &&
        currentSortConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      const sortedData = [...tableData].sort((a, b) => {
        // 아래 조건에서 a[key] 및 b[key]의 타입이 'any'가 될 수 있으므로, 타입 단언을 사용하여 오류를 회피합니다.
        if (a[key] < b[key]) return newDirection === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return newDirection === "ascending" ? 1 : -1;
        return 0;
      });
      setTableData(sortedData);
      return { key, direction: newDirection };
    });
  };

  // ? 길드원 채워넣는 로직
  const testclick = () => {
    const token = localStorage.token;
    console.log(selectedDate)
    
    fetch("/test", {
      method: "POST", // 또는 'POST', 'PUT', 'DELETE' 등 요청 메소드를 선택합니다.
      headers: {
        "Content-Type": "application/json",
        // Bearer 토큰 형식을 사용하여 Authorization 헤더에 토큰을 포함시킵니다.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedDate: selectedDate }),
    })
      .then((response) => {
        // 서버로부터 받은 응답을 JSON 형식으로 파싱합니다.
        return response.json();
      })
      .then((data) => {
        // 서버로부터 받은 데이터를 콘솔에 출력합니다.
        console.log(data);
        // 받은 데이터를 원하는 방식으로 활용할 수 있습니다.
        // 예를 들어 UI에 표시하거나 다른 작업을 수행할 수 있습니다.
      })
      .catch((error) => {
        // 오류가 발생한 경우 콘솔에 오류 메시지를 출력합니다.
        console.error("Error:", error);
        // 사용자에게 오류를 알리거나 다른 처리를 수행할 수 있습니다.
      });
  };

  // ? 길드원 채워넣는 로직 끝
  return (
    <div>
      <h1>관리자 페이지</h1>
      <button onClick={testclick}>test</button>
      <input
        name="character_name"
        value={newRowData.character_name}
        onChange={handleNewRowDataChange}
        placeholder="Character Name"
      />
      <input
        name="weekly_score"
        value={newRowData.weekly_score}
        onChange={handleNewRowDataChange}
        placeholder="Weekly Score"
      />
      <input
        name="suro_score"
        value={newRowData.suro_score}
        onChange={handleNewRowDataChange}
        placeholder="Suro Score"
      />
      <input
        name="flag_score"
        value={newRowData.flag_score}
        onChange={handleNewRowDataChange}
        placeholder="Flag Score"
      />
      <button onClick={handleAddNewRow}>추가</button>
      <SelectWeek selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <button onClick={toggleEditMode}>{isEditMode ? "취소" : "수정"}</button>
      <button onClick={handleSaveClick}>저장</button>
      <button onClick={handleDeleteSelectedRow}>선택된 행 삭제</button>

      <table>
        <thead>
          <th onClick={() => sortData("character_name")}>
            닉네임{" "}
            {sortConfig.key === "character_name"
              ? sortConfig.direction === "ascending"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th onClick={() => sortData("weekly_score")}>주간점수</th>
          <th onClick={() => sortData("suro_score")}>수로</th>
          <th onClick={() => sortData("flag_score")}>플래그</th>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              className={`${styles.rowClickable} ${
                selectedRowId === row.id ? styles.rowSelected : ""
              }`}
            >
              {isEditMode ? (
                <>
                  <input
                    title="insert-name"
                    type="text"
                    defaultValue={row.character_name}
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
                  <td>{row.character_name}</td>
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
