const API_KEY = "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";
const characterName = "헨쁘";
const date = "2023-12-21"
const urlString = "https://open.api.nexon.com/heroes/v1/id?character_name=" + characterName + date;
// { ocid: '9bed2e0f6289cb04492e68706e3baad8' }
const url = "https://open.api.nexon.com/maplestory/v1/character/basic?ocid=9bed2e0f6289cb04492e68706e3baad8&date=2023-12-21"

const answer = fetch(url, {
    headers:{
      "x-nxopen-api-key": API_KEY
    }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

console.log(answer)