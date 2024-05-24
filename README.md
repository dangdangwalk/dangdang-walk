<p align="center">
  <img src="https://github.com/jihwooon/dangdang-walk/assets/68071599/0426836a-8b79-453d-b57e-6dcc1d23f8d6">
</p>

<p align="center"> 견주와 반려견이 함께 산책을 통해 건강을 관리하자 “DangDangWalk App” ​입니다. <p/>
<br><br>

# **프로젝트 소개**

### 구성원

|이름|포지션|Github|
|------|------|------|
|이길영|FrontEnd|https://github.com/supremgy|
|이준형|FrontEnd|https://github.com/goddls123|
|이민철|FrontEnd|https://github.com/autroshot|
|조안나|BackEnd|https://github.com/opehn|
|황재경|BackEnd|https://github.com/do0ori|
|안지환|BackEnd|https://github.com/jihwooon|


### 주요 키워드
1. Blue/Green 무중단 배포
    - AWS EC2 자원은 할당량이 1대 책정됨
    - 때문에 안정적인 배포를 위해서 무중단 배포를 구축
    - 롤백과 이력 관리가 쉬운 Blue/Green 무중단 배포 전략을 사용함
2. Auth 인증/인가
    - 복잡한 회원 절차를 간소화
    - 소셜 로그인 Auth 인증/인가 도입
3. 산책 기능
    - KaKao Map 산책 기능 활용
    - 유저 위치 정보에 따라 지도 위도/경도 계산
    - 따라서 유저 산책 경로를 지도로 표시됨
<br><br>

# 아키텍쳐

![아키텍처](https://github.com/jihwooon/dangdang-walk/assets/68071599/96568db5-1ea5-4f4d-a2df-b5eaa432a250)

<br><br>

# 기술스택
![기술스택](https://github.com/jihwooon/dangdang-walk/assets/68071599/ed253a68-0050-4589-8e58-125c09cd3d12)

<br><br><br>

# ERD
<img width="1143" alt="ERD" src="https://github.com/jihwooon/dangdang-walk/assets/68071599/fd0fa903-af82-422d-98d6-33bce77e276d">

<br><br><br>
# **기술적인 도전 및 트러블 슈팅**
자세한 내용을 확인 하고 싶으시면, [Trouble Shooting](https://www.notion.so/do0ori/946c5f068b79446b85ba2ab5a040822a?v=9d5e009c22aa46c5adb7328be7419155&pvs=4)를 참조 하시면 됩니다.

### Docker Multi-stage 빌드 최적화 하기
```
💥 문제 상황
   - Docker Build 시 번들 크기 사이즈를 줄일 필요가 있습니다. 그렇지만 배포 환경에 따라 Build 시점을 정하기가 어렵습니다.

✅ 해결 방안
   1. Docker 가상 컨테이너를 활용하여 일관된 실행 환경을 제공합니다.
   2. Multi-stage 빌드를 사용하여 개발 환경(Dev), 빌드 환경(Build), 프로덕션 환경(Prod)으로 단계를 구분합니다.
      - Dev 단계: 모든 의존성 라이브러리를 설치합니다.
      - Build 단계: 최소한의 크기로 빌드를 컴파일하고, 개발 환경에서 설치한 의존성을 복사하며, 로그 폴더를 생성합니다.
      - Prod 단계: 소스 코드를 컴파일하고 최소한의 자산을 생성합니다. 
        개발 단계와 동일한 기본 이미지와 모범 사례를 사용하며, 프로덕션 전용 의존성을 설치하고 캐시를 정리하여 번들 크기를 최소화합니다.
   3. 이를 통해 개발 환경, 빌드 환경, 프로덕션 환경에 맞는 최적화된 Docker 이미지를 생성할 수 있습니다.
```

<br>

### 배포 환경에서 Cookie 사용하기
```
💥 문제 상황
   - 로그인 요청 시 회원이 아니면 OAuth 관련 데이터(oauthAccessToken, oauthRefreshToken, oauthId, provider)를 쿠키에 저장해두고, 
     이후 회원가입 요청 시 OauthDataGuard에서 해당 쿠키를 가져와 회원가입 로직에서 사용하게 된다. 
     그런데 배포 환경에서 쿠키가 가져와지지 않는 오류가 발생했습니다.

   1. 로컬 환경과 배포 환경을 비교해본 결과, 배포 환경에서는 클라이언트와 서버가 다른 도메인(cross-site)에 있음을 확인했습니다.
   2. 사이트 간 요청과 함께 쿠키가 전송될지를 제어하는 쿠키의 속성은 `SameSite`입니다.
   3. `SameSite` 속성을 별도로 설정하지 않으면 기본값은 `Lax`이다. `Lax`는 같은 사이트 요청일 때만 쿠키를 전송하고, 
       cross-site 요청에는 전송하지 않습니다.
   4. Cross-site 요청에서도 쿠키를 보내려면 `SameSite` 속성을 `None`으로 설정해야 하며, 
      이 경우 HTTPS 통신일 때만 쿠키를 전송하도록 하는 `Secure` 옵션도 `true`여야 합니다.

✅ 해결 방안
private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: this.isProduction ? 'none' : 'lax',
    secure: this.isProduction,
    ⁝
};
- 쿠키 옵션을 배포 환경일 때에는 `SameSite=None`, `Secure=true`로 설정하여 cross-site 요청에서도 쿠키가 전송되도록 
  수정하여 해결 할 수 있었습니다.
```
<br>

### 로그인 상태 관리 캐싱 문제하기
```
💥 문제 상황
가입된 상태(한 번이라도 로그인한 사람)에서 OAuth 로그인 → 로그아웃 → OAuth 로그인 버튼 클릭 → 동의화면에서 
뒤로가기 했을 때 `isLoggedIn` 상태가 `true`인 상태가 되는 문제가 발생했다.

문제의 원인은 `bfcache`(Back-Forward Cache)였다. 

`getAccessToken` API의 응답 성공 여부에 따라 `isLoggedIn` 상태를 결정하고 있었는데, 
로그아웃 후에도 `bfcache`에 의해 이전에 캐시된 `isLoggedIn=true` 상태가 복원되어 문제가 발생했다.

✅ 해결 방안
1. `bfcache`를 방지하기 위해 `getAccessToken` API의 헤더에 `Cache-control: no-store` 옵션을 추가하거나, 
   `bfcache` 방지 기법을 적용할 수 있다.
2. 결국, 서버에서 `httpOnly=false`인 `'isLoggedIn': true`를 쿠키에 담아 클라이언트에게 넘겨주고, 
   클라이언트는 이 쿠키에서 `isLoggedIn` 상태를 가져와 전역 상태로 관리하는 방식으로 문제를 해결했다.
3. 서버에서 넘겨받은 쿠키는 `bfcache`에 해당되지 않아 재복원되지 않았기 때문에 이 방식으로 해결할 수 있었다.

요약하면, `bfcache` 문제를 인식하고 해당 캐시를 회피하거나 방지하는 방식, 
또는 서버에서 전달한 쿠키 값을 사용하여 로그인 상태를 관리하는 방식으로 문제를 해결했다.
```
