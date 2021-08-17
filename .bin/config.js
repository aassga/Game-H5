const fs = require('fs')
const path = require('path')
const sites = []
const base = path.resolve(__dirname, '../')

console.log('base:', base)

fs.readdirSync(base).forEach(function (name) {
  if (/^[A-z\d]+$/.test(name) && !['public', 'node_modules'].includes(name)) {
    const file = fs.statSync(path.resolve(base, name))
    if (file.isDirectory()) {
      sites.push(name.toString())
    }
  }
})

module.exports.base = base
module.exports.sites = sites
