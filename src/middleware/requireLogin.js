// 로그인 여부 확인 미들웨어
module.exports = function requireLogin(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.redirect('/login');
  }
  next();
};