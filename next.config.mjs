/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*'
      },
      {
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
