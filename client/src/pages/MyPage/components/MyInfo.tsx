import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Typography } from "@mui/material";

interface MyInfo {
    username: string;
    email: string;
    guildName: string;
    worldName: string;
    role: string;
}

const token = localStorage.getItem("token");

const MyInfo: React.FC = () => {
    const [userInfo, setUserInfo] = useState<MyInfo | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [worldName, setWorldName] = useState('');
    const [guildName, setGuildName] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/myInfo", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
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
    }, []); // 빈 의존성 배열을 사용하여 한 번만 호출되도록 설정

    const handleButtonClick = async () => {
        fetch("/role", {
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

    return (
        <Box>
            <Typography variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>마이페이지</Typography>
            
            <Box style={{ marginBottom: '20px' }}>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>닉네임 : {userInfo?.username}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>아이디 : {userInfo?.email}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>길드명 : {userInfo?.guildName}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>월드명 : {userInfo?.worldName}</Typography>
                <Typography variant="body1" style={{ marginBottom: '5px' }}>권한 : {userInfo?.role}</Typography>
            </Box>

            <Box>
                <form>
                    <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold' }}>길드 관리자 인증</Typography>
                    <TextField
                        label="API KEY"
                        variant="outlined"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <TextField
                        label="길드명"
                        variant="outlined"
                        value={guildName}
                        onChange={(e) => setGuildName(e.target.value)}
                    />
                    <TextField
                        label="월드명"
                        variant="outlined"
                        value={worldName}
                        onChange={(e) => setWorldName(e.target.value)}
                    />
                    <Button variant="contained" type="button" onClick={handleButtonClick}>권한 받기</Button>
                </form>
            </Box>

        </Box>
    );
};

export default MyInfo;
