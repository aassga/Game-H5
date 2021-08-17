const dev_publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxdgoZOYfNp3LFNdvUfOjSfHhL
HzGTRy5lEIEZsAmNwkUDJ8+jvr1rOuoyZsCsS1Azs261hZfiHYf+6tc6AIeKP4vE
VtTuQZ/hxfsv0sgLBXy8b9E5vNadqZj7W44zCuI1gkJsZziHAwsb90u6SDypMaRk
ZPgUeK0z+HCDs5tdXwIDAQAB
-----END PUBLIC KEY-----`

const production_publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDf2lqx9TDDxarmXiCRZbecwQJa
nrYuDbC9DjVQM3di8pf8/uanA0EVNiLJU4gjp/MAJHMX0GQD4N/ToFLQXtvtWx/t
41RGNumWEToxKWpky6lk+D665Jfx0AFlhrZG4t23c78nPgb5VyMxkuBTKUPULIXC
CtJjtOVJ/wM2LMi44QIDAQAB
-----END PUBLIC KEY-----`

export function getPublicKey() {
  return process.env.VUE_APP_PUBLICKEY === 'production' ? production_publicKey : dev_publicKey
}