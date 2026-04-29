/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_URL?.trim() || "http://127.0.0.1:3001";

const nextConfig = {
  output: "standalone",
  async rewrites() {
    const base = backendUrl.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
