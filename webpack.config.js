const path = require("path");
const webpack = require("webpack");

module.exports = {
  // eslint-disable-next-line no-undef
  entry: path.join(__dirname, "js", "app.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    // eslint-disable-next-line no-undef
    path: path.join(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
};
