import React, { useState } from "react";
import { Button } from "react-bootstrap";

const MyInfo: React.FC = () => {

    return(
        <div>
            <h1>마이 페이지</h1>

            <p>닉네임</p>
            <p>아이디</p>
            <Button>비밀번호 재설정</Button>
            <p>길드</p>
            <Button>길드 관리자 인증</Button>
        </div>
    )
}

export default MyInfo;