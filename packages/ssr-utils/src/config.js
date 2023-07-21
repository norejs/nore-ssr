const defaultConfig = {
    ssr: {
        entry: 'src/server.js',
        dist: 'build-ssr',
        builder: 'react-scripts-ssr',
    },
    csr: {
        dist: 'build',
    },
};
module.exports = defaultConfig;
