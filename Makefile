all:
	cat. ./Makefile

local-mariadb:
	docker run -d --name local-mariadb -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=dangdangwalk mariadb \
    --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

docker-build:
	docker-compose -f docker-compose-dev.yml build

docker-up:
	docker-compose -f docker-compose-dev.yml up

docker-down:
	docker-compose -f docker-compose-dev.yml down

front-start:
	cd ./frontend && \
	npm run dev

backend-start:
	cd ./backend && \
	npm run start
