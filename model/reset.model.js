import pool from "../config/database.js";

export const updateUserRoleAndPin = async (phone, hashedPin, role = 'ADMIN') => {
  const query = 'UPDATE auth SET pin_code = $1, role = $2 WHERE phone = $3 RETURNING *';
  const values = [hashedPin, role, phone];
  const result = await pool.query(query, values);
  return result.rows[0];
};
