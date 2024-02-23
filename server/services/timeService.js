function getCurrentKoreaTime() {
    // 현재 UTC 시간 가져오기
    const currentUtcTime = new Date();
    // UTC 시간을 한국 시간으로 변환
    const koreanTime = new Date(currentUtcTime.getTime() + (9 * 60 * 60 * 1000));

    return koreanTime;
}

module.exports = { getCurrentKoreaTime };

// console.log(getCurrentKoreanTime());