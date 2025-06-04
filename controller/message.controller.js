import pool from "../config/database.js";

// Get all users except the current user
export const getUsers = async (req, res) => {
  const { currentPhone } = req.query;
  if (!currentPhone) {
    return res.status(400).json({ success: false, message: "Current user phone required" });
  }

  try {
    const query = 'SELECT id, first_name, phone FROM users WHERE phone != $1';
    const result = await pool.query(query, [currentPhone]);
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res.status(400).json({ success: false, message: "Both user phone numbers are required" });
  }

  try {
    const query = `
      SELECT * FROM messages
      WHERE (sender_phone = $1 AND receiver_phone = $2)
         OR (sender_phone = $2 AND receiver_phone = $1)
      ORDER BY timestamp ASC
    `;
    const values = [user1, user2];
    const result = await pool.query(query, values);

    res.json({ success: true, messages: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  const { sender_phone, receiver_phone, message } = req.body;

  if (!sender_phone || !receiver_phone || !message?.trim()) {
    return res.status(400).json({ success: false, message: "Sender, receiver, and message are required" });
  }

  try {
    const query = `
      INSERT INTO messages (sender_phone, receiver_phone, message)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [sender_phone, receiver_phone, message];
    const result = await pool.query(query, values);

    res.status(201).json({ success: true, message: "Message sent successfully", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};
