require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const cors = require('cors');

const index = require('./routes/index');
const socket = require('./middlewares/socket');

const { DB_NAME } = process.env;

const allowedUrls = [
  'http://lvh.me/',
  'http://lvh.me/api',
  'http://localhost/',
  'http://localhost:5000/',
  'http://localhost:3000/',
  'http://192.168.25.169/',
];

const corsOptions = {
  origin: allowedUrls,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(index);

const server = app.listen(7000, () => {
  console.log(`listening on ${7000}`);
});

app.use((req, res, next) => {
  req.server = server;

  next();
});

app.use(socket);

// app.use(socket);
