import pool from "../c";

export const getAllProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  res.json({ success: true, products: result.rows });
};

export const createProduct = async (req, res) => {
  const { product_name, category, price, description, image_url, quantity } = req.body;
  const user_id = req.user.id;
  await pool.query(
    "INSERT INTO products (user_id, product_name, category, price, description, image_url, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [user_id, product_name, category, price, description, image_url, quantity]
  );
  res.json({ success: true, message: "Product created" });
};
