const AuthService = require('../services/authService.js');

const signupController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await AuthService.signup(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await AuthService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: "아이디, 비밀번호를 확인해주세요." });
    }
};

const checkUsernameController = async (req, res) => {
    const { username } = req.query;
    try {
        const result = await AuthService.checkUsername(username);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const checkEmailController = async (req, res) => {
    const { email } = req.query;
    try {
        const result = await AuthService.checkEmail(email);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = {
    signupController,
    loginController,
    checkUsernameController,
    checkEmailController,
};
