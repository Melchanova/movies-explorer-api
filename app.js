require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimit');

const { DB_URL } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect(DB_URL)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('БД подключена');
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.log('Не удалось подключиться к БД');
  });

app.use(express.json());

app.use(cors);

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT);
