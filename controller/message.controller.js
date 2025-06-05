import pool from '../config/database.js';

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
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching chat users:', error.message);
    res.status(500).json({ error: 'Server error fetching chats' });
  }
};

export const checkUserExists = async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM auth WHERE phone = $1',
      [phone]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ exists: true, user: result.rows[0] });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error.message);
    res.status(500).json({ error: 'Server error checking user' });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const result = await pool.query(
      `
      SELECT * FROM messages
      WHERE (sender_phone = $1 AND receiver_phone = $2)
         OR (sender_phone = $2 AND receiver_phone = $1)
      ORDER BY created_at ASC
      `,
      [user1, user2]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  const { sender_phone, receiver_phone, message } = req.body;
  try {
    await pool.query(
      `
      INSERT INTO messages (sender_phone, receiver_phone, message, created_at)
      VALUES ($1, $2, $3, NOW())
      `,
      [sender_phone, receiver_phone, message]
    );
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: 'Server error sending message' });
  }
};
