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

docker-build:
	cd ./backend/server && \
	docker-compose -f docker-compose-dev.yml build

docker-up:
	cd ./backend/server && \
	docker-compose -f docker-compose-dev.yml up

docker-down:
	cd ./backend/server && \
	docker-compose -f docker-compose-dev.yml down

front-start:
	cd ./frontend && \
	npm run dev

backend-start:
	cd ./backend/server && \
	npm run start
