module.exports = {
    ssr: {
        entry: 'src/server.js',
    },
    csr: {
        port: 3000,
        start: 'react-scripts start',
        build: 'react-scripts build',
    },
};
