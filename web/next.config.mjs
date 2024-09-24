/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 중 ESLint 오류를 무시하고 계속 진행할지 여부 설정
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
