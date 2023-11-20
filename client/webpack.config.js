module.exports = {
    resolve: {
        fallback: {
            // Configuring Node modules is no longer supported by default by Webpack5
            util: require.resolve('util/'),
        },
    },
}