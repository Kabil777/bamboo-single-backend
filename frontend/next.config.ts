import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            },
        ],
        unoptimized: true,
    },
    async rewrites() {
        const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092";
        return [
            {
                source: "/api/v1/:path*",
                destination: `${apiServerUrl}/api/v1/:path*`,
            },
            {
                source: "/collab",
                destination: `${apiServerUrl}/collab`,
            },
        ];
    },
};

export default nextConfig;
