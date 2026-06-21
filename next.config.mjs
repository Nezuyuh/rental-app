/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvzigsuidankvlxhqidn.supabase.co',
      },
    ],
  },
};

export default nextConfig;
