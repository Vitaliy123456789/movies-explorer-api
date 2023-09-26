const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  patchUser, userInfo,
} = require('../contollers/user');

router.use(auth);
router.get('/users/me', userInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

module.exports = router;
