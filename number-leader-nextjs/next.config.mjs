/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Turn off ESLint during builds
    ignoreDuringBuilds: true,
  },
  output: 'export', // Enable static exports for Firebase hosting
  images: {
    unoptimized: true, // Required for static exports
  },
  // Custom error pages for static export
  trailingSlash: true, // Helps with static export
  // Prevent output of unnecessary files
  webpack: (config) => {
    return config;
  },
};

export default nextConfig; 