module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV === 'development')

  const presets = [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['>1%', 'last 2 versions']
        },
        useBuiltIns: 'usage',
        corejs: 2
      }
    ]
  ]
  const plugins = [
    ['import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]

  return {
    presets,
    plugins
  }
}
