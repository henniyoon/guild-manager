import React, { useState } from "react";
import { Button, Input } from "@mui/material";
// import { useAuth } from "../../../components/AuthContext";

const MyInfo: React.FC = () => {
    // const { userInfo } = useAuth();
    const [apiKey, setApiKey] = useState('');
    const [worldName, setWorldName] = useState('');
    const [guildName, setGuildName] = useState('');

    const handleButtonClick = async () => {
        const url = `/role`;
        const token = localStorage.getItem("token");

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .catch((error) =>
                console.error("데이터를 불러오는 데 실패했습니다:", error)
            );
    };

    return (
        <div>
            <h1>마이 페이지</h1>

            <p>닉네임</p>
            <p>아이디</p>
            <Button>비밀번호 재설정</Button>
            <p>API KEY</p>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)}></Input>
            <p>길드명</p>
            <Input value={guildName} onChange={(e) => setGuildName(e.target.value)}></Input>
            <p>월드명</p>
            <Input value={worldName} onChange={(e) => setWorldName(e.target.value)}></Input>
            <Button onClick={handleButtonClick}>길드 관리자 인증</Button>
        </div>
    );
};

export default MyInfo;
