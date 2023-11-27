const { Sequelize } = require('sequelize');
const { MainMember, sequelize } = require('./models/mainMember.js');
const { SubMember } = require('./models/subMember.js');

async function fetchData() {
    try {
        // 데이터베이스 연결 확인
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공');
        
        // 데이터베이스에 테이블이 없다면 생성
        await MainMember.sync();
        await SubMember.sync();

        // 데이터 조회
        const members = await MainMember.findAll({
            attributes: ['name'],
            raw: true,  // 반환 데이터를 Sequelize 모델 객체가 아닌 순수 JSON 객체로 변경
        });
        console.log('조회 결과: ', members);
    } catch (error) {
        console.error('데이터베이스 조회 에러: ', error);
    } finally {
        // sequelize.close();  // close 메서드는 더이상 필요하지 않습니다.
        console.log('데이터베이스 연결 종료');
    }
}

// 데이터 조회 함수 실행
fetchData();