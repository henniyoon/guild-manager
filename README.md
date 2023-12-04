# guild-manager

## 모듈 관련해서 오류가 발생하면
1. node_modules 폴더 삭제
2. package-lock.json 파일 삭제
3. 터미널 > npm install 

## 사용 예정 모듈
tesseract.js  
debug

## 파일 구조
GUILD-MANAGER  
│  
├── config  
│   └── config.json (MariaDB 연결 정보)  
│  
├── models  
│   ├── mainMember.js (main_member 테이블 정의하는 모듈)  
│   └── subMember.js (sub_member 테이블 정의하는 모듈)  
│  
├── services  
│   ├── dataService.js (메이플 랭킹 페이지에서 guild id를 통해 해당 길드의 길드원 목록을 스크래핑하여 characterNames 배열에 저장하는 모듈)  
│   └── memberService.js (스크래핑 한 길드원 배열을 DB에 저장, 조회하는 모듈)  
│  
├── src  
│   └── utils  
│       └── scraping.js (axios, cheerio 라이브러리를 사용하여 특정 url에서 table의 특정 정보를 스크래핑 해오는 모듈)  
│  
├── app.js (서버 관련)  
│  
├── db.js (Sequelize를 사용하여 config.json 파일 정보를 불러와 sequelize 객체를 생성하여 내보내는 모듈)  
│  
└── main.js (다양한 로직을 조합하여 실행)  

---

## TODO
- DB에 저장 된 main_member, sub_member 테이블 목록 서버에 출력
