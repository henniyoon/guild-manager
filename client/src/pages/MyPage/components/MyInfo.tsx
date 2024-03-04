import React, { useEffect, useState } from "react";
import { Link, Button, Box, TextField, Typography, Modal, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

interface UserInfo {
    username: string;
    email: string;
    guildName: string;
    worldName: string;
    role: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const MyInfo: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [id, setId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [worldName, setWorldName] = useState('');
    const [guildName, setGuildName] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // 토큰이 변경될 때마다 localStorage에 반영
    useEffect(() => {
        localStorage.setItem("token", token || ""); // 또는 null 대신에 기본값으로 빈 문자열을 사용할 수 있습니다.
    }, [token]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentToken = localStorage.getItem("token");

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
            } catch (error) {
                console.error("데이터를 불러오는 데 실패했습니다:", error);
            }
        };

        fetchUserInfo();
    }, [token]);

    const setRoleMaster = async () => {
        fetch("/role/master", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey, guildName, worldName }),
        })
            .then((response) => response.text())
            .then((data) => {
                // 서버에서 반환한 데이터 처리
                if (data === "길드 관리자 인증 성공") {
                    alert("성공적으로 인증되었습니다.");
                    window.location.reload();
                } else {
                    alert("인증에 실패하였습니다.");
                }
            })
            .catch((error) =>
                console.error("데이터를 불러오는 데 실패했습니다:", error)
            );
    };

    const setRoleSubMaster = async () => {
        const guildName = userInfo?.guildName !== undefined ? userInfo.guildName : '';
        const worldName = userInfo?.worldName !== undefined ? userInfo.worldName : '';

        if (!id.trim()) {
            alert("아이디를 입력해 주세요.");
            return;
        }

        fetch("/role/subMaster", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // JSON 형식으로 데이터 전송을 알리는 헤더 추가
            },
            body: JSON.stringify({
                id: id,
                guildName: guildName,
                worldName: worldName
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                // 서버에서 반환한 데이터 처리
                if (data === "길드 관리자 등록 성공") {
                    alert("성공적으로 등록되었습니다.");
                    window.location.reload();
                } else {
                    alert("부마스터 등록을 실패했습니다.");
                }
                console.log("id: ", id);
                console.log("worldName: ", worldName);
                console.log("guildName: ", guildName);
            })
            .catch((error) =>
                console.error("데이터를 불러오는 데 실패했습니다:", error)
            );
    };

    return (
        <Box>
            <Typography variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>마이페이지</Typography>

            <Box style={{ marginBottom: '20px' }}>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>닉네임 : {userInfo?.username}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>아이디 : {userInfo?.email}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>월드명 : {userInfo?.worldName}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>길드명 : {userInfo?.guildName}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>권한 : {userInfo?.role}</Typography>
                {userInfo?.role === "마스터" && (
                    <form>
                        <TextField
                            label="등록할 회원 ID"
                            variant="outlined"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={setRoleSubMaster}>
                            길드 부마스터 등록
                        </Button>
                    </form>
                )}
            </Box>

            <Box>
                <form>
                    <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        길드 관리자 인증
                        <IconButton onClick={handleOpen}>
                            <InfoIcon />
                        </IconButton>
                    </Typography>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                API KEY 발급 가이드
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <Link href="https://openapi.nexon.com" target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                                    넥슨 OPEN API
                                </Link>
                                로 가서 로그인 후 애플리케이션 - 애플리케이션 등록 <br />
                                메이플스토리, 서비스단계, 메소, WEB, 현 사이트 URL  입력 후 등록 <br />
                                <img src="./APIKeyGuide.png" alt="API Key Guide" /> <br />

                                애플리케이션 목록에서 발급 받은 API KEY 복사 후 사용
                            </Typography>
                        </Box>
                    </Modal>
                    <p style={{ marginBottom: '10px', color: 'red' }}>
                        해당 월드에서 7일 이내 스타포스 강화, 잠재능력 재설정, 큐브 사용 내역이 있어야만 인증 가능합니다.
                    </p>
                    <TextField
                        label="API KEY"
                        variant="outlined"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <TextField
                        label="월드명"
                        variant="outlined"
                        value={worldName}
                        onChange={(e) => setWorldName(e.target.value)}
                    />
                    <TextField
                        label="길드명"
                        variant="outlined"
                        value={guildName}
                        onChange={(e) => setGuildName(e.target.value)}
                    />
                    <Button variant="contained" type="button" onClick={setRoleMaster}>권한 받기</Button>
                </form>
            </Box>
        </Box>
    );
};

export default MyInfo;