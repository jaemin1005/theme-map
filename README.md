## 빌드 방법

> **주의:** 이 프로젝트에는 AWS 등 민감한 정보가 포함된 환경 변수가 필요합니다. 이러한 정보는 보안상 이유로 공개하지 않으며, 연락으로 요청 시에만 제공됩니다.

1. 러스트 설치
   - macOS
     ```bash
     # rust setup
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

     # path 설정
     source $HOME/.cargo/env

     # 설치 확인
     rustc --version
     cargo --version
     ```
   - Windows
     [Rust 설치 링크](https://forge.rust-lang.org/infra/other-installation-methods.html)

2. npm 설치
   - macOS 및 Windows 공통
     ```bash
     # npm 설치 (노드가 설치되어 있지 않은 경우)
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs

     # 설치 확인
     npm --version
     ```

3. 프로젝트 빌드
   
   ### 1. 프론트엔드 (web)
   ```bash
   # web 디렉토리로 이동
   cd web

   # 패키지 설치
   npm install

   # 개발 서버 실행
   npm run dev

   # 프로덕션 빌드
   npm run build
   npm start
   ```

   ### 2. 인증 서비스 (auth_service)
   ```bash
   # auth_service 디렉토리로 이동
   cd auth_service

   # 빌드 및 실행
   cargo run --release
   ```

   ### 3. 콘텐츠 서비스 (content_service)
   ```bash
   # content_management_service 디렉토리로 이동
   cd content_management_service

   # 빌드 및 실행
   cargo run --release
   ```

   ### 4. 업로드 서비스 (upload_service)
   ```bash
   # upload_service 디렉토리로 이동
   cd upload_service

   # 빌드 및 실행
   cargo run --release
   ```

