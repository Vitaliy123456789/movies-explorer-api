const {
  dataMovies = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  port = 3000,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.export = {
  dataMovies, port, NODE_ENV, JWT_SECRET,
};