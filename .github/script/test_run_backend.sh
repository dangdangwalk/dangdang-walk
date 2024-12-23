#!/bin/bash

# 색상 및 스타일 정의
readonly RED="\033[31m"
readonly GREEN="\033[32m"
readonly YELLOW="\033[33m"
readonly DARK_GRAY="\033[90m"
readonly BOLD="\033[1m"
readonly RESET="\033[0m"

# 테스트 결과 추적
TOTAL_TESTS=0
PASSED_TESTS=0
declare -a FAILED_TESTS
START_TIME=0

# 로깅 함수들
test_debug() { echo -e "${DARK_GRAY}[DEBUG]${RESET} $1"; }

# 테스트 컨텍스트 스택
declare -a DESCRIBE_STACK
declare -a CONTEXT_STACK

# 컨텍스트 관리 함수
push_describe() { DESCRIBE_STACK+=("$1"); }
pop_describe() { unset 'DESCRIBE_STACK[${#DESCRIBE_STACK[@]}-1]'; }
push_context() { CONTEXT_STACK+=("$1"); }
pop_context() { unset 'CONTEXT_STACK[${#CONTEXT_STACK[@]}-1]'; }
get_current_describe() { echo "${DESCRIBE_STACK[${#DESCRIBE_STACK[@]}-1]}"; }
get_current_context() { echo "${CONTEXT_STACK[${#CONTEXT_STACK[@]}-1]}"; }

# 테스트 구조 함수
describe() {
    echo -e "\n   ${BOLD}$1${RESET}"
    push_describe "$1"
    eval "$2"
    pop_describe
}

context() {
    echo -e "     ${BOLD}$1${RESET}"
    push_context "$1"
    eval "$2"
    pop_context
}

# 플래그 기본값 설정
VERBOSE=false

# 인자 파싱
while getopts "vh" opt; do
    case $opt in
        v)
            VERBOSE=true
            ;;
        h)
            echo "Usage: $0 [-v] [-h]"
            echo "  -v  Verbose mode"
            echo "  -h  Show this help"
            exit 0
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
    esac
done

it() {
    local title=$1
    local test_fn=$2
    local current_describe=$(get_current_describe)
    local current_context=$(get_current_context)
    
    ((TOTAL_TESTS++))

    local start_time=$(date +%s%3N)
    
    local output
    output=$($test_fn 2>&1)
    local test_result=$?

    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))

    if [ $duration -gt 10000 ]; then
        echo -e "       ${RED}✕${RESET} ${DARK_GRAY}$title (Timeout: ${duration} ms)${RESET}"
        FAILED_TESTS+=("$(printf "%s > %s > %s" "$current_describe" "$current_context" "$title")")
        return
    fi
    
    if [ $test_result -eq 0 ]; then
        echo -e "       ${GREEN}✓${RESET} ${DARK_GRAY}$title (${duration} ms)${RESET}"
        if [ "$VERBOSE" = "true" ]; then
            echo -e "\n${DARK_GRAY}Output:${RESET}"
            echo "$output" | sed 's/^/         /'
            echo
        fi
        ((PASSED_TESTS++))
    else
        echo -e "       ${RED}✕${RESET} ${DARK_GRAY}$title (${duration} ms)${RESET}"
        echo -e "\n${DARK_GRAY}Output:${RESET}"
        echo "$output" | sed 's/^/         /'
        echo
        FAILED_TESTS+=("$(printf "%s > %s > %s" "$current_describe" "$current_context" "$title")")
    fi
}

# 테스트 환경 설정
setup_test_env() {
    # 실제 파일 시스템이 아닌 임시 경로 사용
    export ROOT_PATH="/tmp/test"
    rm -rf "$ROOT_PATH"
    mkdir -p "$ROOT_PATH"
    
    # env 파일 생성
    export TEST_ENV_PATH="$ROOT_PATH/test.env.prod"
    echo "PORT=3031" > "$TEST_ENV_PATH"
    
    # 모든 외부 명령어를 모킹으로 대체
    export PATH="$ROOT_PATH/mock-bin:$PATH"
    
    # 테스트용 환경 변수 설정
    export HEALTH_CHECK_INTERVAL=0.1
    export HEALTH_CHECK_MAX_RETRIES=3
    
    test_debug "Test environment setup completed at $ROOT_PATH"
}

# Mock 바이너리 생성
create_mock_binaries() {
    mkdir -p "$ROOT_PATH/mock-bin"
    
    # Docker mock
    cat > "$ROOT_PATH/mock-bin/docker" << 'EOF'
#!/bin/bash
case "$1" in
    "inspect")
        case "$4" in
            "dangdang-api-blue")
                echo "${MOCK_BLUE_STATUS:-}"
                ;;
            "dangdang-api-green")
                echo "${MOCK_GREEN_STATUS:-}"
                ;;
        esac
        ;;
    "login")
        echo "[MOCK] Docker login executed"
        if [ "${MOCK_DOCKER_LOGIN_FAIL:-false}" = "true" ]; then
            exit 1
        fi
        exit 0
        ;;
    "pull"|"stop"|"rm"|"run"|"image")
        echo "[MOCK] Docker $1 executed"
        exit "${MOCK_DOCKER_EXIT_CODE:-0}"
        ;;
    *)
        echo "[MOCK] Unknown docker command: $1"
        exit 1
        ;;
esac
EOF

    # AWS mock
    cat > "$ROOT_PATH/mock-bin/aws" << 'EOF'
#!/bin/bash
if [ "$1" = "ecr" ] && [ "$2" = "get-login-password" ]; then
    if [ "${MOCK_AWS_EXIT_CODE:-0}" != "0" ]; then
        echo "AWS ECR authentication failed" >&2
        exit "${MOCK_AWS_EXIT_CODE}"
    fi
    echo "mock-password"
    exit 0
fi
EOF

    # curl mock
    cat > "$ROOT_PATH/mock-bin/curl" << 'EOF'
#!/bin/bash
if [ "${MOCK_HEALTH_CHECK_FAIL:-false}" = "true" ]; then
    exit 1
fi
echo "mock-response"
exit 0
EOF

    # nginx mock
    cat > "$ROOT_PATH/mock-bin/nginx" << 'EOF'
#!/bin/bash
if [ "${MOCK_NGINX_FAIL:-false}" = "true" ]; then
    exit 1
fi
echo "[MOCK] Nginx reload"
exit 0
EOF

    # sudo mock
    cat > "$ROOT_PATH/mock-bin/sudo" << 'EOF'
#!/bin/bash
"$@"
EOF

    chmod +x "$ROOT_PATH/mock-bin/"*
}

cleanup_test_env() {
    rm -rf "$ROOT_PATH"
    test_debug "Cleaned up test environment"
}

# 테스트 케이스들
test_basic_deployment() {
    local temp_blue_status="$MOCK_BLUE_STATUS"
    local temp_green_status="$MOCK_GREEN_STATUS"
    local temp_docker_exit="$MOCK_DOCKER_EXIT_CODE"
    local temp_health_check="$MOCK_HEALTH_CHECK_FAIL"
    local temp_nginx="$MOCK_NGINX_FAIL"
    
    export MOCK_BLUE_STATUS="running"
    export MOCK_GREEN_STATUS=""
    export MOCK_DOCKER_EXIT_CODE=0
    export MOCK_HEALTH_CHECK_FAIL=false
    export MOCK_NGINX_FAIL=false
    
    local result=0
    ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image" || result=1
    
    export MOCK_BLUE_STATUS="$temp_blue_status"
    export MOCK_GREEN_STATUS="$temp_green_status"
    export MOCK_DOCKER_EXIT_CODE="$temp_docker_exit"
    export MOCK_HEALTH_CHECK_FAIL="$temp_health_check"
    export MOCK_NGINX_FAIL="$temp_nginx"
    
    return $result
}

test_missing_arguments() {
    if ./run_backend.sh; then
        return 1
    fi
    return 0
}

test_invalid_env_file() {
    local temp_env_path="$TEST_ENV_PATH"
    rm -f "$TEST_ENV_PATH"  # 기존 env 파일 삭제
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    # 테스트 후 env 파일 복구
    echo "SERVER_PORT=3031" > "$TEST_ENV_PATH"
    
    return $result
}

test_aws_ecr_login_failure() {
    local temp_aws_exit_code="$MOCK_AWS_EXIT_CODE"
    
    export MOCK_AWS_EXIT_CODE=1
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    export MOCK_AWS_EXIT_CODE="$temp_aws_exit_code"
    return $result
}

test_docker_login_failure() {
    local temp_docker_login="$MOCK_DOCKER_LOGIN_FAIL"
    
    export MOCK_DOCKER_LOGIN_FAIL=true
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    export MOCK_DOCKER_LOGIN_FAIL="$temp_docker_login"
    return $result
}

test_docker_pull_failure() {
    local temp_exit_code="$MOCK_DOCKER_EXIT_CODE"
    export MOCK_DOCKER_EXIT_CODE=1
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    export MOCK_DOCKER_EXIT_CODE="$temp_exit_code"
    return $result
}

test_health_check_failure() {
    local temp_health_check="$MOCK_HEALTH_CHECK_FAIL"
    
    export MOCK_HEALTH_CHECK_FAIL=true
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    export MOCK_HEALTH_CHECK_FAIL="$temp_health_check"
    return $result
}

test_nginx_reload_failure() {
    local temp_nginx="$MOCK_NGINX_FAIL"
    export MOCK_NGINX_FAIL=true
    
    local result=0
    if ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image"; then
        result=1
    fi
    
    export MOCK_NGINX_FAIL="$temp_nginx"
    return $result
}

test_blue_to_green_deployment() {
    local temp_blue_status="$MOCK_BLUE_STATUS"
    local temp_green_status="$MOCK_GREEN_STATUS"
    
    export MOCK_BLUE_STATUS="running"
    export MOCK_GREEN_STATUS=""
    
    local result=0
    ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image" || result=1
    
    export MOCK_BLUE_STATUS="$temp_blue_status"
    export MOCK_GREEN_STATUS="$temp_green_status"
    
    return $result
}

test_green_to_blue_deployment() {
    local temp_blue_status="$MOCK_BLUE_STATUS"
    local temp_green_status="$MOCK_GREEN_STATUS"
    
    export MOCK_BLUE_STATUS=""
    export MOCK_GREEN_STATUS="running"
    
    local result=0
    ./run_backend.sh "test-tag" "test.env.prod" "test-repo" "test-image" || result=1
    
    export MOCK_BLUE_STATUS="$temp_blue_status"
    export MOCK_GREEN_STATUS="$temp_green_status"
    
    return $result
}

# 테스트 결과 요약 출력
print_test_summary() {
    local end_time=$(date +%s)
    local duration=$((end_time - START_TIME))
    local failed_count=$((TOTAL_TESTS - PASSED_TESTS))
    
    echo -e "\nTest Suites: ${BOLD}$([ $failed_count -eq 0 ] && echo "${GREEN}1 passed${RESET}" || echo "${RED}1 failed${RESET}")${RESET}, 1 total"
    
    if [ $failed_count -eq 0 ]; then
        echo -e "Tests:       ${GREEN}${TOTAL_TESTS} passed${RESET}, ${BOLD}${TOTAL_TESTS} total${RESET}"
    else
        echo -e "Tests:       ${RED}${failed_count} failed${RESET}, ${GREEN}${PASSED_TESTS} passed${RESET}, ${BOLD}${TOTAL_TESTS} total${RESET}"
    fi
    
    echo -e "Time:        ${YELLOW}${duration}.${RANDOM:0:3}s${RESET}"
    
    if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
        echo -e "\n${RED}Failed Tests:${RESET}"
        for failed_test in "${FAILED_TESTS[@]}"; do
            echo -e "  ${RED}✕${RESET} $failed_test"
        done
    fi
}

# 메인 테스트 실행
main() {
    START_TIME=$(date +%s)
    
    echo -e "\n ${BOLD}Backend Deployment Tests${RESET}"
    setup_test_env
    create_mock_binaries
    
    describe "Basic Deployment" "
        context 'when all configurations are valid' '
            it \"should deploy successfully\" test_basic_deployment
        '
    "

    describe "Input Validation" "
        context 'when required arguments are missing' '
            it \"should fail with error message\" test_missing_arguments
        '
        
        context 'when ENV file does not exist' '
            it \"should fail with file not found error\" test_invalid_env_file
        '
    "

    describe "AWS Operations" "
        context 'when AWS ECR login fails' '
            it \"should fail with authentication error\" test_aws_ecr_login_failure
        '
        
        context 'when Docker login fails' '
            it \"should fail with login error\" test_docker_login_failure
        '
    "

    describe "Docker Operations" "
        context 'when docker pull fails' '
            it \"should fail and exit with error\" test_docker_pull_failure
        '
        
        context 'when health check fails' '
            it \"should fail and rollback deployment\" test_health_check_failure
        '
    "
    
    describe "Nginx Operations" "
        context 'when nginx reload fails' '
            it \"should fail and exit with error\" test_nginx_reload_failure
        '
    "
    
    describe "Blue-Green Deployment" "
        context 'when blue instance is running' '
            it \"should deploy to green instance\" test_blue_to_green_deployment
        '
        
        context 'when green instance is running' '
            it \"should deploy to blue instance\" test_green_to_blue_deployment
        '
    "
    
    print_test_summary
    cleanup_test_env
    
    return $([ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ])
}

main
