const Base = require('./webpack.base.config')
const path = require('path')
const webpack = require('webpack')
const distDir = path.join(__dirname, '../dist')
const plugins = [
  new webpack.HotModuleReplacementPlugin(),
]

const env = process.env.MODE_ENV || 'development'

module.exports = {
  mode: env,
  entry: Base.getEntry(env),
  output: {
    publicPath: '/',
    path: distDir,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.join(__dirname, '../src/js',)]
        //include表示直接去哪些文件夹下面找,可以加快速度
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false,
              variable: 'data',
            },
          }
        ],
      },
      {
        test: /\.js$/,
        use: [path.resolve(__dirname, '../loader/autoLoadFiles.js')],
        //include表示直接去哪些文件夹下面找,可以加快速度
      },

    ]
  },
  resolve: Base.resolve,
  plugins: plugins.concat(Base.plugins),
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
}

