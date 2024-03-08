const AuthService = require('../services/authService.js');
const UserService = require('../services/userService.js');
const GuildService = require('../services/guildService.js');
const WorldService = require('../services/worldService.js');

async function getUserInfoController(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형식 가정
    if (!token) {
        return res.status(401).send("토큰이 필요합니다.");
    }
    try {
        // 토큰 검증 및 디코딩
        const decoded = AuthService.verifyToken(token);
        console.log("decode:", decoded);
        const userId = decoded.id;
        const user = await UserService.getUser(userId);
        const guildId = user.guild_id;

        let guildName = null;
        let worldName = null;

        if (guildId) {
            const guild = await GuildService.getGuildById(guildId);
            guildName = guild.name;
            const worldId = guild.world_id;
            worldName = await WorldService.getWorldName(worldId);
        }

        const userInfo = {
            username: user.username,
            email: user.email,
            guildName: guildName,
            worldName: worldName,
            role: user.role,
        };

        res.json(userInfo);
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
            return res.status(500).send("서버 에러");
        }
    }
}

async function setUserRoleMasterController(req, res) {
    const { apiKey, historyType, guildName, worldName } = req.body;
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형식 가정
    if (!token) {
        return res.status(401).send("토큰이 필요합니다.");
    }

    try {
        // 토큰 검증 및 디코딩
        const decoded = AuthService.verifyToken(token);
        const userId = decoded.id;
        const verify = await UserService.setUserRoleMaster(apiKey, historyType, userId, guildName, worldName);
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

async function setUserRoleSubMasterController(req, res) {
    const data = req.body;
    const id = data.id;
    const guildName = data.guildName;
    const worldName = data.worldName;
    console.log("id: ", id, " guildName: ", guildName, " worldName: ", worldName);
    try {
        const verify = await UserService.setUserRoleSubMaster(id, guildName, worldName);
        if (verify.success) {
            return res.status(200).send("길드 관리자 등록 성공");
        } else {
            return res.status(401).json({ error: "길드 관리자로의 인증이 실패했습니다.", reason: "ID를 정확히 입력해 주세요." });
        }
    } catch (error) {
        console.error("서버 에러", error);
        return res.status(500).send("길드 관리자 등록 실패");
    }
}

module.exports = {
    getUserInfoController,
    setUserRoleMasterController,
    setUserRoleSubMasterController,
}