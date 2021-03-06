module.exports = (api) => {
    api.cache(false);
    return {
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
        ],
        presets: ['@babel/preset-env', '@babel/preset-react'],
    };
};
