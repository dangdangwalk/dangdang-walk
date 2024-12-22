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

# Logger Functions
log_debug() { echo -e "\033[1;36m[DEBUG]\033[0m $1"; }
log_info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
log_error() { echo -e "\033[1;31m[ERROR]\033[0m $1" >&2; }

# Input Validation
validate_deployment_args() {
  if [ -z "$TAG" ]; then
    log_error "Image tag argument is missing."
    exit 1
  fi
  log_info "Deployment arguments validated."
}

# AWS ECR Authentication
authenticate_to_ecr() {
  log_info "Authenticating with AWS ECR..."
  aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "$REPO"
}

# Docker Container Management
cleanup_container() {
  local container_name=$1
  log_info "Cleaning up container: $container_name"
  docker stop "$container_name" 2>/dev/null && docker rm "$container_name" 2>/dev/null
}

deploy_new_container() {
  local container_name=$1
  local port=$2
  log_info "Deploying container: $container_name on port: $port"
  docker run -d \
    --name "$container_name" \
    --restart always \
    -p "$port":3031 \
    --env-file "$ENV_FILE_PATH" \
    -v logs:/app/log \
    "$CONTAINER_IMAGE"
  verify_container_health "$port"
}

verify_container_health() {
  local port=$1
  local max_retries=10
  local retries=0

  log_info "Verifying container health on port: $port"

  while [ $retries -lt $max_retries ]; do
    sleep 3
    if curl -s http://localhost:"$port" > /dev/null; then
      log_success "Container health check passed on port: $port"
      return 0
    fi
    retries=$((retries + 1))
    log_info "Retrying health check... ($retries/$max_retries)"
  done

  log_error "Health check failed after $max_retries attempts."
  exit 1
}

perform_deployment() {
  local container_name=$1
  local port=$2
  log_info "Starting deployment for $container_name on port $port..."
  cleanup_container "$container_name"
  docker pull "$CONTAINER_IMAGE"
  deploy_new_container "$container_name" "$port"
}

reload_nginx() {
  log_info "Reloading Nginx..."
  if ! sudo nginx -s reload; then
    log_error "Failed to reload Nginx."
    exit 1
  fi
  log_success "Nginx reloaded successfully."
}

# Blue-Green Deployment Functions
activate_blue_deployment() {
  perform_deployment "dangdang-api-blue" 3032
  reload_nginx
  cleanup_container "dangdang-api-green"
}

activate_green_deployment() {
  perform_deployment "dangdang-api-green" 3031
  reload_nginx
  cleanup_container "dangdang-api-blue"
}

# Main Execution
main() {
  log_debug "Target Container Image: $CONTAINER_IMAGE"
  log_debug "Environment File Path: $ENV_FILE_PATH"

  validate_deployment_args
  authenticate_to_ecr

  log_info "Checking deployment status..."
  BLUE_CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' dangdang-api-blue 2>/dev/null)
  GREEN_CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' dangdang-api-green 2>/dev/null)

  if [ "$BLUE_CONTAINER_STATUS" == "running" ]; then
    log_info "Active: Blue container - Switching to Green deployment..."
    activate_green_deployment
  elif [ "$GREEN_CONTAINER_STATUS" == "running" ]; then
    log_info "Active: Green container - Switching to Blue deployment..."
    activate_blue_deployment
  else
    log_info "No active deployment found - Initiating Blue deployment..."
    activate_blue_deployment
  fi

  log_info "Cleaning up unused Docker images..."
  docker image prune -af
  log_success "Deployment completed successfully!"
}

main
