module.exports = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
            {
                source: '/login',
                has: [
                    {
                        type: 'cookie',
                        key: 'wbautht'
                    },
                ],
                destination: '/dashboard',
                permanent: false
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static-cdn.jtvnw.net',
            },
        ],
    },
    webpack: (config) => {

        config.module.rules.push({
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            oneOf: [
                {
                    resourceQuery: /[tj]sx/,
                    use: ['@svgr/webpack'],
                },
            ],
            issuer: /\.[tj]sx?$/,
        },);

        return config;
    }
}