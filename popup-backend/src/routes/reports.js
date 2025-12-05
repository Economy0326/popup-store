const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireLogin = require('../middleware/requireLogin');

// POST /api/reports - 제보 생성 (로그인 필수)
router.post('/', requireLogin, async (req, res) => {
  const userId = req.session.user?.id;
  const { name, address, description } = req.body;
  if (!name || !address || !description) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
  }
  try {
    // user_id별 제보 3개 제한 체크
    const [[{ count }]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM reports WHERE user_id = ?', [userId]
    );
    if (count >= 3) {
      return res.status(400).json({ ok: false, error: 'REPORT_LIMIT_EXCEEDED' });
    }
    // INSERT
    const [result] = await db.promise().query(
      'INSERT INTO reports (user_id, name, address, description, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, name, address, description]
    );
    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB_ERROR', detail: err.message });
  }
});

// GET /api/reports/mine - 로그인한 사용자의 제보 목록
router.get('/mine', requireLogin, async (req, res) => {
  const userId = req.session.user?.id;
  try {
    const [rows] = await db.promise().query(
      'SELECT id, user_id AS userId, name, address, description, created_at AS createdAt, answer, answered_at AS answeredAt FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    // createdAt, answeredAt ISO 포맷 변환
    const reports = rows.map(r => ({
      ...r,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      answeredAt: r.answeredAt ? new Date(r.answeredAt).toISOString() : null
    }));
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', detail: err.message });
  }
});

// DELETE /api/reports/:id - 제보 삭제 (로그인 필수)
router.delete('/:id', requireLogin, async (req, res) => {
  const userId = req.session.user?.id;
  const reportId = req.params.id;
  try {
    const [[row]] = await db.promise().query(
      'SELECT user_id, answer FROM reports WHERE id = ?', [reportId]
    );
    if (!row) {
      return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    }
    if (row.user_id !== userId) {
      return res.status(403).json({ ok: false, error: 'FORBIDDEN' });
    }
    await db.promise().query('DELETE FROM reports WHERE id = ?', [reportId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB_ERROR', detail: err.message });
  }
});

const requireAdmin = require('../middleware/requireAdmin');

// 운영자: 제보 목록 조회 (key 필요)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id, user_id AS userId, name, address, description, created_at AS createdAt, answer, answered_at AS answeredAt FROM reports ORDER BY created_at DESC'
    );
    const reports = rows.map(r => ({
      ...r,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      answeredAt: r.answeredAt ? new Date(r.answeredAt).toISOString() : null
    }));
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports/:id/answer?key=ADMIN_KEY - 운영자 답변 등록 (answer가 NULL일 때만, 1회만 가능)
router.post('/:id/answer', requireAdmin, async (req, res) => {
  const reportId = req.params.id;
  const answer = req.body.answer;
  if (!answer) {
    return res.status(400).json({ ok: false, error: 'MISSING_ANSWER' });
  }
  try {
    const [[row]] = await db.promise().query(
      'SELECT answer FROM reports WHERE id = ?', [reportId]
    );
    if (!row) {
      return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    }
    if (row.answer !== null) {
      return res.status(400).json({ ok: false, error: 'ALREADY_ANSWERED' });
    }
    await db.promise().query(
      'UPDATE reports SET answer = ?, answered_at = NOW() WHERE id = ?',
      [answer, reportId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB_ERROR', detail: err.message });
  }
});

// DELETE /api/reports/:id?key=ADMIN_KEY - 운영자 제보 삭제
router.delete('/:id', requireAdmin, async (req, res) => {
  const reportId = req.params.id;
  try {
    await db.promise().query('DELETE FROM reports WHERE id = ?', [reportId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB_ERROR', detail: err.message });
  }
});
module.exports = router;
