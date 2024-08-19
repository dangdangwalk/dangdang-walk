<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# 댕댕워크 Backend 시작하기

이 프로젝트는 Node.js 프레임워크인 [NestJS](https://github.com/nestjs/nest)를 기반으로 구축된 백엔드 애플리케이션입니다. NestJS는 효율적이고 확장 가능한 서버 사이드 애플리케이션 개발을 지원합니다.

## 0. 필수 준비 사항

프로젝트를 시작하기 전에 다음 두 가지 작업을 **반드시** 완료해야 합니다.

### 환경 설정 파일 생성

`.env.{환경}` 파일을 생성하고 아래 내용을 입력합니다.
<br>
각 항목의 값은 실제 발급받은 API 키 및 설정 값으로 변경해야 합니다.

```shell
PORT=3333
MYSQL_HOST=localhost
MYSQL_DATABASE=dangdangwalk
MYSQL_ROOT_USER=root
MYSQL_ROOT_PASSWORD=root
MYSQL_PORT=3306

GOOGLE_CLIENT_ID='구글 client api key'
GOOGLE_CLIENT_SECRET='구글 api secret key'
GOOGLE_TOKEN_API=https://oauth2.googleapis.com/token
GOOGLE_TOKEN_INFO_API=https://oauth2.googleapis.com/tokeninfo
GOOGLE_REVOKE_API=https://oauth2.googleapis.com/revoke

KAKAO_CLIENT_ID='카카오 client api key'
KAKAO_CLIENT_SECRET='카카오 secret key'
KAKAO_TOKEN_API=https://kauth.kakao.com/oauth/token
KAKAO_TOKEN_INFO_API=https://kapi.kakao.com/v1/user/access_token_info
KAKAO_LOGOUT_API=https://kapi.kakao.com/v1/user/logout
KAKAO_UNLINK_API=https://kapi.kakao.com/v1/user/unlink

NAVER_CLIENT_ID='네이버 client api key'
NAVER_CLIENT_SECRET='네이버 secret key'
NAVER_TOKEN_API=https://nid.naver.com/oauth2.0/token
NAVER_USER_INFO_API=https://openapi.naver.com/v1/nid/me

CORS_ORIGIN=http://localhost:3000
JWT_SECRET='JWT Secret key'

ACCESS_TOKEN_LIFETIME=1h
REFRESH_TOKEN_LIFETIME=14d
```

### API 키 발급

아래 링크를 참고하여 각 제조사별 API 키를 발급받아 `.env.{환경}` 파일에 입력합니다.

-   카카오 개발자: https://developers.kakao.com/
-   네이버 개발자: https://developers.naver.com/main/
-   구글 개발자: https://cloud.google.com/

※ **주의:** API 키 발급 및 환경 설정 파일 생성은 프로젝트 실행 전에 반드시 완료해야 하는 필수 절차입니다. 이 단계를 완료하지 않으면 프로젝트를 정상적으로 실행할 수 없습니다.

## 1. 프로젝트 실행하기

-   `.env.{환경}` 구성에 따라 env 파일을 생성합니다.
-   `backend` 폴더에서 실행방법은 다음과 같습니다.
    -   `npm run start` 명령어를 입력하여 local 환경 NestJS를 실행합니다.
    -   `npm run start:dev` 명령어를 입력하여 dev 환경 NestJS를 실행합니다.
    -   `npm run start:prod` 명령어를 입력하여 prod 환경 NestJS를 실행합니다.
    -   `npm run test` 명령어를 입력하여 NestJS 테스트를 실행합니다.
    -   `npm run test:e2e` 명령어를 입력하여 NestJS e2e 테스트를 실행합니다.

## 2. 데이터베이스 설정하기

로컬 개발 환경에서는 MySQL 데이터베이스를 사용합니다. MySQL을 사용하려면 Docker를 실행해야 합니다.

-   `backend` 폴더에 `.env.local` 파일을 생성합니다.
-   `.env.local` 파일 내에 다음과 같은 내용을 추가합니다.
    ```yaml
    MYSQL_HOST=local # 호스트 명에 따라 이름을 변경해줍니다.
    MYSQL_DATABASE=test
    MYSQL_ROOT_USER=root
    MYSQL_ROOT_PASSWORD=root
    MYSQL_PORT=3306 # 기본 포트 3306
    ```
-   Docker mysql 이미지를 다운 받습니다.
    ```shell
    docker run -d --name local-mysql --platform linux/amd64 -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=dangdangwalk mysql:8.4.0 \
    --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    ```
-   NestJS를 실행합니다.

이제 로컬 환경에서 NestJS 백엔드 애플리케이션과 MySQL 데이터베이스를 실행할 준비가 되었습니다.
