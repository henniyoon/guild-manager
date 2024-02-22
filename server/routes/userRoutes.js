const express = require('express');
const userRouter = express.Router();

const UserController = require('../controllers/userController.js');

userRouter.post('/role', UserController.setUserRoleController);

module.exports = userRouter;