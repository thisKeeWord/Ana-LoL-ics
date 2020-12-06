const path = require("path");

module.exports = {
  entry: [
    // entry point of our app
    "./client/components/app.js",
  ],
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devtool: "eval-source-map",
  mode: "development",
  devServer: {
    // Required for Docker to work with dev server
    host: "0.0.0.0",
    //host: localhost,
    port: 8080,
    // match the output path
    // eslint-disable-next-line no-undef
    contentBase: path.resolve(__dirname, "dist"),
    //enable HMR on the devServer
    hot: true,
    //match the output 'publicPath'
    publicPath: "/",
    // fallback to root for other urls
    historyApiFallback: true,

    inline: true,

    headers: { "Access-Control-Allow-Origin": "*" },
    // proxy is required in order to make api calls to express server while using hot-reload webpack server
    // routes api fetch requests from localhost:8080/api/* (webpack dev server) to localhost:3000/api/* (where our Express server is running)
    proxy: {
      "/api/**": {
        target: "http://localhost:3000/",
        secure: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/react"],
            plugins: ["@babel/plugin-transform-runtime", "@babel/transform-async-to-generator"],
          },
        },
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
