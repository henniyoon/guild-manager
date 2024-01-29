const API_KEY = "test_30c434a462a6ed7731bdbb00b7c646320cf57614f257e894ce568d5c72be6f033161d2fa1c52df2064e46e36e91f101c";

const url = "https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=bf630c2b4f0ebbc873e6d51bd842fe8b&date=2024-01-28"

// [길드 고유 식별자 조회]
// https://open.api.nexon.com/maplestory/v1/guild/id? + guild_name=%EB%B3%84%EB%B9%9B& + world_name=%EC%8A%A4%EC%B9%B4%EB%8B%88%EC%95%84
// [url] + [길드 이름] + [서버 이름] 형태
// -> { oguild_id: 'bf630c2b4f0ebbc873e6d51bd842fe8b' }
// 스카니아 별빛 길드 식별자

// [길드 정보 조회]
// https://open.api.nexon.com/maplestory/v1/guild/basic?oguild_id=bf630c2b4f0ebbc873e6d51bd842fe8b&date=2024-01-28
// https://open.api.nexon.com/maplestory/v1/guild/basic? + oguild_id=bf630c2b4f0ebbc873e6d51bd842fe8b& + date=2024-01-28
// [url] + [길드 식별자] + [날짜] 형태

const answer = fetch(url, {
    headers:{
      "x-nxopen-api-key": API_KEY
    }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

console.log(answer)