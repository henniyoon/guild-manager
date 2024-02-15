import React, { useState, useEffect } from "react";
import styles from "./styles/Adminpage.module.css";
import SelectWeek from "./components/SelectWeek";

interface TableRowData {
  id: number;
  character_id: number;
  character_name: string;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 데이터를 불러오는 함수
  const fetchTableData = () => {
    // selectedDate를 사용하여 서버에 요청 보내기
    const url = `/records?week=${encodeURIComponent(selectedDate)}`;
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");

    fetch(url, {
      method: "GET", // 요청 메소드 설정
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
        "Content-Type": "application/json", // 내용 유형 지정 (필요한 경우)
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("guild+week 조회된 데이터 : ", data);
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
    // 변경된 행만 추출하기 위한 로직
    const modifiedData = editedData.filter((editedRow) => {
      const originalRow = tableData.find((row) => row.id === editedRow.id);
      // 여기서는 간단한 객체 비교를 사용합니다. 더 복잡한 데이터 구조의 경우, 깊은 비교(deep comparison)가 필요할 수 있습니다.
      return JSON.stringify(editedRow) !== JSON.stringify(originalRow);
    });
  
    if (modifiedData.length === 0) {
      alert("변경된 데이터가 없습니다.");
      return;
    }
  
    console.log("서버로 전송될 변경된 데이터:", modifiedData);
    fetch("/updateRecords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedData), // 변경된 데이터만 전송
    })
      .then((response) => response.json())
      .then(() => {
        console.log("데이터 저장 성공");
        // 저장이 성공한 후, 선택된 주에 대한 최신 데이터를 불러오기 위해 다시 요청을 보냅니다.
        const url = `/records?week=${encodeURIComponent(selectedDate)}`;
        const token = localStorage.getItem("token");
        return fetch(url, {
          method: "GET", // 요청 메소드 설정
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        // 서버로부터 받은 최신 데이터로 UI 업데이트
        setTableData(data);
        alert("데이터가 성공적으로 저장되고 업데이트되었습니다.");
      })
      .catch((error) => {
        console.error("데이터 업데이트 실패:", error);
        alert("데이터 업데이트에 실패했습니다.");
      });

    setIsEditMode(false); // 편집 모드 종료
  };

  const handleRowClick = (id: number) => {
    setSelectedRowId(id);
    console.log("선택된 행 : ", id);
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
    console.log(selectedDate);

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

  const handleAddEmptyRowBelowSelected = () => {
    if (selectedRowId === null) {
      alert("추가할 위치를 선택해주세요.");
      return;
    }
    // 선택된 행의 인덱스를 찾습니다.
    const selectedIndex = tableData.findIndex(
      (row) => row.id === selectedRowId
    );
    // 비어있는 행을 생성합니다. 여기서는 character_name을 비워두고, 나머지 값을 0 혹은 적절한 기본값으로 설정할 수 있습니다.
    const emptyRow: TableRowData = {
      id: Math.max(...tableData.map((row) => row.id)) + 1, // 임시 ID 생성, 실제 환경에서는 서버나 다른 메커니즘을 통해 고유한 ID를 생성해야 합니다.
      character_id: 0,
      character_name: "",
      weekly_score: 0,
      suro_score: 0,
      flag_score: 0,
    };

    // 선택된 행 아래에 비어있는 행을 추가합니다.
    const newData = [
      ...tableData.slice(0, selectedIndex + 1),
      emptyRow,
      ...tableData.slice(selectedIndex + 1),
    ];
    setTableData(newData);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      console.log("선택된 파일들:", filesArray);
    }
  };

  // 파일 서버로 전송
  const handleUploadFiles = () => {
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    // 예시 URL, 실제 엔드포인트로 변경해야 함
    fetch("/uploadImages", {
      method: "POST",
      body: formData,
      // 'Content-Type': 'multipart/form-data' 헤더는 설정하지 않습니다.
      // 브라우저가 자동으로 설정하기 때문입니다.
    })
    .then(response => response.json())
    .then(data => {
      console.log("업로드 성공:", data);
      alert("파일 업로드 성공!");
    })
    .catch(error => {
      console.error("업로드 실패:", error);
      alert("파일 업로드 실패.");
    });
  };

  return (
    <div>
      <h1>관리자 페이지</h1>
      <button onClick={testclick}>목록 불러오기</button>
      <button onClick={handleAddEmptyRowBelowSelected}>행 추가</button>
      <SelectWeek selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <button onClick={toggleEditMode}>{isEditMode ? "취소" : "수정"}</button>
      {isEditMode && (
        <>
          <label htmlFor="file-upload" className="custom-file-upload">
            이미지 첨부
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{display: 'none'}}
            accept="image/*" // 이미지 파일만 선택 가능하도록 설정
          />
          <button onClick={handleUploadFiles}>파일 업로드</button>
        </>
      )}
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
                  {/* character_name에 대한 입력 필드. 비어있는 경우 수정 불가능 */}
                  <td>
                    {row.character_name === "" ? (
                      row.character_name
                    ) : (
                      <input
                        title="character_name"
                        type="text"
                        defaultValue={row.character_name}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "character_name",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </td>
                  <td>
                    <input
                      title="weekly_score"
                      type="number"
                      defaultValue={row.weekly_score}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "weekly_score",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      title="suro_score"
                      type="number"
                      defaultValue={row.suro_score}
                      onChange={(e) =>
                        handleInputChange(row.id, "suro_score", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      title="flag_score"
                      type="number"
                      defaultValue={row.flag_score}
                      onChange={(e) =>
                        handleInputChange(row.id, "flag_score", e.target.value)
                      }
                    />
                  </td>
                </>
              ) : (
                // 비편집 모드에서의 행 렌더링
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
