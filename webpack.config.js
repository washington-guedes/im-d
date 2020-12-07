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
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'image-distortion.min.js',
    library: 'imageDistortion',
    libraryTarget: 'window'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [cssRule, jsRule]
  }
}
