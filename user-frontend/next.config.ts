import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        // Enable ESLint during builds and dev
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8001",
            },
            {
                protocol: "https",
                hostname: "app-service-production-6c11.up.railway.app",
            },
        ],
    },
};

export default withNextIntl(nextConfig);
