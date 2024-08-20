# Weather-api-module

공공 날씨 API로부터 날씨 데이터를 받아 저장해두는 캐시 모듈입니다.

## 0. 필수 준비 사항

프로젝트를 시작하기 전에 다음 두 가지 작업을 완료해야 합니다.

### 환경 설정 파일 생성

`.env` 파일을 생성하고 아래 내용을 입력합니다.
<br>

```shell
WEATHER_KEY=BsF4fSEovKFk0eYc%2FUaRwNlbs9huskqBaHql1e4%2F%2BM25cyEomjKVObFYnhwqnEeLJUz7kfeNLO3zDpzxnd%2Foew%3D%3D
PORT=6379
```

### 데이터베이스 설정하기

-   redis 7.0.15 버전의 Docker 이미지를 생성합니다.

```dockerfile
FROM redis:7.0.15

EXPOSE 6379

CMD ["redis-server"]
```

-   다음 명령어를 실행해 Docker dㅣ미지를 빌드합니다.

```shell
docker build -t my-redis:7.0.15 .
```

-   빌드된 이미지를 사용하여 Redis 컨테이너를 실행합니다.

```shell
docker run -d --name my-redis-container -p 6379:6379 my-redis:7.0.15
```

## 1. 프로그램 실행하기
weather-api-module 디렉토리에서 `npm run start` 명령어를 입력해 실행합니다.
