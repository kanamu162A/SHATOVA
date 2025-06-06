// controllers/productController.js
import pool from '../config/database.js';

export const uploadProduct = async (req, res) => {
  const { user_id, product_name, category, price, description } = req.body;

  // Validate required fields
  if (!user_id || !product_name || !category || !price || !req.file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert image buffer to base64 string (optional)
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');

    // Create image URL as base64 for now (you'll replace this with cloud URL later)
    const image_url = `data:${req.file.mimetype};base64,${base64Image}`;

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
