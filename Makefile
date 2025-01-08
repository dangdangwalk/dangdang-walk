all:
	cat ./Makefile

local-mysql:
	docker run -d --name local-mysql --platform linux/amd64 -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=dangdangwalk mysql:8.4.0 \
    --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

local-mysql-e2e:
	docker run -d --name local-mysql --platform linux/amd64 -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=test mysql:8.4.0 \
    --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

local-redis:
	docker run -d --name local-redis --platform linux/amd64 -p 6379:6379 \
	redis:7.0.15 redis-server

docker-build-server:
	docker-compose -f docker-compose-dev.yml --profile server up -d --build

docker-down-server:
	docker-compose -f docker-compose-dev.yml --profile server down

docker-build-weather:
	docker-compose -f docker-compose-dev.yml --profile weather up -d --build

docker-down--weather:
	docker-compose -f docker-compose-dev.yml --profile weather down

front-start:
	cd ./frontend && \
	npm run dev

backend-start:
	cd ./backend/server && \
	npm run start
