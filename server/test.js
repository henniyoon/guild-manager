const express = require("express");
const mariadb = require("mariadb");
const app = express();
const db = require("./models");

const pool = mariadb.createPool({
  host: "database-for-guild.clewymu6ct5n.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "123123123",
  database: "database_for_guild",
  connectionLimit: 5,
});

async function connectDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("데이터베이스 연결 성공");
  } catch (err) {
    console.error("데이터베이스 연결 실패:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

connectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
