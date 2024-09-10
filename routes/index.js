const express = require('express')
const fs = require('fs')
const he = require('he')
const path = require('path')
const _ = require('lodash')
const config = require('../config')

const axios = require('axios')
const ejs = require('ejs')
const router = express.Router()
const isDev = process.env.MODE_ENV === 'development'
const pages = fs.readdirSync(path.join(__dirname, '../src/entry'), 'utf-8').map(v => v.replace(/.js/g, ''))
const distDir = path.join(__dirname, '../dist/')

const getSource = async (key, opt) => {
  const filename = `../src/register_data.js`
  if (!fs.existsSync(path.join(__dirname, filename))) return {}
  const sources = require(filename).default
  let data = {}
  if (typeof sources[key] === 'function') {
    data = await sources[key](opt)
  } else if (typeof sources[key] === 'object') {
    data = sources[key]
  }
  return data
}

const resolvePath = async (req, res) => {
  let { url, path } = req
  const key = pages.find(v => v === path.replace(/\//i, '').replace(/\/\d+/g, ''))
  if (isDev) {
    let server_url = `http://localhost:8080${url.replace(/\/\d+/g, '')}`
    try {
      if (key || path === '/') {
        if (path !== '/') server_url = server_url.indexOf('?') > -1 ? server_url.replace('?', '.html?') : server_url + '.html'
        const result = await axios.get(server_url)
        let template = result.data.replace(/{{/g, '<%=').replace(/}}/g, '%>').replace(/\[\[/g, '<%').replace(/\]\]/g, '%>')
        template = he.decode(template)
        template = template.replace(/href=['"](.+)['"]\s/g, (o, v) => {
          return `href="http://localhost:${config.port}${v}"`
        })

        const id = url.match(/\d+/)
        let source
        if (id) {
          source = await getSource(key || 'index', Object.assign(_.cloneDeep(req.query), { id: id[0] }))
        } else {
          source = await getSource(key || 'index')
        }
        // console.log(template)
        // console.log('source', source)
        // template = template.replace(/<%= htmlWebpackPlugin.options.title %>/, source.title || key)
        const data = ejs.render(template, source)
        res.send(data)
      } else {
        let static_url = `http://localhost:8080${url}`

        if (url.match(/\.js|.json$/)) {
          const result = await axios.get(static_url)
          res.send(result.data)
          return
        }
        // 对静态文件进行转发
        res.redirect(static_url)
      }
    } catch (err) {
      if (err.code !== 'ERR_BAD_REQUEST') {
        console.error(err)
      }
      res.send(err)
    }
  } else {
    const id = url.match(/\d+/)
    let source
    if (id) {
      source = await getSource(key || 'index', Object.assign(_.cloneDeep(req.query), { id: id[0] }))
    } else {
      source = await getSource(key || 'index')
    }
    // const template = fs.readFileSync(distDir + (key || 'index') + config.build_ext, 'utf8')
    // const data = ejs.render(he.decode(template), source)
    // res.send(data)
    res.render(key || 'index', source)
  }
}

router.use('/', async (req, res) => {
  try {
    await resolvePath(req, res)
  } catch (err) {
    res.status(500).send('404 不存在的页面')
  }
})

module.exports = router
