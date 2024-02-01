const express = require("express");
const mariadb = require("mariadb");
const fetch = require("node-fetch");
const app = express();
const db = require("./models");

const API_KEY =
  "test_30c434a462a6ed7731bdbb00b7c64632a5c42df61ef8c7dd18a3ee80b7b10621bac3c0a66033cf6ec0e22af447b80734";

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

async function fetchApiData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return null;
  }
}

async function fetchGuildDetails(oguild_id) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const formattedDate = currentDate.toISOString().split("T")[0];

  const url = `https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=${oguild_id}&date=${formattedDate}`;
  const data = await fetchApiData(url);

  if (!data) return;

  console.log("Guild Details:", data.guild_member);

  for (const memberNickname of data.guild_member) {
    await fetchOcid(memberNickname);
  }

  return data;
}

async function fetchGuildMember(server, guild) {
  const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(
    guild
  )}&world_name=${encodeURIComponent(server)}`;

  const data = await fetchApiData(url);

  if (!data) return;

  fetchGuildDetails(data.oguild_id);
  console.log("Guild ID:", data.oguild_id);

  return data.oguild_id;
}

async function insertCharacter(nickname, level, imageURL, guildName) {
  try {
    const newCharacter = await db.CharacterInfo.create({
      nickname: nickname || 'Unknown',
      level: level || 1,
      URL: imageURL,
      guild: guildName || 'No Guild',
      updated_at: new Date(),
    });
    console.log("New character added:", newCharacter);
  } catch (error) {
    console.error("Error inserting new character:", error);
  }
}

async function fetchOcid(nickname) {
  const url = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(
    nickname
  )}`;
  const data = await fetchApiData(url);

  if (!data) return;

  const ocid = data.ocid;
  await fetchCharacterDetails(ocid);
  return data;
}

async function fetchCharacterDetails(ocid) {
  const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${encodeURIComponent(
    ocid
  )}&date=2024-01-31`;
  const data = await fetchApiData(url);

  if (!data) return;

  console.log("Character Details:", data);
  insertCharacter(data.character_name, data.character_level, data.character_image, data.character_guild_name);
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});