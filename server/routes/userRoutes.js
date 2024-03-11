const express = require('express');
const userRouter = express.Router();

const UserController = require('../controllers/userController.js');

userRouter.get('/myInfo', UserController.getUserInfoController);
userRouter.post('/role/master', UserController.setUserRoleController);
userRouter.post('/role/subMaster', UserController.setUserRoleSubMasterController);

module.exports = userRouter;