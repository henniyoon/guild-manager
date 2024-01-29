const {MapleStoryApi, MapleStoryApiError} = require('maplestory-openapi');

const API_KEY = "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";
const characterName = "";
const urlString = "https://open.api.nexon.com/maplestory/v1/id?character_name=%ED%97%A8%EC%81%98"

const answer = fetch(urlString, {
    headers:{
      "x-nxopen-api-key": API_KEY
    }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

console.log(answer)