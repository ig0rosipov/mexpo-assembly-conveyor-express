const express = require('express');

const app = express();

const cors = require('cors');

const index = require('./routes/index');
const socket = require('./middlewares/socket');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(index);

const server = app.listen(5000, () => {
  console.log('listening on 5000');
});

app.use((req, res, next) => {
  req.server = server;

  next();
});

app.use(socket);
