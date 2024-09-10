const path = require('path')
const glob = require("glob")
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ResolveEjsPlugin = require('../plugins/resolveEjsPlugin.js')
const srcDir = path.join(__dirname, '../src')
let plugins = [
  new webpack.DefinePlugin({
    'process.env.MODE_ENV': `'${process.env.MODE_ENV}'`,
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
]
const getEntry = (env) => {
  env = env || 'development'
  let htmlName = 'html' // 打包之后生成出来的html文件名
  let files = glob.sync(srcDir + '/entry/**/*.js'),
    entry = {},
    entryFileName,
    outputHtmlName,
    minifyParms
  if (env == 'production') {
    htmlName = 'ejs'
    minifyParms = {
      removeComments: true,//去除注释
      collapseWhitespace: true,//去除空格
      removeAttributeQuotes: true //移除属性的引号
    }
  } else {
    minifyParms = false
  }
  for (let i = 0; i < files.length; i++) {
    let matchs = /entry[\\|\/](\S*).js/.exec(files[i])
    entryFileName = outputHtmlName = matchs[1]
    if (/^_\w*/.test(entryFileName) || /\/_\w*/.test(entryFileName)) {
      continue
    }
    if (env == 'production') {
      entry[entryFileName] = [srcDir + files[i].replace('src', '')]
    } else {
      entry[entryFileName] = ['webpack/hot/dev-server.js', 'webpack-dev-server/client/index.js?hot=true&live-reload=true&port=8080', srcDir + files[i].replace('src', '')]
    }

    if (env === 'development') {
      //生成html配置
      plugins.push(new HtmlWebpackPlugin({
        // 打包之后生成出来的html文件名
        filename: outputHtmlName + '.' + htmlName,
        // 每个html的模版
        template: '!!ejs-compiled-loader!./src/view/' + outputHtmlName + '.ejs',
        // 自动将引用插入body
        favicon: './iconfont.ico',
        inject: true,
        title: outputHtmlName,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        // chunks: ['manifest',  'vendor', entryFileName],
        chunks: ['common', entryFileName],
        // chunksSortMode: 'dependency',//如果是单页面应用使用这个就行，上面chunks不需要设置
        minify: minifyParms // 全面压缩
      }))
    } else {
      plugins.push(
        new ResolveEjsPlugin()
      )
      plugins.push(
        new MiniCssExtractPlugin({
          filename: 'css/[name].[chunkhash:8].css'
        })
      )
    }
  }
  return entry
}

const resolve = {
  extensions: ['.js', '.json'],
  alias: {
    "@": path.join(__dirname, '../src')
  }
}

module.exports = {
  getEntry,
  plugins,
  resolve
}