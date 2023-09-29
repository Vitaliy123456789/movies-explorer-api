const movieModel = require('../models/movie');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const ok = 200;
const created = 201;

const getMovie = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movie) => res.status(ok).send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  return movieModel.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('данного фильма не существует');
      }
      if (userId !== movie.owner.toString()) {
        throw new Forbidden('запрещено к удалению');
      }
      return movieModel.findByIdAndRemove(movieId)
        .then(() => res.status(ok).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(created).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie,
  deleteMovie,
  createMovie,
};
