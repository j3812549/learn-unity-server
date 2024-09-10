const path = require('path')
const fs = require('fs')
const config = require('../config/index')
const env = process.env.MODE_ENV || 'production'

module.exports = function (content, map, meta) {
  const srcDir = path.join(__dirname, '../src')
  let template = ''
  if (this.resourcePath.indexOf(srcDir) > -1) {
    const matchs = /entry[\\|\/](\S*).js/.exec(this.resourcePath)
    if (!matchs) return content

    config.publicModules && config.publicModules.forEach(v => {
      template += `import '${v}';`
    })

    const key = matchs[1]
    const ejs = path.join(srcDir, 'view/') + key + '.ejs'
    const scss = path.join(srcDir, 'sass/') + key + '.scss'
    if (!fs.existsSync(scss)) fs.writeFileSync(scss, '')
    if (!fs.existsSync(ejs)) fs.writeFileSync(ejs, createEjsTemplate(key))
    template += `import '@/sass/${key}.scss';`
    template += `import '@/view/${key}.ejs';`

    const autoLoadFiles = temp => {
      temp.replace(/require\(\'\.(.+)\'\)\(\)/g, (a, b) => {
        const filename = path.join(srcDir, 'view/') + b.replace(/\//, '')
        template += `import '@/view/${b.replace(/\//g, '')}';`
        template += `import '@/entry/${b.replace(/\//g, '').replace(/ejs/, 'js')}';`
        template += `import '@/sass/${b.replace(/\//g, '').replace(/ejs/, 'scss')}';`
        autoLoadFiles(fs.readFileSync(filename, 'utf-8'))
      })
    }

    env === 'development' && autoLoadFiles(fs.readFileSync(ejs, 'utf-8'))

    template += content

  } else {
    template = content
  }
  return template
}



function createEjsTemplate(key = '') {
  const filename = `../ejs-template.ejs`
  if (fs.existsSync(path.resolve(__dirname, filename))) {
    const template = fs.readFileSync(path.join(__dirname, filename), 'utf-8')
    return template
  }

  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tiancai-mpa-ejs-hot-webpack-cli</title>
  </head>
  
  <body>
    <div>Hi ${key}</div>
  </html>`
}