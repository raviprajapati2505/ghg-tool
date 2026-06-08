import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value:
      process.env.NODE_ENV === "development"
        ? "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src * data:;"
        : "default-src 'self'; img-src 'self' https: data:;"
  },
];

const nextConfig: NextConfig = {
    reactStrictMode: true,

    poweredByHeader: false,

    compress: true,

    productionBrowserSourceMaps: false,

    images: {
        remotePatterns: [
            //   {
            //     protocol: "https",
            //     hostname: "example.com",
            //     pathname: "/**", // allow all paths on this host
            //   },
        ],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [...securityHeaders],
            },
        ];
    },
};

export default nextConfig;