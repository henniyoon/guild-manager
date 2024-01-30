import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GuildData {
  oguild_id: string;
}

interface GuildDetails {
  guild_member: string;
}

const GuildPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const server = queryParams.get("server");
  const input = queryParams.get("input");
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [guildDetails, setGuildDetails] = useState<GuildDetails | null>(null);
  const API_KEY =
  "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";

  useEffect(() => {
    if (server && input) {
      const url = `https://open.api.nexon.com/maplestory/v1/guild/id?guild_name=${encodeURIComponent(
        input
      )}&world_name=${encodeURIComponent(server)}`;

      fetch(url, {
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => setGuildData(data))
        .catch((error) => console.error("Error fetching guild data:", error));
    }
  }, [server, input]);

  useEffect(() => {
    if (guildData && guildData.oguild_id) {
      const guildDetailsUrl = `https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=${guildData.oguild_id}&date=2024-01-28`;
      
      fetch(guildDetailsUrl, {
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) =>{ 
        console.log(data)
        setGuildDetails(data)})
        .catch((error) =>
          console.error("Error fetching guild details:", error)
        );
    }
  }, [guildData]);

  if (!guildData) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h1>결과 페이지</h1>
      <p>선택된 서버: {server}</p>
      <p>입력된 값: {input}</p>
        <div>
          <p>Guild ID: {guildData?.oguild_id}</p>
          <p>{guildDetails?.guild_member}</p>
        </div>
    </div>
  );
};

export default GuildPage;
