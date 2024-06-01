<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://create-react-app.dev/img/logo.svg" width="200" alt="Nest Logo" /></a>
</p>

# 댕댕워크 Frontend 시작하기

이 프로젝트는 [Create React App](https://github.com/facebook/create-react-app)으로 부트스트랩되었습니다.

## 0. 필수 준비 사항

프로젝트를 시작하기 전에 다음 두 가지 작업을 **반드시** 완료해야 합니다.

### 환경 설정 파일 생성

`.env.{환경}` 파일을 생성하고 아래 내용을 입력합니다.
<br>
각 항목의 값은 실제 발급받은 API 키 및 설정 값으로 변경해야 합니다.

```shell
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_NEST_BASE_URL='서버 주소'

REACT_APP_WEATHER_URL=http://apis.data.go.kr
REACT_APP_WEATHER_KEY='공공데이터 api key'
REACT_APP_KAKAO_MAP_URL=https://dapi.kakao.com/v2/local

REACT_APP_KAKAO_CLIENT_ID='카카오 client api key'
REACT_APP_NAVER_CLIENT_ID='네이버 client api key'
REACT_APP_GOOGLE_CLIENT_ID='구글 client api key'

REACT_APP_KAKAO_MAP_ID='카카오 client api key'

REACT_APP_BASE_IMAGE_URL='이미지 서버 주소'
```

### API 키 발급

아래 링크를 참고하여 각 제조사별 API 키를 발급받아 `.env.{환경}` 파일에 입력합니다.

-   카카오 개발자: https://developers.kakao.com/
-   네이버 개발자: https://developers.naver.com/main/
-   구글 개발자: https://cloud.google.com/
-   공공 데이터: https://www.data.go.kr/

※ **주의:** API 키 발급 및 환경 설정 파일 생성은 프로젝트 실행 전에 반드시 완료해야 하는 필수 절차입니다. 이 단계를 완료하지 않으면 프로젝트를 정상적으로 실행할 수 없습니다.

## 1. 프로젝트 실행하기

-   `.env.{환경}` 구성에 따라 env 파일을 생성합니다.
-   `frontend` 폴더에서 실행방법은 다음과 같습니다.
    -   `npm run start` 명령어를 입력하여 local 환경 React.js를 실행합니다.
    -   `npm run start:dev` 명령어를 입력하여 dev 환경 React.js를 실행합니다.
    -   `npm run start:prod` 명령어를 입력하여 prod 환경 React.js를 실행합니다.
    -   `npm run test` 명령어를 입력하여 React.js 테스트를 실행합니다.
