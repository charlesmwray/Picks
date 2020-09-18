const hwp = require("html-webpack-plugin"); // Require  html-webpack-plugin plugin

module.exports = {
  entry: "./src/app.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new hwp({
      template: "src/index.html"
    })
  ]
};
