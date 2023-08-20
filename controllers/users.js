const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { errorText } = require('../utils/constants');
const ConflictError = require('../utils/errors/ConflictError');
const ValidationError = require('../utils/errors/ValidationError');
const NotFoundError = require('../utils/errors/NotFoundError');

const { NODE_ENV, SECRET_KEY } = process.env;
const { SECRET_KEY_DEV } = require('../utils/config');
const { CREATED } = require('../utils/errors/ResponseStatus');

// Логин пользователя
const UserLogin = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создание JWT-токена
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(CREATED).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorText.emailDuplicationError));
      } else if (err.name === 'ValidationError') {
        next(
          new ValidationError(errorText.validationError),
        );
      } else {
        next(err);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(errorText.idNotFoubdError);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(errorText.userNotFoubdError));
      } else {
        next(err);
      }
    });
};

// Обновление данных пользователя
const editProfileUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError(errorText.idNotFoubdError);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorText.emailDuplicationError));
      } else if (err.name === 'ValidationError') {
        next(
          new ValidationError(errorText.validationError),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUserInfo,
  editProfileUserInfo,
  UserLogin,
};
