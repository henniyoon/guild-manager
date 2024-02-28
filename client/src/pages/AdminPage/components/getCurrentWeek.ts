function getCurrentWeek() {
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    // .getTime()을 사용하여 Date 객체를 밀리초 단위의 숫자로 변환
    const pastDaysOfYear =
      (currentDate.getTime() - firstDayOfYear.getTime()) / 86400000;
    // 첫째 날이 일요일이 아니라면 +1을 하지 않고, 대신 첫째 날의 getDay() 값을 빼줍니다.
    const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
    return `${currentDate.getFullYear()}-W${currentWeek
      .toString()
      .padStart(2, "0")}`;
  }

  export default getCurrentWeek;
