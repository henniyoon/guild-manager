const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const SECRET_KEY = "WE_MUST_HIDE_THIS_KEY";

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
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw { status: 401, message: '사용자를 찾을 수 없습니다.' };
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw { status: 401, message: '비밀번호가 잘못되었습니다.' };
        }

        const payload = {
            id: user.id,
            username: user.username,
            // 다른 필요한 정보도 추가할 수 있습니다.
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        return { message: '로그인 성공', token };
    } catch (error) {
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
    signup,
    login,
    checkUsername,
    checkEmail,
};
