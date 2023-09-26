require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorCentre = require('./middlewares/errorCentre');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();
const port = 3000;

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
