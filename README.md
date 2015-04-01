#Johayo Blog
### <a href='http://johayo.com' target='_black'>Go to Blog</a>

## 설명
 저의 blog는 기본 angular를 통해서 만들었으면 서버단은 nodejs로 되어 있습니다. 그리고 redis는 세션데이터 저장소로 사용되며 mongoDB가 base입니다.

그리고 좀더 나아가서 서버에 텔레그램(telegram-cli)을 설치하여, 모든 오류 혹은 저한테 메세지
(댓글 같은)를 push 할 수 있도록 개발 되어 있습니다. 물론 이메일도 되어 있고요.

config.js 파일은 서버 설정 파일 및 디비 접근 정보들이 있기때문에 공개하지 않도록 하겠습니다.
(밑의 예시 참조)

bookmark에서 url 입력시 자동 스크린샷 찍는 부분 때문에 phantomJs가 설치되어 있어야 됩니다. 
물론 package.json 안에 명시 되어 있기때문에 npm install 하시면 됩니다.

아직 베타 버젼으로 오픈되어 있으며, 
* 게시물 수정.
* 메뉴 수정.
* 메세지 관리.
* 첨부파일 다운로드(업로드는 완료).
* 마크다운 파일로도 게시물 등록 가능.

이부분이 추가 될 예정입니다.

admin부분을 테스트 해보고 싶으신분은 
* ID : test
* Password : qhdks12

으로 로그인 할 수 있습니다(로그인후 admin 메뉴는 header의 제 이름을 클릭하시면 됩니다.). 2015년 01월 01일까지 오픈 하겠습니다..^^;

#####문의 사항은 블로그 안에 있는 메세지로 보내주세요!~

## 사용 기술
* Front
	- AngularJs
	- html5
	- css3
	- bootstrap
	- font awesome
* Back
	- nodeJs
	- phantomJs
	- redis (noSql)
	- mongoDB(nosql)
* Server
	- digitalocean 클라우드 server
	- ceontOS 7
	- nginx Web server
* other
	- telegram-cli

## AngularJs 사용 모듈
구분                |web site
--------------------|----------------------------------------------------
angular-file-upload |<a href='https://github.com/danialfarid/angular-file-upload' target='_black'>github.com/danialfarid/angular-file-upload</a>
textangular	        |<a href='http://textangular.com/' target='_black'>textangular.com/</a>
ngDialog            |<a href='https://github.com/likeastore/ngDialog' target='_black'>github.com/likeastore/ngDialog</a>
angular-strap       |<a href='http://mgcrea.github.io/angular-strap/' target='_black'>mgcrea.github.io/angular-strap/</a>

## node 모듈
이부분은 소스를 package.json을 확인해 보시기 바랍니다.

##config.js 파일 예시
```javascript
/**
 * Created by 동준 on 2014-10-29.
 */
var config = {};

/* server port */
config.web = {};
config.web.port = process.env.WEB_PORT || 80;

/* session 정보 */
config.session = {};
config.session.secret= '';
config.session.name = '';

/* redis정보 */
config.redis = {};
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = '';
config.redis.port = 6379;
config.redis.password = '';
config.redis.tll = 100000;

/* 암호화 키 */
config.crypto = {};
config.crypto.password = '';

/* Mongodb */
config.mongodb= {};
/* id : pw @ host:port / db_name */
config.mongodb.connectUrl = '';

/* email관련 */
config.email = {};
config.email.host = '';
config.email.port = 587;
config.email.id = '';
config.email.password = '';
config.email.form = '';
config.email.to = '';

/* 텔레그램 */
config.tg = {};
config.tg.path = '';

/* file관련 */
config.file = {};
config.file.path='';
config.file.max_size = 1048576 * 5; // 5메가

module.exports = config;
```

## 텔레그램 설치법
이 부분은 자후 업데이트 하겠습니다.
