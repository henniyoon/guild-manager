const AuthService = require('../services/authService.js');
const UserService = require('../services/userService.js');

async function setUserRoleController(req, res) {
    const { apiKey, guildName, worldName } = req.body;
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형식 가정
    if (!token) {
        return res.status(401).send("토큰이 필요합니다.");
    }

    try {
        // 토큰 검증 및 디코딩
        const decoded = AuthService.verifyToken(token);
        const userId = decoded.id;
        const verify = await UserService.setUserRole(apiKey, userId, guildName, worldName);
        // console.log(verify);
        if (verify.success) {
            return res.status(200).send("길드 관리자 인증 성공");
        } else {
            return res.status(401).json({ error: "길드 관리자로의 인증이 실패했습니다.", reason: "유저가 길드 관리자가 아닙니다." });
        }
    } catch (error) {
        // 오류 처리
        if (error.name === "TokenExpiredError") {
            console.error("토큰이 만료되었습니다:", error);
            return res.status(401).send("토큰이 만료되었습니다. 다시 로그인해주세요.");
        } else if (error.name === "JsonWebTokenError") {
            console.error("유효하지 않은 토큰입니다:", error);
            return res.status(401).send("유효하지 않은 토큰입니다.");
        } else {
            console.error("서버 에러", error);
            return res.status(500).send("길드 관리자 인증 실패");
        }
    }
}

module.exports = {
    setUserRoleController,
}