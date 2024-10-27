# 빌드 스테이지
FROM rust:latest AS builder

# 빌드 디렉터리 설정
WORKDIR /usr/src/app

# Cargo.toml과 프로젝트 소스를 복사
COPY Cargo.toml .
COPY src ./src

# 프로젝트 빌드
RUN cargo build --release

# 릴리스 이미지 생성
FROM ubuntu:22.04

# GLIBC 문제 해결을 위해 필수 패키지 업데이트
RUN apt-get update && apt-get install -y libc6

# 필요한 파일들 복사
COPY --from=builder /usr/src/app/target/release/auth_service /usr/local/bin/auth_service

# Actix Web 포트 노출
EXPOSE 8080

# Actix Web 실행 (실행 파일 이름과 일치하게 설정)
CMD ["auth_service"]