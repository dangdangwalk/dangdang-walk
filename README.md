# DangDang-walk
이는 프로젝트 애플리케이션용 REST API입니다.

## Tech Stack
- Next: 14.2.2
- Nest: 10.3.0
- MySQL:8.0.22
- Npm: 9.6.7
- Node: 18.17.1

## Getting Started
- 해당 Repository에서 프로젝트를 복제합니다.
- `front` 와 `backend` 각 폴더에 실행방법은 다음과 같습니다.
  - front
    - `npm install` 명령어를 입력하여 의존성 패키지를 다운 받습니다.
    - `npm run dev` 명령어로 Next.js Dev 모드를 실행합니다. - `npm run build` 명령어로 Next.js를 빌드합니다.
    - `npm run start` 명령어로 production server를 실행합니다.
    - `npm run lint` 명령어로 ESLint를 설정합니다.
  - backend
    - `npm run start` 명령어를 입력하여 local 환경 Nest.js를 실행합니다.
    - `npm run start:dev` 명령어를 입력하여 dev 환경 Nest.js를 실행합니다.
    - `npm run start:prod` 명령어를 입력하여 prod 환경 Nest.js를 실행합니다.
    - `npm run test` 명령어를 입력하여 Nest.js 테스트를 실행합니다.
    - `npm run test:e2e` 명령어를 입력하여 Nest.js e2e 테스트를 실행합니다.

## Database Setting
### **Local Environment**  
  로컬 개발 시 Mariadb 데이터베이스를 사용합니다.  
  Mariadb은 Docker를 실행해야 사용 할 수 있습니다.

1. `.env.local` 파일을 backend 폴더에 생성합니다.
2. env 파일 내에 다음과 같은 내용을 추가합니다.
    ```yaml
    MYSQL_HOST=local # 호스트 명에 따라 이름을 변경해줍니다.
    MYSQL_DATABASE=test
    MYSQL_ROOT_USER=root
    MYSQL_ROOT_PASSWORD=root
    MYSQL_PORT=3306 # 기본 포트 3306
    ```
3. Docker mariadb 이미지를 다운 받습니다.
   ```shell
   docker run -d --name local-mariadb -p 5001:3306 \
   -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=test mariadb \
   --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
   ```  
4. Nest.js를 실행합니다.

### **Dev Environment**  
Dev 개발 시 Dockerfile를 build를 해야 합니다.

1. backend 폴더 내 `.env.dev` 파일을 생성합니다.
2. `.env.dev` 파일 내에 Local 환경에 설정값과 동일하게 추가합니다.
   - MYSQL_HOST는 docker-compose 내에 데이터베이스 호스트명과 동일하게 변경해야합니다.  
     ex) `db -> MYSQL_HOST=db`, `dev-db -> MYSQL_HOST=dev-db`
3. Root 폴더에 `docker-compose-dev.yml`를 Build 실행합니다.
    ```shell
   docker-compose -f docker-compose-dev.yml build
    ```
4. Build 완료 시 docker-compose를 실행합니다.
    ```shell
    docker-compose -f docker-compose-dev.yml up 
    ```

### **Monitoring Environment**
Monitoring를 사용하기 위해서는 Prometheus와 Grafana를 실행해야 합니다.

1. `docker-compose -f docker-compose-dev.yml up` 를 실행합니다.
2. Grafana Port를 입력하여 접속합니다.
3. Grafana 로그인 접속 시 초기 접속 번호는 admin 입니다.
4. 메뉴 바에 Connections 클릭하고 Prometheus를 추가해줍니다.
5. `Add new data source`를 클릭합니다.
6. Connection에 URL 에 `prometheus:{Grafana Port}`를 입력해줍니다.
7. Save& test 버튼을 클릭하여 저장합니다.
