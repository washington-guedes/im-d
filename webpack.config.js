const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const jsRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [['@babel/env', { useBuiltIns: 'usage', corejs: 3 }]],
      plugins: ['@babel/plugin-proposal-class-properties']
    }
  }
}

const cssRule = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: ['style-loader', 'css-loader']
}

module.exports = {
  output: {
    filename: 'image-distortion.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [cssRule, jsRule]
  }
}
