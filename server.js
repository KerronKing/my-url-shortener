const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const app = express();

const mongoURI = config.get('mongoURI');
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log('Database is connected and functional'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: false}));

app.listen(process.env.PORT || 5000, () => {
  console.log('The server is up and running');
});