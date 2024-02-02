const fetch = require('node-fetch');

async function fetchGuildId(server, guild) {
  const API_KEY = "test_30c434a462a6ed7731bdbb00b7c64632a5c42df61ef8c7dd18a3ee80b7b10621bac3c0a66033cf6ec0e22af447b80734";
  const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(server)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    const data = await response.json();
    console.log("Guild ID:", data.oguild_id);
    return data.oguild_id; // 필요한 경우 oguild_id를 반환
  } catch (error) {
    console.error("Error fetching guild ID:", error);
  }
}

// 함수 사용 예시
fetchGuildId('서버명', '길드명');