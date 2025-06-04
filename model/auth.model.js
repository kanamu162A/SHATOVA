import pool from "../config/database.js";

export async function findUserByPhone(phone) {
  const res = await pool.query('SELECT id, first_name FROM users WHERE phone = $1', [phone]);
  return res.rows[0];
};

export async function findUserById(id) {
  const res = await pool.query('SELECT id, first_name FROM users WHERE id = $1', [id]);
  return res.rows[0];
};


