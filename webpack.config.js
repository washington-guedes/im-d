const path = require('path')

module.exports = {
  output: {
    filename: 'image-distortion.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [] // corejs + babel + envs|presets|plugins
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
}
