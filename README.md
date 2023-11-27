# guild-manager

express
express mysql12
mariadb
tesseract.js
multer

main.js -> main_member, sub_member table이 있으면 조회 없으면 생성 후 조회
characterList.js -> 메이플 랭킹 페이지에서 본 길드원 목록 받아와서 DB 저장
main.js -> DB에 저장된 본 길드원 목록 조회

해야할 것
- main_member에 DB 저장 시 main_member 테이블에 이미 있는 데이터는 업데이트 하지 않고, 없는 데이터만 저장 (saveIfNotExists)
- DB에 저장하는 쿼리도 ORM을 이용하도록 수정
- DB에 저장 된 main_member, sub_member 테이블 목록 서버에 출력
