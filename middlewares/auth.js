const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { SECRET_KEY_DEV } = require('../utils/config');

const { NODE_ENV, SECRET_KEY } = process.env;

// Проверка аутентификации пользователя
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Необходима авторизация!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // Проверка валидности и расшифровка JWT токена
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV,
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
    return;
  }
  // Присваиваем расшифрованные данные токена в объект запроса
  req.user = payload;

  next();
};
