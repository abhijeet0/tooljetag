const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CompressionPlugin = require("compression-webpack-plugin");
var webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = () => ({
  devtool: false,
  output: {
    filename: "production.js",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /\.module\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: `postcss-loader`,
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|png|jpe?g|gif)$/i,
        loader: "url-loader",
        options: {
          fallback: require.resolve("file-loader"),
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
});
