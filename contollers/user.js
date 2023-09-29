const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/Unauthorize');

const { NODE_ENV, JWT_SECRET } = process.env;

const ok = 200;
const created = 201;

const createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(created).send({
      name, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('email уже зарегестрирован'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  return userModel
    .findByIdAndUpdate(
      owner,
      { name, email },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь не существует');
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Необходима авторизация.'));
    });
};
const userInfo = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.status(ok).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  patchUser,
  login,
  userInfo,
  createUser,
};
