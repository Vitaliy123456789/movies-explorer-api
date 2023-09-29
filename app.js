require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorCentre = require('./middlewares/errorCentre');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { dataMovies, port, } = require('./utilits')
mongoose.connect(dataMovies, {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorCentre);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
