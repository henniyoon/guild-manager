const API_KEY = "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";
const characterName = "헨쁘";
const date = "2023-12-21"
const urlString = "https://open.api.nexon.com/heroes/v1/id?character_name=" + characterName + date;

const url = "https://open.api.nexon.com/maplestory/v1/id?character_name=%EB%A9%94%EB%AA%A8%EB%9D%BC%EC%9D%B4%EC%A5%AC"

const answer = fetch(url, {
    headers:{
      "x-nxopen-api-key": API_KEY
    }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

console.log(answer)