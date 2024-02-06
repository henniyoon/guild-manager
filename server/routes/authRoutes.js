const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/authController.js');

// 회원가입
authRouter.post('/signup', AuthController.signupController);

// 로그인
authRouter.post('/login', AuthController.loginController);

// 유저네임 중복 확인
authRouter.get('/checkUsername', AuthController.checkUsernameController);

// 이메일 중복 확인
authRouter.get('/checkEmail', AuthController.checkEmailController);

module.exports = authRouter;
