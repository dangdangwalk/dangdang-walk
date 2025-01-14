# Weather-api-module

공공 날씨 API로부터 날씨 데이터를 받아 저장해두는 캐시 모듈입니다.

## 0. 필수 준비 사항

프로젝트를 시작하기 전에 다음 두 가지 작업을 완료해야 합니다.

### 환경 설정 파일 생성

backend/weather-api-module에 `.env.local` 파일을 생성하고 아래 내용을 입력합니다.
<br>

```shell
WEATHER_KEY=BsF4fSEovKFk0eYc%2FUaRwNlbs9huskqBaHql1e4%2F%2BM25cyEomjKVObFYnhwqnEeLJUz7kfeNLO3zDpzxnd%2Foew%3D%3D
SERVER_PORT=3335
REDIS_PORT=6379
REDIS_HOST=localhost
CORS_ORIGIN=http://localhost:3000
```

### Redis 도커 실행하기 
- 아래 명령어를 입력해 Redis 도커를 실행합니다.

```shell
docker run -d --name local-redis --platform linux/amd64 -p 6379:6379 \
redis:7.0.15 redis-server
```

## 1. 의존성 설치하기

-   backend/ 에서 `npm install` 명령어로 공통 의존성을 설치합니다.
-   backend/weather-api-module에서 `npm install` 명령어로 날씨 api 모듈에 필요한 의존성을 설치합니다.

## 2. 프로그램 실행하기

weather-api-module 디렉토리에서 `npm run start` 명령어를 입력해 실행합니다.
