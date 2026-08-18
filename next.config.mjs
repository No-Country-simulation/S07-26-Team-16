/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
