const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const htmlRule = {
  test: /\.html$/,
  use: ['html-loader']
}

const cssRule = {
  test: /\.s?css$/,
  exclude: /node_modules/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

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
    rules: [htmlRule, cssRule, jsRule]
  }
}
