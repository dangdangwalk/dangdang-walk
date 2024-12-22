#!/bin/bash

TAG=$1
ENV_FILE=$2
REPO=$3
IMAGE=$4
ENV_PATH="/home/ubuntu/actions-runner/_work/dangdang-walk/dangdang-walk/backend/server"
FILE_PATH="$ENV_PATH/$ENV_FILE"


echo"TAG: "
echo $TAG

echo "ENV_FILE: "
echo $ENV_FILE

echo "REPO: "
echo $REPO

echo "IMAGE: "
echo $IMAGE

echo"FILE PATH: "
echo $FILE_PATH

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "$REPO"

IS_BLUE_RUNNING=$(docker inspect -f '{{.State.Status}}' dangdang-api-blue | grep running)
echo "Blue : "
echo "$IS_BLUE_RUNNING"

if [ -z "$TAG" ]; then
  echo "ERROR: Image tag argument is missing."
  exit 1
fi

if [ -n "$IS_BLUE_RUNNING" ]; then
  echo "Green 배포를 시작합니다."

  docker stop dangdang-api-green && docker rm dangdang-api-green
  docker pull "$REPO"/"$IMAGE":"$TAG"

  docker run -d --name dangdang-api-green --restart always -p 3031:3031 --env-file "$FILE_PATH" -v logs:/app/log "$REPO"/"$IMAGE":"$TAG"

  while [ 1 = 1 ]; do
    echo "Green Health check를 시작합니다."
  sleep 3

  REQUEST=$(curl http://localhost:3031)
    if [ -n "$REQUEST" ]; then
      echo "Green Health check 성공했습니다."
      break ;
    fi
  done;

  echo "Nginx를 재시작합니다."
  sudo nginx -s reload

  echo "Blue Container 종료합니다."
  docker stop dangdang-api-blue

  echo "Green 배포를 성공적으로 종료합니다."
else
   echo "Green : running"
   echo "Blue 배포를 시작합니다."

   docker stop dangdang-api-blue && docker rm dangdang-api-blue
   docker pull "$REPO"/"$IMAGE":"$TAG"
   docker run -d --name dangdang-api-blue --restart always -p 3032:3031 --env-file "$FILE_PATH" -v logs:/app/log "$REPO"/"$IMAGE":"$TAG"

   while [ 1 = 1 ]; do
     echo "Blue Health check를 시작합니다."
     sleep 3

   REQUEST=$(curl http://localhost:3032)
     if [ -n "$REQUEST" ]; then
       echo "Blue Health check 성공했습니다."
       break ;
     fi
       done;

     echo "Nginx를 재시작합니다."
     sudo nginx -s reload

     echo "Green Container ��료합니다."
     docker stop dangdang-api-green

     echo "Blue 배포를 성공적으로 종료합니다."
fi

sleep 3

echo "이전 이미지를 삭제합니다."
docker image prune -af
