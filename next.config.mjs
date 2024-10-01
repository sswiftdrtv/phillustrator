/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
          pathname: '/**',  // This allows all paths from this hostname
        },
        {
          protocol: 'https',
          hostname: 'replicate.delivery',
          pathname: '/**',  // This allows all paths from replicate.delivery
        },
      ],
    },
  };
  
  export default nextConfig;