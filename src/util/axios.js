import axios from 'axios'
import qs from 'qs'
import cryptoES from 'crypto-es'
import '../util/jsencrypt/jsencrypt.min.js'
import { getPublicKey } from '../util/public-key'

const public_key = getPublicKey()
const needEncrypt = process.env.VUE_APP_ENCRYPT === 'yes'

export default {
  install (Vue) {
    const $http = axios.create()
    $http.defaults.baseURL = '/frontend/v1'
    $http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // $http.defaults.headers['Accept'] = 'application/json, text/plain, */*'
    $http.defaults.timeout = 60000

    if (needEncrypt) {
      $http.defaults.headers['encryptResponse'] = 1
    }

    $http.defaults.transformRequest = [(data) => {
      return needEncrypt ? data : qs.stringify(data)
    }]

    $http.defaults.transformResponse = [(data, headers) => {
      if (needEncrypt) {
        const decrypt = new JSEncrypt();
        decrypt.setPublicKey(public_key);
        // request-id 用 base64 decode 後再用 rsa 解密
        const aesKey = decrypt.decrypt(headers['request-id'], true)
        const text = cryptoES.AES.decrypt(cryptoES.enc.Utf8.stringify(cryptoES.enc.Utf8.parse(data)), cryptoES.enc.Utf8.parse(aesKey), {
          mode: cryptoES.mode.ECB,
        })
        const result = JSON.parse(cryptoES.enc.Utf8.stringify(text))
        return result
      }
      return JSON.parse(data)
    }]

    Vue.prototype.$http = $http
  }
}
