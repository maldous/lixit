/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@lixit/core", "@lixit/ui-kit"],
  output: "standalone",
};

module.exports = nextConfig;

