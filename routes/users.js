const userRouter = require('express').Router();

const {
  getCurrentUserInfo, editProfileUserInfo,
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUserInfo);
userRouter.patch('/users/me', editProfileUserInfo);

module.exports = userRouter;
