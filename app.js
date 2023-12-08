const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();
const matchingRouter = require('./routes/matching');
const communityRouter = require('./routes/community')
const { connect } = require('./database/index');


const app = express();
app.set('port', process.env.PORT || 3002);
connect();

app.use(cors());
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));  // '/' 경로가 루트면 생략 가능  app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,  // 개발단계에서는 false로
  },
  name: 'session-cookie'
}));

app.use('/', matchingRouter);
app.use('/community', communityRouter);




app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err)
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port') + '번에서 서버 실행 중');
});