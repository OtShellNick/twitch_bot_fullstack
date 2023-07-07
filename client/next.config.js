module.exports = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/',
                permanent: true,
                destination: '/dashboard'
            },
            {
                source: '/dashboard',
                missing: [
                    {
                        type: 'header',
                        key: 'Authorization',
                    },
                ],
                permanent: false,
                destination: '/login',
            },
        ]
    },
}