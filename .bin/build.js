const { exec, execSync, spawn, spawnSync } = require('child_process')
const config = require('./config-sites')

let sites
if (process.argv[2]) {
  if (process.argv[2] == 'tg') {
    sites = config.tg
  } else if (process.argv[2] == 'cp') {
    sites = config.cp
  } else if (process.argv[2].indexOf(',') != -1) {
    sites = process.argv[2].split(',')
  } else if (process.argv[2] == 'all') {
    sites = config.all
  }
} else {
  console.log(`无法识别的操作类型: ${type}\n\n\n 请输入正确的指令`)
}
console.log(sites)

function build (i, c) {
  console.log('index: ', i)
  if (sites[i]) {
    console.log('\n\n开始打包: ' + sites[i])
    exec('npm run build -site=' + sites[i], {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024
    }, function (err, stdout, stderr) {
      if (err) {
        console.log(err)
        return
      }
      console.log(`stderr: ` + stderr.toString())
      console.log(sites[i], '打包完成\n\n')

      build(i + c, c)
    })
  }
}

build(0, 8)
build(1, 8)
build(2, 8)
build(3, 8)
build(4, 8)
build(5, 8)
build(6, 8)
build(7, 8)
