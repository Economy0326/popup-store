const db = require('../config/db');

async function findUserByUserId(userid) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE userid = ?', [userid], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
}
async function createUser(user) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO users (userid, nickname) VALUES (?, ?)',
      [user.userid, user.nickname],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      }
    );
  });
}

module.exports = { findUserByUserId, createUser };
