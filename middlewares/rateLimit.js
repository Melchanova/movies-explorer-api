const rateLimiter = require('express-rate-limit');

// Ограничитель запросов
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    'Превышено количество запросов на сервер. Попробуйте повторить немного позже',
});

module.exports = limiter; // Экспортируем ограничитель запросов
