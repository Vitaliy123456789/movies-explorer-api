const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { login, createUser } = require('../contollers/user');
const NotFound = require('../errors/notFound');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.use(userRouter);
router.use(movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Page Not Found'));
});

module.exports = router;
