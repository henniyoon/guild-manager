import React, { useState, useEffect } from "react";
import styles from "./styles/Adminpage.module.css";
import SelectWeek from "./components/SelectWeek";
import { useParams } from "react-router-dom";

interface TableRowData {
  id: number;
  character_id: number;
  character_name: string;
  weekly_score: number;
  suro_score: number;
  flag_score: number;
  noble_limit: boolean;
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
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filters, setFilters] = useState({
    weekly_score: { min: "", max: "" },
    suro_score: { min: "", max: "" },
    flag_score: { min: "", max: "" },
  });
  const { worldName, guildName } = useParams();

  // 데이터를 불러오는 함수
  const fetchTableData = () => {
    const url = `/records?week=${encodeURIComponent(selectedDate)}`;
    const token = localStorage.getItem("token");

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 데이터를 character_name 기준으로 오름차순 정렬합니다.
        // localeCompare 대신 기본 비교 연산자를 사용합니다.
        const sortedData = data.sort(
          (a: { character_name: number }, b: { character_name: number }) => {
            if (a.character_name < b.character_name) return -1;
            if (a.character_name > b.character_name) return 1;
            return 0;
          }
        );
        setTableData(sortedData);
        setEditedData(sortedData); // EditedData도 정렬된 데이터로 초기화합니다.
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

  const handleInputChange = (
    id: number,
    field: string,
    value: string | boolean
  ) => {
    // noble_limit 필드에 대한 처리 추가
    const parsedValue =
      field === "character_id" ||
      field === "weekly_score" ||
      field === "suro_score" ||
      field === "flag_score"
        ? parseInt(value as string, 10)
        : field === "noble_limit" // nobel_limit 필드일 경우
        ? value === true || value === "true"
          ? 1
          : 0 // true이면 1, 아니면 0으로 변환
        : value; // 나머지 경우는 그대로 값 유지

    setEditedData((editedData) =>
      editedData.map((row) =>
        row.id === id ? { ...row, [field]: parsedValue } : row
      )
    );
  };

  const handleSaveClick = () => {
    const modifiedData = editedData.filter((editedRow) => {
      const originalRow = tableData.find((row) => row.id === editedRow.id);
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
        // 여기에서 fetchTableData() 호출
        return fetchTableData(); // 데이터 저장 성공 후 최신 데이터 불러오기
      })
      .then(() => {
        alert("데이터가 성공적으로 저장되고 업데이트되었습니다.");
      })
      .catch((error) => {
        console.error("데이터 업데이트 실패:", error);
        alert("데이터 업데이트에 실패했습니다.");
      });

    setIsEditMode(false); // 편집 모드 종료
  };

  const handleRowClick = (id: number) => {
    // 이미 선택된 행인지 확인
    if (selectedRowIds.includes(id)) {
      // 이미 선택된 행이라면 선택 해제
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      // 새로운 행을 선택한 경우, 기존 선택된 행들에 추가
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };
  const handleDeleteSelectedRows = () => {
    if (selectedRowIds.length === 0) {
      alert("삭제할 행을 선택해주세요.");
      return;
    }

    // 선택된 모든 행에 대해 삭제 요청을 순차적으로 보냅니다.
    // Promise.all을 사용하여 모든 삭제 요청이 완료된 후 처리를 계속합니다.
    Promise.all(
      selectedRowIds.map((selectedRowId) =>
        fetch(`/deleteRecord/${selectedRowId}`, {
          method: "DELETE",
        }).then((response) => response.json())
      )
    )
      .then((results) => {
        console.log("삭제 결과:", results);
        setSelectedRowIds([]); // 삭제 후 선택된 행 ID 목록 초기화
        fetchTableData(); // 삭제 후 테이블 데이터 새로고침
      })
      .catch((error) => {
        console.error("데이터 삭제 실패:", error);
        alert("데이터 삭제에 실패했습니다.");
      });
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

    // test 엔드포인트로 POST 요청을 보내 데이터 업데이트를 수행합니다.
    fetch("/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedDate: selectedDate }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("업데이트 성공:", data);
        // 업데이트가 성공적으로 완료된 후, 최신 데이터를 불러오기 위해
        // /records?week=${encodeURIComponent(selectedDate)} 엔드포인트로 GET 요청을 보냅니다.
        return fetchTableData(); // 기존에 정의된 데이터 불러오는 함수를 재사용
      })
      .catch((error) => {
        console.error("업데이트 실패:", error);
        alert("업데이트에 실패했습니다.");
      });
  };
  // ? 길드원 채워넣는 로직 끝

  const handleAddEmptyRowBelowSelected = () => {
    if (selectedRowIds.length === 0) {
      alert("추가할 위치를 선택해주세요.");
      return;
    }

    // 선택된 행의 인덱스를 모두 찾습니다.
    const selectedIndexes = selectedRowIds
      .map((id) => tableData.findIndex((row) => row.id === id))
      .filter((index) => index !== -1) // 유효한 인덱스만 필터링
      .sort((a, b) => a - b); // 인덱스 기준으로 정렬

    let newData = [...tableData];
    let addedCount = 0;

    selectedIndexes.forEach((index) => {
      const newIndex = index + addedCount + 1; // 이미 추가된 행 수를 고려하여 인덱스 조정
      const emptyRow: TableRowData = {
        id: Math.max(...newData.map((row) => row.id)) + 1 + addedCount, // 고유한 ID 생성
        character_id: 0,
        character_name: "",
        weekly_score: 0,
        suro_score: 0,
        flag_score: 0,
        noble_limit: false,
      };

      newData = [
        ...newData.slice(0, newIndex),
        emptyRow,
        ...newData.slice(newIndex),
      ];

      addedCount++; // 추가된 행의 수를 업데이트
    });

    setTableData(newData);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).slice(0, 15); // 최대 15개 파일 선택
      setSelectedFiles(filesArray);
      console.log("선택된 파일들:", filesArray);

      // 파일 선택 후 자동으로 업로드 실행
      handleUploadFiles(filesArray);
    }
  };

  // 파일 서버로 전송
  const handleUploadFiles = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    fetch("/uploadImages", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("업로드 성공:", data);
        alert("파일 업로드 성공!");
        // OCR 결과를 테이블 데이터에 반영하는 함수 호출
        updateTableDataWithOcrResults(data);
      })
      .catch((error) => {
        console.error("업로드 실패:", error);
        alert("파일 업로드 실패.");
      });
  };

  // OCR 결과를 테이블 데이터에 반영하고, 서버로 전송하는 함수
  const updateTableDataWithOcrResults = (ocrData: {
    flag_score_Area?: never[] | undefined;
    suro_score_Area?: never[] | undefined;
    weekly_score_Area?: never[] | undefined;
  }) => {
    const {
      flag_score_Area = [],
      suro_score_Area = [],
      weekly_score_Area = [],
    } = ocrData;

    // 새로운 테이블 데이터를 생성합니다.
    const newTableData = tableData.map((row, index) => ({
      ...row,
      weekly_score: weekly_score_Area[index] ?? row.weekly_score,
      suro_score: suro_score_Area[index] ?? row.suro_score,
      flag_score: flag_score_Area[index] ?? row.flag_score,
    }));

    // 상태를 업데이트합니다.
    setTableData(newTableData);

    // 업데이트된 데이터를 서버로 전송합니다.
    sendAllDataToServer(newTableData);
  };

  // 모든 데이터를 서버로 전송하는 함수
  const sendAllDataToServer = (
    updatedData: {
      weekly_score: any;
      suro_score: any;
      flag_score: any;
      id: number;
      character_id: number;
      character_name: string;
      noble_limit: boolean;
    }[]
  ) => {
    fetch("/updateRecords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("데이터 전체 업데이트 성공:", data);
        alert("모든 데이터가 성공적으로 서버에 업데이트되었습니다.");
      })
      .catch((error) => {
        console.error("데이터 전체 업데이트 실패:", error);
        alert("데이터 전체 업데이트에 실패했습니다.");
      });
  };

  const getFilteredRowIds = () => {
    return tableData
      .filter((row) => {
        const minWeeklyScore = filters.weekly_score.min
          ? parseInt(filters.weekly_score.min, 10)
          : -Infinity;
        const maxWeeklyScore = filters.weekly_score.max
          ? parseInt(filters.weekly_score.max, 10)
          : Infinity;
        const minSuroScore = filters.suro_score.min
          ? parseInt(filters.suro_score.min, 10)
          : -Infinity;
        const maxSuroScore = filters.suro_score.max
          ? parseInt(filters.suro_score.max, 10)
          : Infinity;
        const minFlagScore = filters.flag_score.min
          ? parseInt(filters.flag_score.min, 10)
          : -Infinity;
        const maxFlagScore = filters.flag_score.max
          ? parseInt(filters.flag_score.max, 10)
          : Infinity;

        // 여기까지가 기존 코드에서 사용된 필터링 조건입니다.
        return (
          (!minWeeklyScore || row.weekly_score >= minWeeklyScore) &&
          (!maxWeeklyScore || row.weekly_score <= maxWeeklyScore) &&
          (!minSuroScore || row.suro_score >= minSuroScore) &&
          (!maxSuroScore || row.suro_score <= maxSuroScore) &&
          (!minFlagScore || row.flag_score >= minFlagScore) &&
          (!maxFlagScore || row.flag_score <= maxFlagScore)
        );
      })
      .map((row) => row.id); // 필터링된 행의 id 값을 추출합니다.
  };

  // 모두 선택 또는 선택 해제 버튼 클릭 핸들러
  const handleSelectOrDeselectAll = () => {
    // 현재 선택된 행이 하나라도 있는지 확인합니다.
    if (selectedRowIds.length > 0) {
      // 선택된 행이 있다면 모든 선택을 해제합니다.
      setSelectedRowIds([]);
    } else {
      // 선택된 행이 없다면 필터링된 모든 행을 선택합니다.
      const filteredRowIds = getFilteredRowIds();
      setSelectedRowIds(filteredRowIds);
    }
  };

  // 버튼 텍스트 동적으로 설정
  const selectDeselectButtonText =
    selectedRowIds.length > 0 ? "선택 해제" : "모두 선택";

  return (
    <div>
      <h1>관리자 페이지</h1>
      <SelectWeek selectedDate={selectedDate} onDateChange={setSelectedDate} />
      {/* 필터링 조건을 입력받는 UI 구성 */}
      <div>
        <label>주간점수 이상:</label>
        <input
          type="text"
          placeholder="주간점수 최소값"
          value={filters.weekly_score.min}
          onChange={(e) =>
            setFilters({
              ...filters,
              weekly_score: { ...filters.weekly_score, min: e.target.value },
            })
          }
        />
        <label>주간점수 이하:</label>
        <input
          type="text"
          placeholder="주간점수 최대값"
          value={filters.weekly_score.max}
          onChange={(e) =>
            setFilters({
              ...filters,
              weekly_score: { ...filters.weekly_score, max: e.target.value },
            })
          }
        />
        {/* 수로(suro_score) 필터링 입력 필드 */}
        <div>
          <label>수로 점수 이상:</label>
          <input
            type="number"
            placeholder="수로 최소값"
            value={filters.suro_score.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                suro_score: { ...filters.suro_score, min: e.target.value },
              })
            }
          />
          <label>수로 점수 이하:</label>
          <input
            type="number"
            placeholder="수로 최대값"
            value={filters.suro_score.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                suro_score: { ...filters.suro_score, max: e.target.value },
              })
            }
          />
        </div>

        {/* 플래그(flag_score) 필터링 입력 필드 */}
        <div>
          <label>플래그 점수 이상:</label>
          <input
            type="number"
            placeholder="플래그 최소값"
            value={filters.flag_score.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                flag_score: { ...filters.flag_score, min: e.target.value },
              })
            }
          />
          <label>플래그 점수 이하:</label>
          <input
            type="number"
            placeholder="플래그 최대값"
            value={filters.flag_score.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                flag_score: { ...filters.flag_score, max: e.target.value },
              })
            }
          />
        </div>
      </div>
      <button onClick={testclick}>목록 불러오기</button>
      <button onClick={handleSelectOrDeselectAll}>
        {selectDeselectButtonText}
      </button>
      <button onClick={handleAddEmptyRowBelowSelected}>행 추가</button>
      <button onClick={handleDeleteSelectedRows}>선택된 행 삭제</button>
      <>
        <label htmlFor="file-upload" className="custom-file-upload">
          이미지 첨부
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*" // 이미지 파일만 선택 가능하도록 설정
        />
      </>
      <button onClick={toggleEditMode}>{isEditMode ? "취소" : "수정"}</button>
      <button onClick={handleSaveClick}>저장</button>

      <table>
        <thead>
          <tr>
            <th onClick={() => sortData("character_name")}>닉네임</th>
            <th onClick={() => sortData("weekly_score")}>주간점수</th>
            <th onClick={() => sortData("suro_score")}>수로</th>
            <th onClick={() => sortData("flag_score")}>플래그</th>
            <th onClick={() => sortData("noble_limit")}>노블제한</th>
          </tr>
        </thead>
        <tbody>
          {tableData
            .filter((row) => {
              const minWeeklyScore = filters.weekly_score.min
                ? parseInt(filters.weekly_score.min, 10)
                : -Infinity;
              const maxWeeklyScore = filters.weekly_score.max
                ? parseInt(filters.weekly_score.max, 10)
                : Infinity;
              const minSuroScore = filters.suro_score.min
                ? parseInt(filters.suro_score.min, 10)
                : -Infinity;
              const maxSuroScore = filters.suro_score.max
                ? parseInt(filters.suro_score.max, 10)
                : Infinity;
              const minFlagScore = filters.flag_score.min
                ? parseInt(filters.flag_score.min, 10)
                : -Infinity;
              const maxFlagScore = filters.flag_score.max
                ? parseInt(filters.flag_score.max, 10)
                : Infinity;

              return (
                (!minWeeklyScore || row.weekly_score >= minWeeklyScore) &&
                (!maxWeeklyScore || row.weekly_score <= maxWeeklyScore) &&
                (!minSuroScore || row.suro_score >= minSuroScore) &&
                (!maxSuroScore || row.suro_score <= maxSuroScore) &&
                (!minFlagScore || row.flag_score >= minFlagScore) &&
                (!maxFlagScore || row.flag_score <= maxFlagScore)
              );
            })
            .map((row, index) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                className={`${styles.rowClickable} ${
                  selectedRowIds.includes(row.id) ? styles.rowSelected : ""
                } ${index % 17 === 16 ? styles.row_17th : ""}`}
              >
                {isEditMode ? (
                  <>
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
                          handleInputChange(
                            row.id,
                            "suro_score",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        title="flag_score"
                        type="number"
                        defaultValue={row.flag_score}
                        onChange={(e) =>
                          handleInputChange(
                            row.id,
                            "flag_score",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <input
                      title="noble_limit"
                      type="checkbox"
                      defaultChecked={row.noble_limit}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "noble_limit",
                          e.target.checked.toString()
                        )
                      }
                    />
                  </>
                ) : (
                  // 비편집 모드에서의 행 렌더링
                  <>
                    <td>{row.character_name}</td>
                    <td>{row.weekly_score}</td>
                    <td>{row.suro_score}</td>
                    <td>{row.flag_score}</td>
                    <td>{row.noble_limit ? "🔴" : "🟢"}</td>
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
