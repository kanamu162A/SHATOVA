import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const isProduction = Boolean(process.env.DATABASE_URL);

const pool = isProduction
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required by Render
      },
    })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

pool.connect((err) => {
  if (!err) {
    console.log(`✅ Database Connected Successfully..`);
  } else {
    console.error("❌ Fail to connect to database:", err.message);
  }
});

export default pool;
