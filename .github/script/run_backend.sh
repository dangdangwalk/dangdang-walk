#!/bin/bash

# Constants
ROOT_PATH="/home/ubuntu/actions-runner/_work/dangdang-walk/dangdang-walk/backend/server"

# Variables
TAG=$1
ENV_FILE=$2
REPO=$3
IMAGE=$4

CONTAINER_IMAGE="$REPO/$IMAGE:$TAG"
ENV_FILE_PATH="$ROOT_PATH/$ENV_FILE"

# Print debug information
echo "CONTAINER IMAGE: $CONTAINER_IMAGE"
echo "ENV FILE PATH: $ENV_FILE_PATH"

# AWS ECR Login
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "$REPO"

# Helper Functions
stop_and_remove_container() {
  local container_name=$1
  echo "Stopping and removing container: $container_name"
  docker stop "$container_name" 2>/dev/null && docker rm "$container_name" 2>/dev/null
}

run_and_health_check_container() {
  local container_name=$1
  local port=$2
  echo "Running container: $container_name on port: $port"
  docker run -d --name "$container_name" --restart always -p "$port":3031 --env-file "$ENV_FILE_PATH" -v logs:/app/log "$CONTAINER_IMAGE"

  echo "Starting health check on port: $port"
  while true; do
    sleep 3
    if curl -s http://localhost:"$port" > /dev/null; then
      echo "Health check successful on port: $port"
      break
    fi
  done
}

deploy_container() {
  local container_name=$1
  local port=$2
  log_info "Deploying $container_name on port $port..."
  stop_and_remove_container "$container_name"
  docker pull "$CONTAINER_IMAGE"
  run_and_health_check_container "$container_name" "$port"
}

reload_nginx() {
  echo "Reloading Nginx"
  sudo nginx -s reload
}

# Main Deployment Logic
IS_BLUE_RUNNING=$(docker inspect -f '{{.State.Status}}' dangdang-api-blue 2>/dev/null | grep running)
echo "Blue container running: $IS_BLUE_RUNNING"

if [ -z "$TAG" ]; then
  echo "ERROR: Image tag argument is missing."
  exit 1
fi

if [ -n "$IS_BLUE_RUNNING" ]; then
  echo "Switching to Green container..."
  deploy_container "dangdang-api-green" 3031
  reload_nginx
  stop_and_remove_container "dangdang-api-blue"
else
  echo "Switching to Blue container..."
  deploy_container "dangdang-api-blue" 3032
  reload_nginx
  stop_and_remove_container "dangdang-api-green"
fi

# Cleanup unused Docker images
echo "Pruning unused images"
docker image prune -af
