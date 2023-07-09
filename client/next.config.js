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
}