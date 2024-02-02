const express = require("express");
const path = require("path");
const app = express();
const mariadb = require("mariadb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { User } = require("./models");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "WE_MUST_HIDE_THIS_KEY";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

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

app.get("/api/records", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM record");
    res.json(rows);
  } catch (err) {
    console.error("데이터베이스 쿼리 실행 실패:", err.message);
    res.status(500).send("서버 오류 발생");
  } finally {
    if (conn) conn.release();
  }
});

app.post("/api/updateRecords", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const records = req.body;

    for (let record of records) {
      const query =
        "UPDATE Record SET weekly_score = ?, suro_score = ?, flag_score = ?";
      console.log("실행 쿼리:", query, record);
      await conn.query(query, [
        record.weekly_score,
        record.suro_score,
        record.flag_score,
      ]);
    }

    res.json({ message: "업데이트 성공" });
  } catch (err) {
    console.error("데이터베이스 업데이트 실패:", err.message);
    res.status(500).send("서버 오류 발생");
  } finally {
    if (conn) conn.release();
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "회원가입 성공", userId: newUser.id });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res
        .status(409)
        .json({ message: "이미 사용중인 이메일 또는 사용자 이름입니다." });
    } else {
      console.error("회원가입 처리 에러:", error);
      res.status(500).json({ message: "서버 에러" });
    }
  }
});

// ! 현재 토큰을 localstorage에 저장하는 방식인데 XSS공격에 취약함 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "비밀번호가 잘못되었습니다." });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "로그인 성공", 
      userId: user.id, token 
      // 토큰에 추가하고 싶은 내용 적기
    });
    } catch (error) {
    console.error("로그인 처리 에러:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/api/check-username", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      res.json({ isDuplicate: true });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("사용자 이름 중복 확인 에러:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/api/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json({ isDuplicate: true });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("이메일 중복 확인 에러:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

// ! 이 코드는 다른 라우터들보다 아래에 위치하여야 합니다.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// ! 조심해주세요!

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
