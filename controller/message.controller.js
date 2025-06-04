import pool from '../config/database.js';

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ success: false, message: "Both user phone numbers are required" });
  }

  try {
    const query = `
      SELECT id, sender_phone, receiver_phone, message, timestamp
      FROM messages
      WHERE (sender_phone = $1 AND receiver_phone = $2)
         OR (sender_phone = $2 AND receiver_phone = $1)
      ORDER BY timestamp ASC
    `;
    const { rows } = await pool.query(query, [user1, user2]);
    return res.json({ success: true, messages: rows });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ success: false, message: "Server error occurred" });
  }
};

export const sendMessage = async (req, res) => {
  const { sender_phone, receiver_phone, message } = req.body;

  if (!sender_phone || !receiver_phone || !message?.trim()) {
    return res.status(400).json({ success: false, message: "Sender, receiver, and non-empty message are required" });
  }

  try {
    const query = `
      INSERT INTO messages (sender_phone, receiver_phone, message)
      VALUES ($1, $2, $3)
      RETURNING id, sender_phone, receiver_phone, message, timestamp
    `;
    const { rows } = await pool.query(query, [sender_phone, receiver_phone, message.trim()]);
    return res.status(201).json({ success: true, message: "Message sent", data: rows[0] });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ success: false, message: "Server error occurred" });
  }
};
