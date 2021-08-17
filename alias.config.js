const path = require('path')
module.exports = {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@site': path.resolve(__dirname, 'sites/klk')
    }
  }
}
