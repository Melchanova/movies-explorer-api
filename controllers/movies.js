const Movie = require('../models/movie');

const { errorText } = require('../utils/constants');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const ValidationError = require('../utils/errors/ValidationError');
const NotFoundError = require('../utils/errors/NotFoundError');

// Получение массива с фильмами
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// Функция createMovie создает новый фильм в базе данных,
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  // Создание нового фильма в базе данных
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id, // Связываем фильм с текущим пользователем по id
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ValidationError(errorText.validationError),
        );
      } else {
        next(err);
      }
    });
};

// Удаление фильма
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(errorText.idNotFoubdError);
    })
    .then((movie) => {
      const owner = movie.owner.toString();

      // Проверка, является ли текущий пользователь владельцем фильма
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError(errorText.movieDeleteError);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(errorText.validationError));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
