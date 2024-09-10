const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

const routes = require('./routes')
const { port } = require('./config/index')
let app = express()

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.stack || 'Service Error')
})

const createServer = () => {
  app.use('/', routes)
  app.listen(port, () => {
    setTimeout(() => {
      console.clear()
      console.log('\n')
      if (isDev) {
        console.log(chalk.bold(chalk.white(`Github: ${chalk.gray(`https://github.com/j3812549/tiancai-mpa-ejs-hot-webpack-cli`)}`)))
        console.log(chalk.bold(chalk.white(`Author: ${chalk.gray(`380012546@qq.com`)}`)))
      }
      console.log('\n')
      console.log(
        chalk.bold(chalk.green(`Loopback: ${chalk.blue(`http://localhost:${port}/`)}`))
      )
    }, 1000)
  })
}

const isDev = process.env.MODE_ENV === 'development'
if (isDev) {
  // development
  const webpackConfig = require(path.join(__dirname, './config/webpack.dev.config.js'))
  const compiler = webpack(webpackConfig)
  const server = new webpackDevServer({ hot: true, client: false }, compiler)
  setTimeout(async () => {
    await server.start()
    createServer()
  })
} else {
  // production
  const webpackConfig = require(path.join(__dirname, './config/webpack.prod.config.js'))
  webpack(webpackConfig, (err, res) => {
    if (err || res.hasErrors()) {
      console.log("构建过程出错！")
    } else {
      console.log("构建成功！")
      // 添加静态资源拦截转发
      app.use(express.static(path.join(__dirname, 'dist')))

      app.set('views', path.join(__dirname, 'dist'))
      app.set('view engine', 'ejs')

      createServer()
    }
  })

}


