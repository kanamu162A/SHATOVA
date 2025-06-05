import pool from '../config/database.js';

export const sendMessage = async (req, res) => {
  const { sender_phone, receiver_phone, message } = req.body;

  if (!sender_phone || !receiver_phone || !message?.trim()) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO messages (sender_phone, receiver_phone, message, timestamp) VALUES ($1, $2, $3, NOW())",
      [sender_phone, receiver_phone, message.trim()]
    );
    res.json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error("DB insert error:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ success: false, message: "Missing phone numbers" });
  }

  try {
    const result = await pool.query(
      `
        SELECT * FROM messages
        WHERE (sender_phone = $1 AND receiver_phone = $2)
           OR (sender_phone = $2 AND receiver_phone = $1)
        ORDER BY timestamp ASC
      `,
      [user1, user2]
    );
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.error("DB fetch error:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

export const checkUserRegistered = async (req, res) => {
  const { phone } = req.params;

  if (!phone) return res.status(400).json({ success: false, message: "Phone number is required" });

  try {
    const result = await pool.query("SELECT * FROM auth WHERE phone = $1", [phone]);
    res.json({ success: true, registered: result.rows.length > 0 });
  } catch (err) {
    console.error("User check error:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

export const getUserChats = async (req, res) => {
  const { phone } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT DISTINCT 
          CASE
            WHEN sender_phone = $1 THEN receiver_phone
            ELSE sender_phone
          END AS chat_partner
        FROM messages
        WHERE sender_phone = $1 OR receiver_phone = $1
      `,
      [phone]
    );
    res.json({ success: true, chats: result.rows });
  } catch (err) {
    console.error("Chat list error:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
