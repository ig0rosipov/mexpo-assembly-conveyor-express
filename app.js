require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { corsOptions } = require('./configs/config');

const app = express();
const index = require('./routes/index');
const socket = require('./middlewares/socket');

const { DB_NAME, PORT } = process.env;

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/api', (req, res) => {
  res.send('<h2>Conveyor API</h2>');
});

app.use(index);

const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

app.use((req, res, next) => {
  req.server = server;

  next();
});

app.use(socket);
