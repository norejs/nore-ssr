const defaultConfig = {
    ssr: {
        entry: 'src/server.jsx',
        dist: 'build-ssr',
        builder: 'modern',
    },
    csr: {
        dist: 'build',
    },
};
module.exports = defaultConfig;
