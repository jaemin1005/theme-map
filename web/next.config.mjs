/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["motoma.s3.amazonaws.com"], // 이곳에 S3 도메인을 추가합니다.
  },
  eslint: {
    // 빌드 중 ESLint 오류를 무시하고 계속 진행할지 여부 설정
    ignoreDuringBuilds: true,
  },
  env: {
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    CONTENT_SERVICE_URL: process.env.CONTENT_SERVICE_URL,
    UPLOAD_SERVICE_URL: process.env.UPLOAD_SERVICE_URL
  },
  reactStrictMode: false,
};

export default nextConfig;
