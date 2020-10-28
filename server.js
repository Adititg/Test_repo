const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const url = 'mongodb://localhost:27017/user-view';
const router = express.Router();
const cors = require('cors');
const routes = require('./routes');

// /** set up routes {API Endpoints} */
routes(router);

app.get('/', (req, res) => {
  res.send('Welcome');
});

/** connect to MongoDB datastore */
try {
  mongoose.set('debug', true);

  mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.log(error, 'err');
}
app.use(cors());

/** add middleware */

// app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb' }));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  next();
});

app.use('/api/v1', router);

// app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
