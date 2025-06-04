import pool from "../config/database.js";


export const sendMessage = async (req, res) => {
  const { sender_phone, receiver_phone, message } = req.body;

  if (!sender_phone || !receiver_phone || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO messages (sender_phone, receiver_phone, message, timestamp) VALUES ($1, $2, $3, NOW())",
      [sender_phone, receiver_phone, message]
    );
    res.json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error("Error inserting message:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ success: false, message: "Missing user phones" });
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
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
