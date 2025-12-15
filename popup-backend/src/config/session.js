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
  proxy: true, // Trust Proxy 설정 (필수)
  cookie: {
    httpOnly: true,
    secure: true, 
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1일
  }
});

module.exports = sessionMiddleware;
