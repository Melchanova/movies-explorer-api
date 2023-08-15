const router = require('express').Router();

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

const { createUser, UserLogin } = require('../controllers/users');

const {
  UserLoginValidator,
  createUserValidator,
} = require('../middlewares/validation');

const NotFoundError = require('../utils/errors/NotFoundError');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', UserLoginValidator, UserLogin);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
