/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.google.com https://maps.google.com https://homevest-39dcc.firebaseapp.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
