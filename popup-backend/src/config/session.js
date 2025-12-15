const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 프로덕션에서만 HTTPS 강제
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 프로덕션에서는 크로스사이트 허용
    maxAge: 24 * 60 * 60 * 1000 // 1일
  }
});

module.exports = sessionMiddleware;
