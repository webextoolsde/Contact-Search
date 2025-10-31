const path = require("path");

const config = {
  mode: "production",
  entry: "./src/contact-search.js",
  output: {
    path: path.resolve(__dirname, "src/build"),
    filename: "contact-search.js",
    publicPath: "build/"
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/
      }
    ]
  }
};

module.exports = config;
