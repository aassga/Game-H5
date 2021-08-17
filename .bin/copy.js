const config = require('./config')
const path = require('path')
const { exec, spawn } = require('child_process')

// const site = process.env.npm_config_site
// console.log(site)
// console.log(process.argv)
const all = [
  '737qp',
  '103qp',
  'amvnsr',
  'hqyl',
  'klk',
  'betsb',
  '478qp',
  '632qp',
  '839qp',
  '935qp',
  'bet365',
  'blr',
  'jltx',
  'jsyl',
  'kyqp',
  'mgm',
  'pjdc',
  'qygj',
  'tycjt',
  'vnso',
  'vnst',
  'xpj',
  'qmcp',
  'ybcp',
  'ecp',
  'aqvns',
  'hty',
  'cpzj',
  '500w',
  'fhcp',
  '500wcp',
  'wycp',
  'cmgm',
  'dalao',
  'jhcp',
  'cjw',
  'amvns',
  'dqr',
  'hsyl',
  'qxcp',
  'csj',
  'flcp',
  'tccp',
  'tyc86',
  'tycp',
  'fczj'
]
const tg = [
  'amvnsr',
  'bet365',
  'qygj',
  'kkqp',
  'vnst',
  'vnso',
  'amxpj',
  '99qp',
  'pjdc',
  'jsyl',
  'tycjt',
  'xpj',
  'xpj80',
  'vns81',
  'tyc82',
  'amhg'
]
const cp = [
  'qmcp',
  'ybcp',
  'aqvns',
  'hty',
  'fhcp',
  'wycp',
  'dalao',
  'amvns',
  'dqr',
  '839qp',
  'tccp',
  'tyc86',
  'betnew',
  'cpxpj',
  'xpj83'
]
let sites
if (process.argv[2]) {
  if (process.argv[2] == 'tg') {
    sites = tg
  } else if (process.argv[2] == 'cp') {
    sites = cp
  } else if (process.argv[2] == 'all') {
    sites = all
  } else if (process.argv[2].indexOf(',') != -1) {
    sites = process.argv[2].split(',')
  } else {
    sites = [process.argv[2]]
  }
} else {
  console.log(`无法识别的操作类型: ${type}\n\n\n 请输入正确的指令`)
}

function task (site) {
  console.log(site, 'removing')
  exec(`rm -R ${path.resolve(config.base, '../lottery-pc/dist', site, 'm')}`, function (err, stdout, stderr) {
    if (err) {
      console.log(err)
    }

    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    console.log(site, 'remove ok')

    exec(`cp -R ${path.resolve(config.base, 'dist', site, 'm')} ${path.resolve(config.base, '../lottery-pc/dist', site, 'm')}`, function (err, stdout, stderr) {
      if (err) {
        console.log(err)
        return
      }

      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      console.log(site, 'copy ok')
    })

  })
}

console.log(sites)
if (sites.length) {
  sites.forEach(function (site) {
    task(site)
  })
}
