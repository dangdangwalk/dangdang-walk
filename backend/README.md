# Backend
댕댕워크 백엔드 루트 폴더입니다.
메인 서버인 server, 날씨 API와 통신하는 모듈인 weather-api-module이 속해 있습니다.
prettier, es-lint 등 두 모듈 사이에 공유되어야 하는 설정파일과 공통되는 의존성들이 이 폴더에 위치합니다.
각 모듈의 사전 작업과 실행 방법은 아래 링크에 자세하게 기술되어있습니다.
- [Backend - 서버 환경 설정 안내](https://github.com/dangdangwalk/dangdang-walk/blob/main/backend/server/README.md)
- [Backend - 날씨 api 모듈 환경 설정 안내](https://github.com/dangdangwalk/dangdang-walk/blob/main/backend/weather-api-module/README.md)

## 공통 의존성 설치
아래 명령어를 실행해 공통 의존성을 설치합니다.
```
npm install
```
## 백엔드 모듈 전체 실행
server, weather-api-moudle을 전체 실행하는 명령어입니다.
```
npm run start:all
```

## 백엔드 모듈 전체 실행 중지
server, weather-api-moudle을 전체 실행 중지하는 명령어입니다.
```
npm run stop:all
```