import mysql, { Pool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to the MySQL database via Pool.");

    connection.release();
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

connection();

export default pool;
