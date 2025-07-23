/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    serverActions: {
      bodySizeLimit: "10mb", // Example: Set to 10MB; adjust as needed
    },
  },
};

module.exports = nextConfig;
