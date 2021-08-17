const path = require('path')
const dayJs = require('dayjs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const CompressionPlugin = require('compression-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const site = process.env.npm_config_site || 'aqvns'
const cdn = (process.env.npm_config_cdn || '/') + (process.env.NODE_ENV === 'production' ? 'm/' : '')
const version = process.env.npm_config_version || dayJs().format('YYMMDDHHmm')

// const proxyHost = 'http://eyc.9161252.com:801'
// const proxyHost = 'https://103d.vip'
// const proxyHost = 'http://478qp.9161252.com:801'
// const proxyHost = 'http://cpxtyc.3337708.com:801'
// const proxyHost = 'http://dqr.9161252.com/'
//  const proxyHost = 'https://p5678.com/'
//  const proxyHost = 'http://amxpj.9161252.com/'
//  const proxyHost = 'http://blr.9161252.com:801'
// const proxyHost = 'http://bet365.9161252.com/'
// const proxyHost = 'http://jsyl.3335525.com/'
// const proxyHost = 'http://tpeuserphpapi.ge345.com/'
// const proxyHost = 'https://1qp935.com/'
// const proxyHost = 'http://fhcp.3335525.com/'
// const proxyHost = 'http://hg78.3335525.com/'
// const proxyHost = 'http://tg4.n9963.com'
// const proxyHost = 'http://amxpj.3335525.com'
// const proxyHost = 'http://ly88.9161252.com/'
// const proxyHost = 'http://klk.9161252.com:801/'
// const proxyHost = 'http://tccp.3335525.com/'
// const proxyHost = 'http://amxpj.9161252.com/'
// const proxyHost = 'http://vns81.9161252.com/'
// const proxyHost = 'http://tyc82.3335525.com/'
// const proxyHost = 'http://aqvns.3335525.com'
const proxyHost = 'http://aqvns.3335525.com/'

function resolve (dir) {
  return path.join(__dirname, dir)
}

console.log('\n')
console.log('SITE:', site)
console.log('CDN:', cdn)

console.log('VERSION:', version)
console.log('\n')

const cdns = {
  // cdn：模組名稱和模組作用域命名（對應window裡面掛載的變數名稱）
  externals: {
    
  },
  // cdn的css連結
  
  // cdn的js連結
  js: [
    
  ],
}; 

const config = module.exports = {
  devServer: {
    hot: true,
    injectHot: true,
    hotOnly: true,
    disableHostCheck: true,
    historyApiFallback: true,
    compress: true,
    open: false,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: proxyHost,
        changeOrigin: true
      },
      '/frontend': {
        target: proxyHost,
        changeOrigin: true
      },
      '/json': {
        target: proxyHost,
        changeOrigin: true
      }
    }
  },
  publicPath: cdn,
  filenameHashing: false,
  css: {
    extract: {
      filename: 'css/[name].css?v=' + version,
      chunkFilename: 'css/[name].css?v=' + version
    },
    // modules: false,
    sourceMap: false,
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 50,
            propList: ['*']
          }),
          require('postcss-plugin-px2rem')({
            // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // rootValue: 37.5,
            // unitPrecision: 5, // 允许REM单位增长到的十进制数字。
            // propWhiteList: [],  // 默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], // 黑名单
            // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // exclude: /(node_module)/,
            // selectorBlackList: [], // 要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            // mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
        }),
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: false
    }
  },
  configureWebpack: webpackConfig => {
    webpackConfig.resolve.extensions = ['.js', '.vue', '.json', '.css', '.less']
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([
        { from: 'src/static', to: 'static' },
        { from: `sites/${site}/static`, to: 'static' }
      ])
    )

    if (process.env.NODE_ENV === 'production') {
      webpackConfig.plugins.push(
        new TerserPlugin({
          cache: false,
          parallel: true,
          sourceMap: false,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        }),
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240,
          deleteOriginalAssets: false
        }),
        new WebpackObfuscator ({}, ['**', '!js/*index.js']),
      )
      return {
        externals:  cdns.externals,
      }
    } else {
    }
  },
  chainWebpack: webpackConfig => {
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('prefetch-index')
    webpackConfig.plugins.delete('preload-index')
    webpackConfig.optimization.minimize = true
    // webpackConfig.optimization.splitChunks({
    //   chunks: 'all'
    // })



    if (process.env.NODE_ENV === 'production') {

    } else {

    }

    webpackConfig.output.filename(`js/${version}-[name].js`).end()
    webpackConfig.output.chunkFilename(`js/${version}-[name].js`).end()

    webpackConfig.resolve.alias
      .set('@src', resolve('src'))
      .set('@site', resolve('sites/' + site))

    webpackConfig.module
      .rule('fonts')
      .use('url-loader')
      .tap(options => {
        options.fallback.options.name = options.name = 'font/[folder]/[name].[ext]?h=[hash:4]'
        return options
      })

    webpackConfig.module
      .rule('media')
      .use('url-loader')
      .tap(options => {
        options.fallback.options.name = options.name = 'media/[folder]/[name].[ext]?h=[hash:4]'
        return options
      })

    webpackConfig.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.fallback.options.name = options.name = 'img/[path][name].[ext]?h=[hash:4]'
        options.limit = 2048
        return options
      })
      // ============注入cdn============
      webpackConfig.plugin("html-index").tap((args) => {
      // 生產環境cdn時，才注入cdn
      if(!args[0]){
        args[0] = {}
      }
      if (process.env.NODE_ENV === 'production') args[0].cdn = cdns;
      return args;
    });
    // ============注入cdn============
    if (process.env.NODE_ENV === 'production') { 
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css/,
            threshold: 10240,
            deleteOriginalAssets: false
          })
        ]
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: false,
  transpileDependencies: [],
  outputDir: `./dist/${site}/m`,
  pages: {
    index: {
      entry: [`./src/main.js`],
      template: './src/index.html',
      inject: 'body',
      options: {
        cdn,
        version,
        site
      }
    }
  }
}

module.exports = config
