/*
В этом файле определены два middleware для логирования запросов и ошибок
 с использованием библиотеки winston и express-winston.
*/

// подключение библиотеки winston, которая предоставляет возможности для логирования.
const winston = require('winston');

// подключение express-winston, модуля winston, который предоставляет middleware для
// логирования запросов и ошибок в Express.js приложениях.
const expressWinston = require('express-winston');

// создание middleware для логирования запросов. Он использует express-winston.logger,
// который настраивает логирование запросов и сохраняет их в файл request.log. Он использует
// winston.transports.File для сохранения логов в файл, и
// формат winston.format.json() для сохранения логов в формате JSON.
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// создание middleware для логирования ошибок. Он использует express-winston.errorLogger,
// который настраивает логирование ошибок и сохраняет их в файл error.log.
//  Он также использует winston.transports.File для сохранения логов в файл,
//   и формат winston.format.json() для сохранения логов в формате JSON.
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
