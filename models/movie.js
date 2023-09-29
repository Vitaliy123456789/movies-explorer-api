const mongoose = require('mongoose');
const validatorUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (url) => validatorUrl(url),
      message: 'некорректная ссылка',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (url) => validatorUrl(url),
      message: 'некорректная ссылка',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (url) => validatorUrl(url),
      message: 'некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
