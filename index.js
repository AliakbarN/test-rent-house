require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const mainClientRouter = require('./server/routers/client/main');
const houseApiRouter = require('./server/routers/api/house');
const clientController = require('./server/controllers/client/houses_page');
const userApiRouter = require('./server/routers/api/user');
const errorMiddleware = require('./server/middlewares/error');
const userRouter = require('./server/routers/client/user');
const searchApiRouter = require('./server/routers/api/search');

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('view engine', 'ejs')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .listen(PORT, () => console.log(`Listening on ${ PORT } ...`));

app.use('/api', houseApiRouter)
  .use('/api/user', userApiRouter)
  .use('/api/search', searchApiRouter)
  .use('/', mainClientRouter)
  .use('/user', userRouter)
  .use(clientController.notFound)
  .use(errorMiddleware);