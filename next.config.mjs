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
  // THIS TELLS NEXT.JS TURBOPACK TO IGNORE EXCELJS DURING BUILD
  serverExternalPackages: ['exceljs'],
};

export default nextConfig;