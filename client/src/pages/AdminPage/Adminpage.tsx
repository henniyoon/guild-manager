import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/Adminpage.module.css";
import dayjs, { Dayjs } from 'dayjs';
import SelectWeek from "./components/SelectWeek";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { Grid, Box, Typography, TextField, Select, MenuItem, Button, IconButton, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import HomePageInstructions from "./components/AdminpageManual";
import getCurrentWeek from "./components/getCurrentWeek";
import WeekPicker from "./components/WeekPicker";

interface UserInfo {
  username: string;
  email: string;
  guildName: string;
  worldName: string;
  role: string;
}

interface GuildData {
  id: number;
  master_name: string;
  member_count: number;
  level: number;
  noblesse_skill_level: number;
  guild_mark_custom: string;
}

interface TableRowData {
  id: number;
  character_id: number;
  character_name: string;
  main_character_name: string;
  weekly_score: number;
  suro_score: number;
  flag_score: number;
  noble_limit: boolean;
}

interface SortConfig {
  key: keyof TableRowData | null;
  direction: "ascending" | "descending";
}
interface Filter {
  value: number;
  operator: string;
}

interface Filters {
  character_name: string;
  suro_score: Filter;
  flag_score: Filter;
  logical_operator: string;
}

// 초기 상태 정의
const initialFilters: Filters = {
  character_name: "",
  suro_score: { value: 0, operator: "min" },
  flag_score: { value: 0, operator: "min" },
  logical_operator: "and",
};

const Adminpage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<TableRowData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  // selectedDate를 yyyy-WWW 형식으로 포맷팅하는 함수
  const getFormattedDate = () => {
    const weekNumber = selectedDate?.day() === 0
      ? selectedDate.subtract(1, 'day').week()
      : selectedDate?.week();

    return selectedDate
      ? `${selectedDate.year()}-W${weekNumber?.toString().padStart(2, '0')}`
      : '';
  };
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { worldName, guildName } = useParams();
  const [dataLength, setDataLength] = useState<number>(0);
  const [serverDataLength, setServerDataLength] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeklyScoreTotal, setWeeklyScoreTotal] = useState(0);
  const [suroScoreTotal, setSuroScoreTotal] = useState(0);
  const [flagScoreTotal, setFlagScoreTotal] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDisplay = () => {
    setIsHidden(!isHidden);
  };

  // 토큰이 변경될 때마다 localStorage에 반영
  useEffect(() => {
    localStorage.setItem("token", token || "");
  }, [token]);

  // tableData가 변경될 때마다 useEffect 실행
  useEffect(() => {
    // 각 점수의 합을 계산하여 상태 업데이트
    const newWeeklyScoreTotal = tableData.reduce((total, rowData) => total + rowData.weekly_score, 0);
    const newSuroScoreTotal = tableData.reduce((total, rowData) => total + rowData.suro_score, 0);
    const newFlagScoreTotal = tableData.reduce((total, rowData) => total + rowData.flag_score, 0);

    setWeeklyScoreTotal(newWeeklyScoreTotal);
    setSuroScoreTotal(newSuroScoreTotal);
    setFlagScoreTotal(newFlagScoreTotal);
  }, [tableData]);  // tableData가 변경될 때만 useEffect가 실행

  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        const response = await fetch(`/Guild/${worldName}/${guildName}`);

        if (response.ok) {
          const data = await response.json();
          console.log('서버로부터 받은 데이터:', data);
          setGuildData(data);
        } else {
          console.error('서버에서 에러 응답 받음:', response.status);
        }
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    };

    fetchGuildData();
  }, [worldName, guildName]);

  // 데이터를 불러오는 함수
  const fetchTableData = async () => {
    try {
      const currentToken = localStorage.getItem("token");

      // 첫 번째 API 호출
      const response = await fetch("/myInfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setUserInfo(data);

      // 두 번째 API 호출
      const url = `/records?week=${getFormattedDate()}`;


      const secondResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Info": encodeURIComponent(JSON.stringify(data)),
        },
      });

      if (!secondResponse.ok) {
        throw new Error(`HTTP error! Status: ${secondResponse.status}`);
      }

      const secondData = await secondResponse.json();
      console.log("secondData: ", secondData);

      const sortedData = secondData.sort(
        (a: { character_name: number }, b: { character_name: number }) => {
          if (a.character_name < b.character_name) return -1;
          if (a.character_name > b.character_name) return 1;
          return 0;
        }
      );

      setTableData(sortedData);
      setEditedData(sortedData);
    } catch (error) {
      console.error("데이터를 불러오는 데 실패했습니다:", error);
      alert("해당 길드의 관리자가 아닙니다.");
    }
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
    // test 엔드포인트로 POST 요청을 보내 데이터 업데이트를 수행합니다.
    fetch("/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Info": encodeURIComponent(JSON.stringify(userInfo)),
      },
      body: JSON.stringify({ selectedDate: getFormattedDate() }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("업데이트 성공:", data);
        setDataLength(data.length); // 서버로부터 받은 데이터의 길이를 저장
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
        main_character_name: "",
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

  // 컴포넌트 내부에서
  const fileInputRef = useRef<HTMLInputElement>(null); // TypeScript 타입 지정

  const handleFileUploadClick = () => {
    // fileInputRef.current가 존재하는지 확인
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 안전하게 click() 메서드 호출
    }
  };

  // 파일 서버로 전송
  const handleUploadFiles = (files: File[]) => {
    setIsLoading(true); // 로딩 시작
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
        // OCR 결과를 테이블 데이터에 반영하는 함수 호출
        setServerDataLength(data.weekly_score_Area.length);
        updateTableDataWithOcrResults(data);
      })
      .catch((error) => {
        console.error("업로드 실패:", error);
        alert("파일 업로드 실패.");
      })
      .finally(() => setIsLoading(false)); // 로딩 종료
  };

  // 문자열을 숫자로 변환하는 함수
  const convertToNumber = (value: string | undefined): number | undefined => {
    if (!value) return undefined;

    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
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
      weekly_score: convertToNumber(weekly_score_Area[index]) ?? row.weekly_score,
      suro_score: convertToNumber(suro_score_Area[index]) ?? row.suro_score,
      flag_score: convertToNumber(flag_score_Area[index]) ?? row.flag_score,
    }));

    // 상태를 업데이트합니다.
    setTableData(newTableData);

    // 업데이트된 데이터를 서버로 전송합니다.
    sendAllDataToServer(newTableData);
  };

  // 모든 데이터를 서버로 전송하는 함수
  const sendAllDataToServer = (
    updatedData: {
      weekly_score: number;
      suro_score: number;
      flag_score: number;
      id: number;
      character_id: number;
      character_name: string;
      main_character_name: string;
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

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const getFilteredRowIds = () => {
    return tableData.filter((row) => {
      const characterName = filters.character_name.toLowerCase(); // 대소문자 구분 없애기 위해 소문자로 변경
      const suroScore = filters.suro_score.value;
      const flagScore = filters.flag_score.value;

      const characterNameCondition =
        characterName === "" ||
        row.character_name.toLowerCase().includes(characterName) ||
        (row.main_character_name && row.main_character_name.toLowerCase().includes(characterName));

      const suroCondition =
        suroScore === undefined ||
        (filters.suro_score.operator === "max"
          ? row.suro_score <= suroScore
          : row.suro_score >= suroScore);
      const flagCondition =
        flagScore === undefined ||
        (filters.flag_score.operator === "max"
          ? row.flag_score <= flagScore
          : row.flag_score >= flagScore);

      if (filters.logical_operator === "and") {
        return (suroCondition && flagCondition) && characterNameCondition;
      } else {
        return (suroCondition || flagCondition) && characterNameCondition;
      }
    });
  };

  // 모두 선택 또는 선택 해제 버튼 클릭 핸들러
  const handleSelectOrDeselectAll = () => {
    // 현재 선택된 행이 하나라도 있는지 확인합니다.
    if (selectedRowIds.length > 0) {
      // 선택된 행이 있다면 모든 선택을 해제합니다.
      setSelectedRowIds([]);
    } else {
      // 선택된 행이 없다면 필터링된 모든 행을 선택합니다.
      const filteredRowIds = getFilteredRowIds().map((row) => row.id);
      setSelectedRowIds(filteredRowIds);
    }
  };

  // 버튼 텍스트 동적으로 설정
  const selectDeselectButtonText =
    selectedRowIds.length > 0 ? "선택 해제" : "모두 선택";

  const handleNobleLimitUpdate = () => {
    if (selectedRowIds.length === 0) {
      alert("업데이트할 행을 선택해주세요.");
      return;
    }

    fetch("/updateNobleLimit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedRowIds }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("noble_limit 값이 성공적으로 업데이트되었습니다.");
          fetchTableData(); // 데이터를 다시 불러옵니다.
        } else {
          alert("업데이트에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("업데이트 중 에러 발생:", error);
        alert("업데이트 중 에러가 발생했습니다.");
      });
  };

  return (
    <div>
      {guildData && (
        <Grid container spacing={0} alignItems="center">
          <div>
            <Grid container spacing={0} alignItems="center" style={{ marginBottom: 10 }}>
              <div>
                <div>
                  <Typography variant="body1" style={{ fontSize: '14px', marginLeft: 20 }}>{worldName}</Typography>
                </div>
                <Grid container spacing={0} alignItems="center" style={{ marginBottom: 10 }}>
                  <Grid item>
                    <img src={`data:image/png;base64,${guildData.guild_mark_custom}`} width="34" height="34" alt="Guild Mark" />
                  </Grid>
                  <Grid item style={{ marginLeft: 5 }}>
                    <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center' }}>{guildName}</Typography>
                  </Grid>
                  <Grid item style={{ marginLeft: 10 }}>
                    <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      관리자 페이지
                      <IconButton onClick={() => setIsModalOpen(true)} title="info">
                        <InfoIcon />
                      </IconButton>
                    </Typography>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                      <HomePageInstructions />
                    </Modal>
                  </Grid>
                  <Grid item>
                    <WeekPicker
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>

            {/* 오른쪽 그리드 with WeekPicker */}
            <Grid item xs={12} md={12} container style={{ marginBottom: 10, alignItems: 'center' }}>
              {/* 마스터, 길드원, 노블 정보 */}
              <Grid item xs={4} md={4}>
                <Box borderRight={1} borderColor='gray.300'>
                  <Typography variant="body1">마스터: {guildData.master_name}</Typography>
                  <Typography variant="body1">길드원: {guildData.member_count}명</Typography>
                  <Typography variant="body1">노블: {guildData.noblesse_skill_level}</Typography>
                </Box>
              </Grid>
              {/* 주간 미션 포인트, 지하 수로 점수, 플래그 레이스 점수 정보 */}
              <Grid item xs={7} md={7} style={{ marginLeft: '30px' }}>
                <Typography variant="body1">주간 미션: {weeklyScoreTotal.toLocaleString()}점</Typography>
                <Typography variant="body1">지하 수로: {suroScoreTotal.toLocaleString()}점</Typography>
                <Typography variant="body1">플래그 레이스: {flagScoreTotal.toLocaleString()}점</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      )}

      {/* 필터링 조건을 입력받는 UI 구성 */}
      <div style={{ display: "flex", marginTop: "30px", justifyContent: "center" }}>
        <div>
          <TextField
            label="닉네임"
            variant="outlined"
            style={{ marginRight: "5px" }}
            size="small"
            value={filters.character_name}
            onChange={(e) =>
              setFilters({
                ...filters,
                character_name: e.target.value
              })
            }
          />
          <TextField
            label="수로 점수"
            variant="outlined"
            style={{ marginRight: "5px" }}
            size="small"
            value={filters.suro_score.value}
            onChange={(e) =>
              setFilters({
                ...filters,
                suro_score: {
                  ...filters.suro_score,
                  value: parseInt(e.target.value),
                },
              })
            }
          />
          <Select
            style={{ marginRight: "5px" }}
            size="small"
            value={filters.suro_score.operator}
            onChange={(e) =>
              setFilters({
                ...filters,
                suro_score: { ...filters.suro_score, operator: e.target.value },
              })
            }
          >
            <MenuItem value="min">이상</MenuItem>
            <MenuItem value="max">이하</MenuItem>
          </Select>
        </div>

        <div>
          <Select
            style={{ marginRight: "5px", width: "110px" }}
            size="small"
            value={filters.logical_operator}
            onChange={(e) =>
              setFilters({
                ...filters,
                logical_operator: e.target.value,
              })
            }
          >
            <MenuItem value="and">그리고</MenuItem>
            <MenuItem value="or">또는</MenuItem>
          </Select>
        </div>

        <div>
          <TextField
            style={{ marginRight: "5px" }}
            size="small"
            label="플래그 점수"
            variant="outlined"
            value={filters.flag_score.value}
            onChange={(e) =>
              setFilters({
                ...filters,
                flag_score: {
                  ...filters.flag_score,
                  value: parseInt(e.target.value),
                },
              })
            }
          />
          <Select
            style={{ marginRight: "20px" }}
            size="small"
            value={filters.flag_score.operator}
            onChange={(e) =>
              setFilters({
                ...filters,
                flag_score: { ...filters.flag_score, operator: e.target.value },
              })
            }
          >
            <MenuItem value="min">이상</MenuItem>
            <MenuItem value="max">이하</MenuItem>
          </Select>
        </div>
        <Button variant="contained" size="small" onClick={handleReset}>
          초기화
        </Button>
      </div>
      {
  isLoading && (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </div>
  )
}

      <div
        className={styles.tableInfoContainer}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <p>스크린샷 추출 데이터 수 : {serverDataLength}</p>
        <div>
          <p>행 개수 : {tableData.length}</p>
          <p>선택된 행 개수: {selectedRowIds.length}</p>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.buttonStyle} onClick={testclick}>
          길드원 불러오기
        </button>
        <>
          <button
            type="button"
            onClick={handleFileUploadClick}
            className={styles.buttonStyle}
          >
            이미지 첨부
          </button>
          <input
            title="file-upload"
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            multiple
            onChange={handleFileSelect}
            accept="image/*"
            ref={fileInputRef} // React Ref 사용
          />
        </>
        <button className={styles.buttonStyle} onClick={toggleDisplay}>
          {isHidden ? '본캐릭명 보이기' : '본캐릭명 숨기기'}
        </button>
        <button
          className={styles.buttonStyle}
          onClick={handleSelectOrDeselectAll}
        >
          {selectDeselectButtonText}
        </button>
        <button
          className={styles.buttonStyle}
          onClick={handleAddEmptyRowBelowSelected}
        >
          행 추가
        </button>
        <button
          className={styles.buttonStyle}
          onClick={handleDeleteSelectedRows}
        >
          선택된 행 삭제
        </button>
        <button className={styles.buttonStyle} onClick={handleNobleLimitUpdate}>
          선택된 행 노블제한
        </button>
        <button className={styles.buttonStyle} onClick={toggleEditMode}>
          {isEditMode ? "취소" : "수정"}
        </button>
        <button className={styles.buttonStyle} onClick={handleSaveClick}>
          저장
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              className={styles.th1}
              onClick={() => sortData("character_name")}
            >
              닉네임
            </th>
            <th
              className={`${styles.th1} ${isHidden ? styles.hidden : ''}`}
              onClick={() => sortData("main_character_name")}
            >
              본캐릭명
            </th>
            <th className={styles.th2} onClick={() => sortData("weekly_score")}>
              주간점수
            </th>
            <th className={styles.th3} onClick={() => sortData("suro_score")}>
              수로
            </th>
            <th className={styles.th4} onClick={() => sortData("flag_score")}>
              플래그
            </th>
            <th className={styles.th5} onClick={() => sortData("noble_limit")}>
              노블제한
            </th>
          </tr>
        </thead>
        <tbody>
          {getFilteredRowIds().map((row, index) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              className={`${styles.rowClickable} ${selectedRowIds.includes(row.id) ? styles.rowSelected : ""
                } ${index % 17 === 16 ? styles.row_17th : ""}`}
            >
              {isEditMode ? (
                <>
                  <td className={styles.td1}>
                    {row.character_name}
                  </td>
                  <td className={`${styles.th1} ${isHidden ? styles.hidden : ''}`}>
                    {row.main_character_name}
                  </td>
                  <td className={styles.td2}>
                    <input
                      title="weekly_score"
                      className={styles.editInput}
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
                  <td className={styles.td3}>
                    <input
                      title="suro_score"
                      className={styles.editInput}
                      type="number"
                      defaultValue={row.suro_score}
                      onChange={(e) =>
                        handleInputChange(row.id, "suro_score", e.target.value)
                      }
                    />
                  </td>
                  <td className={styles.td4}>
                    <input
                      title="flag_score"
                      className={styles.editInput}
                      type="number"
                      defaultValue={row.flag_score}
                      onChange={(e) =>
                        handleInputChange(row.id, "flag_score", e.target.value)
                      }
                    />
                  </td>
                  <td className={styles.td5}>
                    <input
                      title="noble_limit"
                      className={styles.customCheckbox}
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
                  </td>
                </>
              ) : (
                // 비편집 모드에서의 행 렌더링
                <>
                  <td className={styles.td1}>{row.character_name}</td>
                  <td className={`${styles.th1} ${isHidden ? styles.hidden : ''}`}>{row.main_character_name}</td>
                  <td className={styles.td2}>{row.weekly_score}</td>
                  <td className={styles.td3}>{row.suro_score.toLocaleString()}</td>
                  <td className={styles.td4}>{row.flag_score}</td>
                  <td className={styles.td5}>
                    {row.noble_limit ? "🔴" : "🟢"}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
};

export default Adminpage;
