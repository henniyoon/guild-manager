const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Guild = require('../models/Guild.js');
const World = require('../models/World.js');

const SECRET_KEY = "WE_MUST_HIDE_THIS_KEY";

// 토큰 생성 로직
function generateToken(data) {
    const token = jwt.sign(data, SECRET_KEY);
    return token;
}

// 토큰 검증 로직
function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

// 회원가입
const signup = async (username, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        return { message: '회원가입 성공', userId: newUser.id };
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw { status: 409, message: '이미 사용중인 이메일 또는 사용자 이름입니다.' };
        } else {
            throw { status: 500, message: '서버 에러' };
        }
    }
};

// 로그인
// ! 현재 토큰을 localstorage에 저장하는 방식인데 XSS공격에 취약함 
const login = async (email, password) => {
    try {
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Guild,
                attributes: ['world_id', 'name'], // 'world_id'와 'name' 속성 포함
                as: 'guild',
                include: [{ // Guild 모델 내에서 World 모델을 추가로 포함
                    model: World,
                    attributes: ['name'], // World의 'name' 속성 가져오기
                    as: 'world'
                }]
            }]
        });
        if (!user) {
            throw { status: 401, message: '사용자를 찾을 수 없습니다.' };
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw { status: 401, message: '비밀번호가 잘못되었습니다.' };
        }

        // 사용자의 길드 world_id와 name 가져오기
        const guildWorldId = user.guild ? user.guild.world_id : null;
        const guildName = user.guild ? user.guild.name : null;
        const worldName = user.guild && user.guild.world ? user.guild.world.name : null;

        const payload = {
            id: user.id,
            username: user.username,
            guild_world_id: user.guild ? user.guild.world_id : null,
            guild_name: user.guild ? user.guild.name : null,
            world_name: worldName,
            guild_World_Id: guildWorldId,
        };

        const token = generateToken(payload);
        // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        return { message: '로그인 성공', token };
    } catch (error) {
        console.log(error)
        throw { status: 500, message: '서버 에러' };
    }
};

// username 중복 확인
const checkUsername = async (username) => {
    try {
        const user = await User.findOne({ where: { username } });
        return { isDuplicate: !!user };
    } catch (error) {
        throw { status: 500, message: '서버 에러' };
    }
};

// email 중복 확인
const checkEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return { isDuplicate: !!user };
    } catch (error) {
        throw { status: 500, message: '서버 에러' };
    }
};

module.exports = {
    generateToken,
    verifyToken,
    signup,
    login,
    checkUsername,
    checkEmail,
};
