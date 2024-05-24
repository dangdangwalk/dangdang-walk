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
    - 복잡한 회원 절차를 쉽게 하기 위해서 소셜 Auth 인증 인가를 도입
    - 회원
3. Worker Thread
    - 전투연산 등 IO대비 CPU연산의 비중이 큰 작업들이 존재하며
      해당 작업들에 트래픽이 치중되는 상황이 예상
    - 따라서 멀티스레드 환경을 구성하여 메인 스레드에서는 IO처리에만 집중하고,
      전투연산 등의 작업은 Worker Thread에 할당하여 처리 
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
자세한 내용을 확인 하고 싶으시면, ▶️ [Wiki Documentation](https://www.notion.so/do0ori/946c5f068b79446b85ba2ab5a040822a?v=9d5e009c22aa46c5adb7328be7419155&pvs=4)를 참조 하시면 됩니다.

### Docker Multi-stage 빌드 최적화 하기
```
💥 문제 상황
   1. 프로젝트에서 NestJS(백엔드)와 React(프론트엔드)를 분리하여 개발하고 있으며, 서버와 클라이언트 간 통신을 확인할 필요가 있습니다.
   2. 각 개발자의 운영체제와 컴퓨팅 환경이 다르기 때문에 일관된 실행 환경을 보장하기 어렵습니다.
   3. 개발 환경과 프로덕션 환경에서 Docker 이미지 빌드 요구사항이 다릅니다.

✅ 해결 방안
   1. Docker 가상 컨테이너를 활용하여 일관된 실행 환경을 제공합니다.
   2. Multi-stage 빌드를 사용하여 개발 환경(Dev), 빌드 환경(Build), 프로덕션 환경(Prod)으로 단계를 구분합니다.
      - Dev 단계: 모든 의존성 라이브러리를 설치합니다.
      - Build 단계: 최소한의 크기로 빌드를 컴파일하고, 개발 환경에서 설치한 의존성을 복사하며, 로그 폴더를 생성합니다.
      - Prod 단계: 소스 코드를 컴파일하고 최소한의 자산을 생성합니다. 개발 단계와 동일한 기본 이미지와 모범 사례를 사용하며, 프로덕션 전용 의존성을 설치하고 캐시를 정리하여 번들 크기를 최소화합니다.
   3. 이를 통해 개발 환경, 빌드 환경, 프로덕션 환경에 맞는 최적화된 Docker 이미지를 생성할 수 있습니다.
```

<br>

### 배포 환경에서 Cookie 사용하기
```
💥 문제 상황
- 로그인 요청 시 회원이 아니면 OAuth 관련 데이터(oauthAccessToken, oauthRefreshToken, oauthId, provider)를 쿠키에 저장해두고, 이후 회원가입 요청 시 OauthDataGuard에서 해당 쿠키를 가져와 회원가입 로직에서 사용하게 된다. 그런데 배포 환경에서 쿠키가 가져와지지 않는 오류가 발생했습니다.
   1. 로컬 환경과 배포 환경을 비교해본 결과, 배포 환경에서는 클라이언트와 서버가 다른 도메인(cross-site)에 있음을 확인했습니다.
   2. 사이트 간 요청과 함께 쿠키가 전송될지를 제어하는 쿠키의 속성은 `SameSite`입니다.
   3. `SameSite` 속성을 별도로 설정하지 않으면 기본값은 `Lax`이다. `Lax`는 같은 사이트 요청일 때만 쿠키를 전송하고, cross-site 요청에는 전송하지 않습니다.
   4. Cross-site 요청에서도 쿠키를 보내려면 `SameSite` 속성을 `None`으로 설정해야 하며, 이 경우 HTTPS 통신일 때만 쿠키를 전송하도록 하는 `Secure` 옵션도 `true`여야 합니다.

✅ 해결 방안
private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: this.isProduction ? 'none' : 'lax',
    secure: this.isProduction,
    ⁝
};
- 쿠키 옵션을 배포 환경일 때에는 `SameSite=None`, `Secure=true`로 설정하여 cross-site 요청에서도 쿠키가 전송되도록 수정하여 해결 할 수 있었습니다.
```
<br>

### Git history 그래프 복잡성 해결하기

```
💥 문제 상황
- GitHub에서 여러 명이 동시에 PR을 생성하고 merge하는 과정에서 커밋 히스토리가 복잡하게 얽혔습니다.

✅ 해결 방안
1. git rebase -i -r <commit-hash> 명령어를 사용하여 인터렉티브 리베이스 모드로 진입합니다
2. 같은 색상의 밑줄은 동일한 커밋 내용을 나타냅니다.
3. 공백 줄로 나뉘어진 묶음이 PR 세트입니다.
   reset
   merge
   label
   commit
   commit
      ⁝
   commit
   label
4. 세트의 마지막 label이 다음 PR 세트의 merge와 동일해야 합니다.
5. 세트의 첫 label이 다음 PR 세트의 reset과 동일해야 합니다.
6. 이 규칙을 찾아 짝을 맞추면 된다. 보통 merge가 뭉쳐있으므로 순서대로 위치에 맞게 옮깁니다.
7. label이 없으면 임의로 만들어서 맞춰줍니다. (예: label b0)
8. vim 단축키 dd(잘라내기), p(붙여넣기)를 사용하여 순서를 조정합니다.
9. 정리된 히스토리를 main으로 force push 합니다ㅏ.

이 방식을 통해 꼬인 커밋 히스토리를 정리할 수 있습니다.
```

