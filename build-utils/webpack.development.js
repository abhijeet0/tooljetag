module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /\.module\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            // options: {
            //   options: {
            //     postcssOptions: {
            //       plugins: [
            //         [
            //           "postcss-preset-env",
            //           {
            //             // Options
            //           },
            //         ],
            //       ],
            //     },
            //   },
            // },
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
});
