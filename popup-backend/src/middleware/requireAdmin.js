// 운영자 key 검증 미들웨어
module.exports = function requireAdmin(req, res, next) {
  const adminKey = req.query.key || req.body.key;
  if (!adminKey || adminKey !== process.env.REPORT_ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }
  next();
}
