const path = require('path')
const webpack = require('webpack')
const Base = require('./webpack.base.config.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const distDir = path.join(__dirname, '../dist')
require('babel-polyfill')

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env': '"production"'
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
]

const env = process.env.MODE_ENV || 'production'

module.exports = {
  mode: env,
  entry: Object.assign(Base.getEntry(env), {
    // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
    // 'vendor':Object.keys(packagejson.dependencies)
    'vendor': ["jquery"]
  }),
  output: {
    path: distDir,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        //include表示直接去哪些文件夹下面找,可以加快速度
        include: [path.join(__dirname, '../src/js',)]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            //- 优点：减少请求数量
            //缺点：体积变得更大
            maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          filename: 'images/[hash:8][ext][query]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
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
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, '../loader/autoLoadFiles.js')
        ],
      }
    ]
  },
  externals: {
    $: "jquery",
    jQuery: "jquery"
  },
  resolve: Base.resolve,
  plugins: plugins.concat(Base.plugins)
}