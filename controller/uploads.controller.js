import pool from '../config/database.js';

export const uploadProduct = async (req, res) => {
  const { user_id, product_name, category, price, description, image_url } = req.body;

  if (!user_id || !product_name || !category || !price || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (user_id, product_name, category, price, description, image_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [user_id, product_name, category, price, description || '', image_url]
    );

    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
