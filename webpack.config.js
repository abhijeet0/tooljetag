const { resolve } = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const dotenv = require("dotenv");
const hash = require("string-hash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getTSConfig } = require("./webpackDeps");
const modeConfiguration = (env) =>
  require(`./build-utils/webpack.${
    env === "prod" ? "production" : "development"
  }`)(env === "prod" ? "production" : "development");

module.exports = ({ mode } = { mode: "production" }) => {
  const env = dotenv.config({ path: `./.env.${mode}` }).parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return merge(
    {
      mode: mode === "prod" ? "production" : "development",
      entry: "./src/index.tsx",
      devServer: {
        open: true,
        historyApiFallback: true,
        port: "6688",
      },
      resolve: {
        alias: {
          "@": resolve(__dirname, "src/"),
          "@ee": resolve(__dirname, "ee/"),
          "@assets": resolve(__dirname, "src/assets/"),
        },
        // fallback: {
        //   fs: false,
        // },
        // fallback: { stream: false },
        extensions: [
          ".ts",
          ".tsx",
          ".js",
          ".jsx",
          ".svg",
          ".png",
          ".scss",
          ".css",
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".json",
          ".png",
          ".wasm",
          ".tar",
          ".data",
        ],
      },
      output: {
        publicPath: "/",
        path: resolve(__dirname, "build"),
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: getTSConfig(mode),
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            resolve: {
              extensions: [".js", ".jsx"],
            },
            use: {
              loader: "babel-loader",
              options: {
                plugins: [
                  [
                    "import",
                    {
                      libraryName: "lodash",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "lodash",
                  ],
                ],
              },
            },
          },
          {
            test: /\.ttf$/,
            use: ["file-loader"],
          },
          {
            test: /\.wasm$/,
            use: ["file-loader"],
          },
          {
            test: /\.tar$/,
            use: ["file-loader"],
          },
          {
            test: /\.data$/,
            use: ["file-loader"],
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: "@svgr/webpack",
                options: {
                  limit: 10000,
                },
              },
            ],
          },

          {
            test: /\.html$/,
            loader: "html-loader",
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
            include: resolve(__dirname, "../src"),
          },
        ],
      },

      plugins: [
        new HtmlWebpackPlugin({
          template: "./public/index.html",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(envKeys),
        new webpack.ProvidePlugin({
          process: "process/browser.js",
        }),
      ],
    },
    modeConfiguration(mode)
  );
};
