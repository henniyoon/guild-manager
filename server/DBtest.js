// * 서버+길드를 입력하면 모든 길드원의 정보를 DB에 저장하는 코드
// * 1. 서버 + 길드 이름 -> 고유 식별자
// * 2. 식별자 -> 길드정보
// * 3. 길드원 1의 세부정보
// * 4. 이 과정을 길드원 수만큼 반복
// * API 호출 수를 획기적으로 줄여야 됨 ㅠㅠ

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

const fetch = require("node-fetch");
const API_KEY =
  "live_8889de2bcdbf2ffc389f01c608c335ad8feab2cc9b5a30e4551a599f1f9956847c78d2cca2b6f310be5c3009a02cd2b3";

  const fetchDelay = 100; // 지연시간 설정 

  async function fetchGuildDetails(oguild_id) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정
    const formattedDate = currentDate.toISOString().split("T")[0]; // 날짜를 YYYY-MM-DD 형식으로 포매팅
  
    const url = `https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=${oguild_id}&date=${formattedDate}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      });
      const data = await response.json();
      console.log("Guild Details:", data.guild_member);
  
      for (const memberNickname of data.guild_member) {
        await fetchOcid(memberNickname);
        // 초당 5건의 호출 제한을 준수하기 위해 일정한 간격으로 대기
        await sleep(fetchDelay);
      }
  
      return data; // 필요한 경우 길드 상세 정보를 반환
    } catch (error) {
      console.error("Error fetching guild details:", error);
    }
  }
  
  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function fetchGuildMember(server, guild) {
  const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(
    guild
  )}&world_name=${encodeURIComponent(server)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    const data = await response.json();
    fetchGuildDetails(data.oguild_id);

    console.log("Guild ID:", data.oguild_id);
    return data.oguild_id; // 필요한 경우 oguild_id를 반환
  } catch (error) {
    console.error("Error fetching guild ID:", error);
  }
}

async function insertCharacter(nickname, level, imageURL, guildName) {
    try {
      const newCharacter = await db.CharacterInfo.create({
        nickname: nickname || 'Unknown', // 닉네임이 없는 경우 "Unknown"으로 설정
        level: level || 1, // 레벨이 없는 경우 1로 설정
        URL: imageURL,
        guild: guildName || 'No Guild', // 길드가 없는 경우 "No Guild"으로 설정
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

  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    const data = await response.json();
    const ocid = data.ocid;
    fetchCharacterDetails(ocid);
    return data; // 필요한 경우 캐릭터 세부 정보를 반환
  } catch (error) {
    console.error("Error fetching character details:", error);
  }
}

async function fetchCharacterDetails(ocid, retryCount = 10) {
  const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${encodeURIComponent(
    ocid
  )}&date=2024-02-01`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    const data = await response.json();
    console.log("Character Details:", data);
    insertCharacter(data.character_name, data.character_level, data.character_image, data.character_guild_name)
    return data; // 필요한 경우 캐릭터 세부 정보를 반환
  } catch (error) {
    console.error("Error fetching character details:", error);
    if (retryCount > 0) {
      console.log(`Retrying in 1 second (Retry Count: ${retryCount})`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
      return fetchCharacterDetails(ocid, retryCount - 1); // 재시도
    } else {
      console.error("Max retry count reached. Cannot fetch character details.");
    }
  }
}

fetchGuildMember("스카니아", "별빛");

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
