module.exports = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/',
                permanent: true,
                destination: '/dashboard'
            },
        ]
    },
}