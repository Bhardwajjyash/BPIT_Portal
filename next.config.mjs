/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.3', 'http://192.168.1.3:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add this block to fix the ExcelJS evaluation error
  serverExternalPackages: ['exceljs'],
};

export default nextConfig;