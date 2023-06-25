function getTSConfig(isProd) {
  const babelConfig = {
    loader: "babel-loader",
    options: {
      plugins: [],
      cacheDirectory: true,
      presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "usage",
            modules: false,
            targets: ["last 2 versions", "not ie <= 11", "not dead"],
            corejs: { version: 3 },
          },
        ],
      ],
    },
  };
  const tsLoaderConfig = {
    loader: "ts-loader",
    options: {
      transpileOnly: true,
    },
  };
  return isProd ? [babelConfig, tsLoaderConfig] : [tsLoaderConfig];
}

module.exports = {
  getTSConfig,
};
