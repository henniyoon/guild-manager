# https://openapi.nexon.com/game/maplestory/?id=22

메이플 오픈 API는 여기 참고


## 개발 전달사항
`concurrently`라는 node.js 패키지를 설치해서 `guild-manager 경로에서 npm start`를 했을 때, 기본적으로 client와 server가 동시에 실행되도록 설정해 둠
   
리액트만 실행하고 싶을 경우 `npm run client`

노드 서버만 실행하고 싶을 경우 `npm run server`

# 작업중
관리자 페이지 들어갈 때 본인 길드만 보이게 만드는 중

# 해야 할 일!
<!-- 1. GuildPage 에 검색, 정렬이 있어야 할 듯 -->
<!-- 2. Adminpage : DB에서 길드 코드와 n주차 조회해서 데이터 불러오기 -->
<!-- 3. API 호출을 최소화 해야 할 것 같음 (길드 고유키와 길드 정보를 조회하고 있는데 2회 호출하는 것으로 찍힘) -->
<!-- 4. 회원가입 이름, 이메일 중복 시 무언가 출력되게 만들기 -->
<!-- 5. record 테이블의 date는 timestamp가 아님!!!!!!!!!!!!!!!! 절대로 타입스탬프로 하면 안됨 -->
<!-- 6. 로그인하고 이전 페이지로 되돌아가게 만들기. 지금은 메인페이지로 감 -->
<!-- 7. 로그인 상태 유지 (쿠키를 사용할 것인지, 토큰 만료시간에 맞춰 삭제하는 로직) -->
<!-- 8. OCR 원본 이미지 삭제하는 방법 생각하기 -->
<!-- 9. OCR 데이터 저장하는 로직 다시 짜기 -->
<!-- 노블제한 클릭으로, 날짜 맞추기, 배포  -->
<!-- 배열 수랑 사람 수 표시하면 좋을 것 같음 -->
노블제한자 조회 페이지
첨부파일 업로드 시 해상도 선택

# 요청사항
관리자 페이지 검색 기능
수로 플래그 총합 출력
인증 로직 개선, 부마스터도 인증할 수 있게 추가하기

# Hennie TODO

## 작업 편의성
    - 디렉토리 구조 정리

## 기능
    - 월드 마크 DB 또는 클라이언트 public에 저장 (길드 검색시 월드명 옆에 월드 로고 뜨도록)
    - 마이 페이지 제작 (길드 관리자이면 관리자라고 뜨고, 개인 정보 뜨도록)
    - 길드 페이지에서 캐릭터 검색 기능
    - guild page 업데이트 시 성능 최적화에 대한 고민 (현재 약 40초 걸림..ㅠ)
    - 길드명 미입력시 입력하라는 alret 뜨도록
    - 전체 월드 선택해서 길드명으로 조회 후 원하는 서버의 길드 선택 가능하도록 (ex. 츄츄지지의 길드 검색)


# 테이블 쿼리문 저장
CREATE TABLE `characters` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`world_id` INT(11) NULL DEFAULT NULL,
	`guild_id` INT(11) NULL DEFAULT NULL,
	`name` VARCHAR(12) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`ocid` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`class` VARCHAR(18) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`level` SMALLINT(5) UNSIGNED NULL DEFAULT NULL,
	`main_character_name` VARCHAR(12) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`image` VARCHAR(511) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`last_updated` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `ocid` (`ocid`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=4474
;

CREATE TABLE `guilds` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`world_id` TINYINT(4) NOT NULL,
	`name` VARCHAR(12) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`oguild_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`master_name` VARCHAR(12) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`member_count` INT(11) NULL DEFAULT NULL,
	`level` TINYINT(4) NULL DEFAULT NULL,
	`noblesse_skill_level` TINYINT(4) NULL DEFAULT NULL,
	`guild_mark` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`guild_mark_custom` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`last_updated` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `oguild_id` (`oguild_id`) USING BTREE,
	INDEX `world_id` (`world_id`) USING BTREE,
	CONSTRAINT `guilds_ibfk_1` FOREIGN KEY (`world_id`) REFERENCES `worlds` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=47
;

CREATE TABLE `records` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`character_id` INT(11) NULL DEFAULT NULL,
	`weekly_score` TINYINT(4) NULL DEFAULT NULL,
	`suro_score` MEDIUMINT(9) NULL DEFAULT NULL,
	`flag_score` SMALLINT(6) NULL DEFAULT NULL,
	`noble_limit` TINYINT(1) NOT NULL DEFAULT '0',
	`week` VARCHAR(8) NOT NULL DEFAULT '' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `records-characters_id` (`character_id`) USING BTREE,
	CONSTRAINT `records-characters_id` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2412
;

CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`guild_id` INT(11) NULL DEFAULT NULL,
	`username` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`role` ENUM('Master','Sub_Master','Member') NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `username` (`username`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE,
	INDEX `users-guilds_id` (`guild_id`) USING BTREE,
	CONSTRAINT `users-guilds_id` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=4
;

CREATE TABLE `worlds` (
	`id` TINYINT(4) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(12) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=15
;
