// import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TransferDom from './util/transfer-dom'
import VNumberKeyboard from './util/number-keyboard'
// import 'amfe-flexible'
import '@src/assets/font/iconfont/iconfont.css'
import './util/json'
import VAR from './util/VAR'
import config from '@site/config'
import http from './util/axios'
import stomp from './util/stomp'
import domResize from './util/dom-resize'
import mixin from './mixin'
import './util/visibility-change'
import { ViewPage } from './pages'
import components from './components'
import VueClipboard from 'vue-clipboard2'
import dayJs from 'dayjs'
import mobileDevice from 'mobile-device-detect'
import touch from 'vue-directive-touch';
import device from 'vux/src/plugins/device'
import cryptoES from 'crypto-es'
import './util/jsencrypt/jsencrypt.min.js'
import qs from 'qs'
import { getPublicKey } from './util/public-key'

import SimpleNoticeBar from 'vue-simple-noticebar'
import AppDown from "./pages/down/default"

Vue.prototype.$AppDown = AppDown;

Vue.prototype.$mobileDevice = mobileDevice;
import {
  Tabbar,
  TabbarItem,
  NoticeBar,
  Button,
  Popup,
  Switch,
  Checkbox,
  CheckboxGroup,
  Swipe,
  SwipeItem,
  CellGroup,
  Cell,
  Picker,
  Tabs,
  Tab,
  Field,
  Area,
  Icon,
  Loading,
  NumberKeyboard,
  Divider,
  Tag,
  Overlay,
  Lazyload,
  Dialog,
  Toast
} from 'vant'


Vue.use(SimpleNoticeBar)

import { BindEventMixin } from 'vant/es/mixins/bind-event'
import { preventDefault } from 'vant/es/utils/dom/event'

Popup.mixins[0].beforeDestroy = function () {
  this.close()

  if (this.getContainer && this.$parent && this.$parent.$el) {
    try {
      this.$parent.$el.appendChild(this.$el)
    } catch (e) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}

NumberKeyboard.mixins[0] = BindEventMixin(function (bind) {
  if (this.hideOnClickOutside) {
    bind(document.body, 'click', evt => {
      if (!/(^|\s)(van-key|key-no-hide|number-input)(\s|$)/.test(evt.target.className || '')) { this.onBlur() }
    })
  }
})

Swipe.methods.onTouchMove = function (event) {
  if (!this.touchable || !this.swiping) return
  this.touchMove(event)

  if (this.isCorrectDirection) {
    // preventDefault(event, true)
    this.move({
      offset: this.delta
    }, event)
  }
}

Swipe.methods.move = function ({ pace = 0, offset = 0, emitChange }, event) {
  const { loop, count, active, swipes, trackSize, minOffset } = this

  if (count <= 1) {
    return
  }

  const targetActive = this.getTargetActive(pace)
  const targetOffset = this.getTargetOffset(targetActive, offset)

  // auto move first and last swipe in loop mode
  if (loop) {
    if (swipes[0]) {
      const outRightBound = targetOffset < minOffset
      swipes[0].offset = outRightBound ? trackSize : 0
    }

    if (swipes[count - 1]) {
      const outLeftBound = targetOffset > 0
      swipes[count - 1].offset = outLeftBound ? -trackSize : 0
    }
  }

  if (event) {
    let isStopPropagation = true
    if (this.activeIndicator === this.count - 1) {
      isStopPropagation = offset >= 0
    } else if (this.activeIndicator === 0) {
      isStopPropagation = offset <= 0
    }

    preventDefault(event, isStopPropagation)
  }

  this.active = targetActive
  this.offset = targetOffset

  if (emitChange && targetActive !== active) {
    this.$emit('change', this.activeIndicator)
  }
}

//解析$t

import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';
Vue.use(Vuex);
const StoreData = new Vuex.Store({
  modules: {
    i18n: vuexI18n.store
  }
});
Vue.use(vuexI18n.plugin, StoreData);
const translationsEn = {
  "content": "This is some {type} content"
};
Vue.i18n.add('en', translationsEn);

Vue.i18n.set('en');
Vue
  .use(Tabbar)
  .use(TabbarItem)
  .use(NoticeBar)
  .use(Switch)
  .use(Button)
  .use(Popup)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Swipe)
  .use(SwipeItem)
  .use(CellGroup)
  .use(Cell)
  .use(Picker)
  .use(Tabs)
  .use(Tab)
  .use(Field)
  .use(Area)
  .use(Icon)
  .use(Loading)
  .use(NumberKeyboard)
  .use(Divider)
  .use(Tag)
  .use(Overlay)
  .use(Lazyload)
  .use(Dialog)
  .use(Toast)


Vue.directive('transfer-dom', TransferDom)
Vue.use(components)


  // vux 设备相关插件
  // const vuxDevice = require(/* webpackChunkName: "vux" */'vux/src/plugins/device')
  // Vue.use(vuxDevice)
  // alert 插件

  // Vux全局组件
  Vue.component('VuxViewBox', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/view-box').then(m => m.default))
  Vue.component('VuxLoading', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/loading').then(m => m.default))
  Vue.component('VuxTabbar', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/tabbar/tabbar').then(m => m.default))
  Vue.component('VuxTabbarItem', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/tabbar/tabbar-item').then(m => m.default))
  Vue.component('VuxAddress', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/x-address').then(m => m.default))
  Vue.component('VuxSwiper', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/swiper').then(m => m.Swiper))
  Vue.component('VuxSwiperItem', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/swiper').then(m => m.SwiperItem))
  Vue.component('VuxNumber', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/x-number').then(m => m.default))
  Vue.component('VuxGroup', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/group').then(m => m.default))
  Vue.component('VuxButton', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/x-button').then(m => m.default))
  Vue.component('VuxDrawer', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/drawer').then(m => m.default))
  Vue.component('VuxChecker', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/checker').then(m => m.Checker))
  Vue.component('VuxCheckerItem', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/checker').then(m => m.CheckerItem))
  Vue.component('VuxCard', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/card').then(m => m.default))
  Vue.component('VuxPopup', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/popup').then(m => m.default))
  Vue.component('VuxDialog', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/x-dialog').then(m => m.default))
  Vue.component('VuxCell', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/cell').then(m => m.default))
  Vue.component('VuxPopupPicker', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/popup-picker').then(m => m.default))
  Vue.component('VuxPicker', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/picker').then(m => m.default))
  Vue.component('VuxMarquee', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/marquee/marquee').then(m => m.default))
  Vue.component('VuxMarqueeItem', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/marquee/marquee-item').then(m => m.default))
  Vue.component('VuxTab', () => import(/* webpackChunkName: "vux" */ './components/tab').then(m => m.Tab))
  Vue.component('VuxTabItem', () => import(/* webpackChunkName: "vux" */ './components/tab').then(m => m.TabItem))
  Vue.component('TgVuxTab', () => import(/* webpackChunkName: "vux" */ './components/tg-tab').then(m => m.TgTab))
  Vue.component('TgVuxTabItem', () => import(/* webpackChunkName: "vux" */ './components/tg-tab').then(m => m.TgTabItem))
  Vue.component('VuxScroller', () => import(/* webpackChunkName: "vux" */ 'vux/src/components/scroller').then(m => m.TgTabItem))

  const vuxAlert = require(/* webpackChunkName: "vux" */'vux/src/plugins/alert').default
  Vue.use(vuxAlert)
  const vuxConfirm = require(/* webpackChunkName: "vux" */'vux/src/plugins/confirm').default
  Vue.use(vuxConfirm)
  const vuxToast = require(/* webpackChunkName: "vux" */'vux/src/plugins/toast').default
  Vue.use(vuxToast)
  const vuxDatetime = require(/* webpackChunkName: "vux" */'vux/src/plugins/datetime').default
  Vue.use(vuxDatetime)
  const vuxConfig = require(/* webpackChunkName: "vux" */'vux/src/plugins/config').default
  Vue.use(vuxConfig, {
    $layout: 'VIEW_BOX'
  })


let u = navigator.userAgent
window.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1

Vue.prototype.$config = config
Vue.prototype.$userAgent = window.navigator.userAgent
Vue.use(http)
Vue.use(stomp)
Vue.use(touch);
Vue.use(device)
Vue.use(VueClipboard)

Vue.prototype.toastText2 = function (msg, pos, time) {
  if(!(['kkqp','99qp','amxpj','vnst','103qp','fhcp','839qp','hty','dqr','aqvns','vnso','tccp','tyc86','dalao','xpj83'].includes(Vue.prototype.$config.name) && msg.includes('正在请求下载中...') && $store.state.main.downloadType === 'testflight') ) {
    Toast({
      message: msg,
      position: pos,
      className: 'my-toast-text downLoad-toast',
      duration: time || 2000
    })
  }
}
Vue.prototype.toastText = function (msg, pos, time) {
  Toast({
    message: msg,
    position: 'middle',
    duration: time || 1000
  })
}

Vue.prototype.toastLoading = function(msg,click){
  Toast.loading({
    loadingType:'spinner',
    duration: 0, // 持续展示 toast
    message: msg,
    className: 'my-toast-loading',
    forbidClick: click || true
  });
}

Vue.prototype.toastClear = function(){
  Toast.clear();
}


/**
 * APP中WebView传入
 * @param token
 * @param url
 */
window.setupWebViewJavascriptBridge = function (token, url) {
  localStorage.token = token
  localStorage.url = url
}

console.log('站点配置:', Vue.prototype.$config)
localStorage['siteConfig'] = JSON.stringify(Vue.prototype.$config)
Vue.config.productionTip = false


function vueTouch(el,type,binding){
  this.el = el;
  this.type = type;
  this.binding = binding;
  var hammertime = new Hammer(this.el);
  hammertime.on(this.type,this.binding.value);
};
Vue.directive("tap",{
    bind:function(el,binding){
        new vueTouch(el,"tap",binding);
    }
});
Vue.directive("swipeleft",{
    bind:function(el,binding){
        new vueTouch(el,"swipeleft",binding);
    }
});
Vue.directive("swiperight",{
    bind:function(el,binding){
        new vueTouch(el,"swiperight",binding);
    }
});
Vue.directive("press",{
    bind:function(el,binding){
        new vueTouch(el,"press",binding);
    }
  })


Vue.directive('cursorStates',{
  bind(el){
    // if(navigator.userAgent.includes('iPhone') && !navigator.vendor.includes('Google')){
      let node = el.getElementsByTagName('input')[0] || el.getElementsByTagName('textarea')[0]
      node.addEventListener('focusin',()=>{
        el.setAttribute('id','focus')
      })
      node.addEventListener('input',()=>{
        setTimeout(function () {
          if (node) {
            if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
              el.setAttribute('id','focus')
              let nodeLength = node.value.length;
              // el.addRule('#focus::after','left:-2342px')
            }
          }
        }, 200)
      })
    }
  // }
})


//监听键盘收起
Vue.directive('keyBroayStates',{
  bind(el){
    if(navigator.userAgent.includes('iPhone') &&!navigator.vendor.includes('Google')){
      let dom = el.getElementsByTagName('input')[0] || el.getElementsByTagName('textarea')[0]
        dom.addEventListener('focusin',()=>{
          // 解决ios输入法上下箭头选择input定位失效bug
          if(router.history.current.path.includes('/save/bank') || router.history.current.path.includes('/take')) {
            let inputs = document.querySelectorAll('input')
            inputs.forEach(ele => {
              ele.setAttribute("readonly","readonly")
            });
            dom.removeAttribute('readonly')
          }
          $store.state.main.keyBoardStatus = true;
        })
        //键盘收起
        dom.addEventListener('focusout',()=>{
          if(router.history.current.path.includes('/save/bank') || router.history.current.path.includes('/take')) {
            let inputs = document.querySelectorAll('input')
            inputs.forEach(ele => {
              ele.removeAttribute('readonly')
            });
          }
          $store.state.main.keyBoardStatus = false
      })
    }
  }
})

Vue.directive('NoTouchMove', {
  bind (el) {
    el.addEventListener('touchmove', function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      return false
    }, false)
  }
})

Vue.directive('StopTouchMove', {
  bind (el) {
    el.addEventListener('touchstart', function (evt) {
      evt.stopPropagation()
    })
    el.addEventListener('touchmove', function (evt) {
      evt.stopPropagation()
    })
  }
})

Vue.directive('real-img', async function (el, binding) {
  let imgURL = binding.value;//获取图片地址
  if (imgURL) {
      let exist = await imageIsExist(imgURL);
      if (exist) {
          el.setAttribute('src', imgURL);
      }
  }
})

Vue.directive('errorAlt', {
  bind: function (el, binding) {
    el.onerror = () => {
      el.src = binding.value
      el.onerror = null // 防止闪图
    }
  },
  update: function (el, binding) {
    el.onerror = () => {
      el.src = binding.value
      el.onerror = null // 防止闪图
    }
  }
})
let imageIsExist = (url) => {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function () {
      if (this.complete == true){
        resolve(true);
        img = null;
      }
    }
    img.update = function () {
      if (this.complete == true){
        resolve(true);
        img = null;
      }
    }
    img.onerror = function () {
      resolve(false);
      img = null;
    }
    img.src = url;
  })
}

Vue.component('view-page', ViewPage)
Vue.mixin(mixin)
Vue.prototype.VAR = VAR

const $store = store(Vue)

const BASE64 = {
  enKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  deKey: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
  encode: function (src) {
    // 用一个数组来存放编码后的字符，效率比用字符串相加高很多。
    const str = []
    let ch1, ch2, ch3
    let pos = 0
    // 每三个字符进行编码。
    while (pos + 3 <= src.length) {
      ch1 = src.charCodeAt(pos++)
      ch2 = src.charCodeAt(pos++)
      ch3 = src.charCodeAt(pos++)
      str.push(this.enKey.charAt(ch1 >> 2), this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f))
      str.push(this.enKey.charAt(((ch2 << 2) + (ch3 >> 6)) & 0x3f), this.enKey.charAt(ch3 & 0x3f))
    }
    // 给剩下的字符进行编码。
    if (pos < src.length) {
      ch1 = src.charCodeAt(pos++)
      str.push(this.enKey.charAt(ch1 >> 2))
      if (pos < src.length) {
        ch2 = src.charCodeAt(pos)
        str.push(this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f))
        str.push(this.enKey.charAt(ch2 << 2 & 0x3f), '=')
      } else {
        str.push(this.enKey.charAt(ch1 << 4 & 0x3f), '==')
      }
    }
    // 组合各编码后的字符，连成一个字符串。
    return str.join('')
  },
  decode: function (src) {
    // 用一个数组来存放解码后的字符。
    const str = []
    let ch1, ch2, ch3, ch4
    let pos = 0
    // 过滤非法字符，并去掉'='。
    src = src.replace(/[^A-Za-z0-9+/]/g, '')
    // decode the source string in partition of per four characters.
    while (pos + 4 <= src.length) {
      ch1 = this.deKey[src.charCodeAt(pos++)]
      ch2 = this.deKey[src.charCodeAt(pos++)]
      ch3 = this.deKey[src.charCodeAt(pos++)]
      ch4 = this.deKey[src.charCodeAt(pos++)]
      str.push(String.fromCharCode(
        (ch1 << 2 & 0xff) + (ch2 >> 4), (ch2 << 4 & 0xff) + (ch3 >> 2), (ch3 << 6 & 0xff) + ch4))
    }
    // 给剩下的字符进行解码。
    if (pos + 1 < src.length) {
      ch1 = this.deKey[src.charCodeAt(pos++)]
      ch2 = this.deKey[src.charCodeAt(pos++)]
      if (pos < src.length) {
        ch3 = this.deKey[src.charCodeAt(pos)]
        str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4), (ch2 << 4 & 0xff) + (ch3 >> 2)))
      } else {
        str.push(String.fromCharCode((ch1 << 2 & 0xff) + (ch2 >> 4)))
      }
    }
    // 组合各解码后的字符，连成一个字符串。
    return str.join('')
  }
}

const getTokenObj = function (token) {
  return token ? JSON.parse(BASE64.decode(token.split('.')[1])) : null
}

// 產生16位随机字符串，大小写英数字混合
function randomString(length = 16) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i)
      result += str[Math.floor(Math.random() * str.length)]
  return result
}

// 将原本要请求的参数转为json格式，并加上现在时间戳（秒，10位数字）
function changeToJson(body, timestamp) {
  let bodyText = JSON.stringify(body) + timestamp

  return bodyText
}

const public_key = getPublicKey()
const needEncrypt = process.env.VUE_APP_ENCRYPT === 'yes'

// 添加请求拦截器
Vue.prototype.$http.interceptors.request.use(function (config) {
  const aesKey = randomString()
  const timestamp = Math.floor(Date.now() / 1000).toString()

  // 設定 rsa publickey，以 publickey 對 aeskey 用 rsa 加密並 base64 encode
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(public_key)
  const encryptKey = encryptor.encrypt(aesKey).toString()

  if (config.baseURL && localStorage.Public_User && localStorage.Public_User === 'vm') {
    //当baseURL不等于空，并且为vm虚拟帐号登录时修改baseURL
    config.baseURL = '/frontend/vm'
  }
  if(config.url.includes('/api')){
    config.baseURL =  ''
  }
  // 实时添加token
  config.headers['Authorization'] = localStorage.token

  // switch (config.headers.v) {
  //   case 1:
  //     config.headers['Accept'] = 'application/json, text/plain, */*'
  //     break

  //   case 2:
  //     config.headers['Accept'] = 'application/x.tg.v2+json'
  //     break

  //   default:
  //     config.headers['Accept'] = 'application/x.tg.v2+json'
  //     break
  // }

  delete config.headers.v

  // 加密
  if (needEncrypt) {
    config.headers['request-id'] = encryptKey
    config.headers.timestamp = timestamp

    if (config.method === 'get') {
      // 將 data 對 aeskey 用 aes 加密並 base64 encode
      if (!config.params) {
        config.params = {}
      }
      const aesEncrypted = cryptoES.AES.encrypt(changeToJson(config.params, timestamp),cryptoES.enc.Utf8.parse(aesKey), {
        mode: cryptoES.mode.ECB,
      })
      const encryptedBody = cryptoES.enc.Base64.stringify(aesEncrypted.ciphertext)
      config.params['encryptedBody'] = encryptedBody
    } else {
      if (!config.data) {
        config.data = {}
      }
      // 將 data 對 aeskey 用 aes 加密並 base64 encode
      const aesEncrypted = cryptoES.AES.encrypt(changeToJson(config.data, timestamp), cryptoES.enc.Utf8.parse(aesKey), {
        mode: cryptoES.mode.ECB,
      })
      const encryptedBody = cryptoES.enc.Base64.stringify(aesEncrypted.ciphertext)
      config.data = {
        encryptedBody,
      }
      config.data = qs.stringify(config.data)
    }
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
// token 超时验证
let tokenRefreshing = false
Vue.prototype.$http.interceptors.response.use(function (response) {
  if(response.data.sign > localStorage.getItem('configTime') && !response.config.url.includes('/config')){
    $store.dispatch('main/getConfigVerify', {})
  }
  if (response.status === 4000 || response.code === 4000 || response.data.code === 4000) {
    router.replace('/code/4000')
    return response
  }

  switch (response.data.code) {
    case 5000:
      // router.replace('/code/5000')
      window.location.href = window.location.origin + '/static/public/html/weihu/index.html'
      return response

    case 5002:
    case 5003:
      setTimeout(() => {
        delete localStorage.token
        delete localStorage.userInfo
        delete localStorage.Public_User
        $store.state.user.token = ''
        $store.state.user.UserInfo = '';
        var currHref = window.location.href;
        if(sessionStorage['isCocos'] && sessionStorage['isCocos'] == '1') {
          if (/android/i.test(navigator.userAgent)){
            window.app.gohome()
          } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent)){
            window.webkit.messageHandlers.gohome.postMessage(null);
          }
        }else if (currHref.includes('app=true')){
          //如果是app端嵌入的
          if(!['/admin/login','/activity','/lottery','/user/money-rule'].includes(currHref)){
            if(Vue.prototype.$config.homeLogin) {
              Vue.prototype.$config.home === 'vns' ? router.push('/home-login-b') : Vue.prototype.$config.home === 'qp' ? router.push('/home-login-c') :router.push('/home-login-a')
            }else {
              router.push({path:'/admin/login',replace:true})
            }
          }
        }else{
          if(currHref.indexOf('/admin/login') <= -1){
            if(Vue.prototype.$config.homeLogin) {
              Vue.prototype.$config.home === 'vns' ? router.push('/home-login-b') : Vue.prototype.$config.home === 'qp' ? router.push('/home-login-c') :router.push('/home-login-a')
            }else {
              router.push({path:'/admin/login',replace:true})
            }
          }
        }
        // if(window.location.href.indexOf('/admin/login') <= -1){
        //   router.push('/admin/login')
        // }
        if (window.balanceTasker){
          // 清除获取余额轮询
          clearInterval(window.balanceTasker)
        }
      }, 0)
      return null
    case 5004:
      if($store.state.user.userInfo.payPassword === 'set') {
        $store.state.main.distanceLogin = true
        router.push('/home')
      }
      return
    case 5005:
      Vue.prototype.toastText(response.data.message, 'middle')
      window.history.back()
      return response
  }

  if (!tokenRefreshing) {
    const now = parseInt((new Date(response.headers.date).getTime() / 1000).toString())
    let obj
    try {
      obj = getTokenObj(localStorage.token)
    } catch (e) {
      localStorage.token = ''
    }
    if (obj) {
      const val = obj.exp - now
      if (val < 0) {
        $store.commit('user/clean')
      } else if (val <= 1800 && val >= 0) {
        tokenRefreshing = true
        $store.dispatch('user/refreshToken', {
          callback: () => {
            tokenRefreshing = false
          }
        })
      }
    }
  }

  return response
}, function (error) {
  const originalRequest = error.config
  const { rtt, downlink, effectiveType, saveData } = navigator.connection
  console.log(`有效网络连接类型: ${effectiveType}`)
  console.log(`估算的下行速度/带宽: ${downlink}Mb/s`)
  console.log(`估算的往返时间: ${rtt}ms`)
  console.log(`打开/请求数据保护模式: ${saveData}`)
  console.log(error)
  console.log(error.message)
  console.log(error.code)
  console.log(navigator.onLine)
  if (
    // error.code === 'ECONNABORTED' &&
  // error.message.indexOf('timeout') !== -1 &&
  originalRequest && originalRequest.url.indexOf('/member/balance') === -1 &&
    !originalRequest.headers.noToast) {
    if (error && error.toString().toLowerCase().includes('timeout')) {
      Vue.prototype.toastText('网络连接超时', 'middle')
    } else if (error && error.toString().toLowerCase().includes('network error')) {
      if (!navigator.onLine) {
        Dialog({
          title: '当前网络不可用，请检查网络后重试'
        })
      }
    }
    // return axios.request(originalRequest);
  }

  return Promise.reject(error)
})

const find = function (str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x;
}

const isIos = function() {
  let u = window.navigator.userAgent
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}
$store.dispatch('main/getConfigVerify', {})


// 页面切换 相关
const pageList = []
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']
let isPush = false

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})
router.beforeEach(function (to, from, next) {
  if($store.state.key.show) {
    $store.state.key.show = false
  }
  Vue.prototype.toastClear()
  if (to.meta.keepAlive) {
    $store.commit('main/keepAlive', to.name)
  }
  if (from.query['agent']) {
    localStorage['agent'] = from.query['agent']
  }
  if (to.query['agent']) {
    localStorage['agent'] = to.query['agent']
  }
  if (to.query['down']) {
    if(sessionStorage['down']) {
      sessionStorage['down'] = Number(to.query['down']) + 1
    }else {
      sessionStorage['down'] = to.query['down']
    }
  }
  if (from.query['channelCode']) {
    localStorage['channelCode'] = localStorage['agent'] = from.query['channelCode']
  }
  if (to.query['channelCode']) {
    localStorage['channelCode'] = localStorage['agent'] = to.query['channelCode']
  }
  if (from.query['back_url']) {
    localStorage['back_url'] = from.query['back_url']
  }
  if (to.query['back_url']) {
    localStorage['back_url'] = to.query['back_url']
  }
  if(to.query['signer']){
    localStorage['signer'] = to.query['signer']
  }
  if(to.path !== "/home-login-a" && to.path !== "/home-login-b" && to.path !== "/home-login-c"  && config.homeLogin && !$store.state.user.token && !to.query.app) {
    if(to.query['register'] === '1') {
      sessionStorage.setItem('showBlackAdvert','1')
    }
    setTimeout(() => {
      config.home === 'vns' ? router.replace('/home-login-b') : config.home === 'qp' ? router.replace('/home-login-c') : router.replace('/home-login-a')
    }, 0);
  }
  // if(!to.query.token && !window.localStorage.isApp && config.name === 'amhg' && to.path !== "/android-page" && /android/i.test(navigator.userAgent)) {
  //   router.replace('/android-page')
  // }
  if (to.query['register'] === '1') {
    const index = 'index=1'
    if(!localStorage['userInfo'] || JSON.stringify(localStorage['userInfo']) === '{}') {
      sessionStorage.setItem('showBlackAdvert','1')
      if(!config.homeLogin) {
        switch (config.home) {
          case VAR.HOME.VNS:
            // if(['vnso','amhg'].includes(this.$config.name)) {
            //     this.type = 'vnso'
            //   }else {
            //     this.type = 'vns'
            //   }
            // this.type = "vns";
            router.push({ path:"/admin/vns-login?"+index})
            break;
          case VAR.HOME.QP:
            if(['103qp','aqvns','dalao'].includes(config.name)) {
              // this.type = 'kyqp'
              router.push("/admin/kyqp-login?"+index);
            } else if (['fhcp', 'xpj83', 'hty', 'dqr','js85'].includes(config.name)) {
              // this.type = 'fhcp'
              router.push("/admin/fhcp-login?"+index);
            } else if(config.newQP) {
              // this.type = 'newqp'
              router.push("/admin/newqp-login?"+index);
            } else if (config.name === 'betnew') {
              //this.type = 'betnew'
              router.push("/admin/betnew-login?"+index);
            } else if (config.name === '839qp') {
              // this.type = '839qp'
              router.push("/admin/etnqp-login?"+index);
            } else {
              // this.type = "qp";
              router.push("/admin/c-login?"+index);
            }
            break;
          case VAR.HOME.AMHG:
            // this.type = "amhg";
            router.push("/admin/amhg-login?"+index);
            break;
          case VAR.HOME.CPXPJ:
            // this.type = "cpxpj";
            router.push("/admin/cpxpj-login?"+index);
            break;  
          case VAR.HOME.AQVNS:
            // this.type = "aqvns";
            router.push("/admin/aqvns-login?"+index);
            break;  
          case VAR.HOME.BLUSH:
            if (["cpxpj"].includes(config.name)) {
              // this.type = "cpxpj";
              router.push("/admin/cpxpj-login?"+index);
            } else if (["tccp","tyc86"].includes(config.name)) {
              // this.type = "tccp";
              router.push("/admin/tccp-login?"+index);
            } else {
              this.type = "Blush";
              router.push("/admin/Blush-login?"+index);
            }
            break;
          default:
            if (["vnst"].includes(config.name)) {
              // this.type = "vnst2";
              router.push("/admin/vnst2-login?"+index);
            } else {
              router.push("/admin/login-default?"+index);
            }
            break;
        }
      }
    }
  }else if (to.path === '/admin/login'){
    const index = ''
    if(!localStorage['userInfo'] || JSON.stringify(localStorage['userInfo']) === '{}') {
      if(!config.homeLogin) {
        switch (config.home) {
          case VAR.HOME.VNS:
            // if(['vnso','amhg'].includes(this.$config.name)) {
            //     this.type = 'vnso'
            //   }else {
            //     this.type = 'vns'
            //   }
            // this.type = "vns";
            router.push({ path:"/admin/vns-login?"+index})
            break;
          case VAR.HOME.QP:
            if(['103qp','aqvns','dalao'].includes(config.name)) {
              // this.type = 'kyqp'
              router.push("/admin/kyqp-login?"+index);
            } else if (['fhcp', 'xpj83', 'hty', 'dqr', 'js85'].includes(config.name)) {
              // this.type = 'fhcp'
              router.push("/admin/fhcp-login?"+index);
            } else if(config.newQP) {
              // this.type = 'newqp'
              router.push("/admin/newqp-login?"+index);
            } else if (config.name === 'betnew') {
              //this.type = 'betnew'
              router.push("/admin/betnew-login?"+index);
            } else if (config.name === '839qp') {
              // this.type = '839qp'
              router.push("/admin/etnqp-login?"+index);
            } else {
              // this.type = "qp";
              router.push("/admin/c-login?"+index);
            }
            break;
          case VAR.HOME.AMHG:
            // this.type = "amhg";
            router.push("/admin/amhg-login?"+index);
            break;
          case VAR.HOME.CPXPJ:
            // this.type = "cpxpj";
            router.push("/admin/cpxpj-login?"+index);
            break;
          case VAR.HOME.AQVNS:
            // this.type = "aqvns";
            router.push("/admin/aqvns-login?"+index);
            break;  
          case VAR.HOME.BLUSH:
            if (["cpxpj"].includes(config.name)) {
              // this.type = "cpxpj";
              router.push("/admin/cpxpj-login?"+index);
            } else if (["tccp","tyc86"].includes(config.name)) {
              // this.type = "tccp";
              router.push("/admin/tccp-login?"+index);
            } else {
              this.type = "Blush";
              router.push("/admin/Blush-login?"+index);
            }
            break;
          default:
            if (["vnst"].includes(config.name)) {
              // this.type = "vnst2";
              router.push("/admin/vnst2-login?"+index);
            } else {
              router.push("/admin/login-default?"+index);
            }
            break;
        }
      }
    }
  }
  if(to.query['vnstDownload'] === '1' || to.query['adminDownload'] === '1' && ['vnst','vnso','amhg',].includes(config.name)) {
    sessionStorage.setItem('showBlackAdvert','2')
    router.push('/admin/login')
  }
  $store.commit('updateLoadingStatus', { pageLoading: true })
  $store.state.main.tabIndex = -1
  switch (to.path) {
    case '/home':
      $store.state.main.tabIndex = 0
      break
    case '/save':
      if(!config.newQP) {
        $store.state.main.tabIndex = 1
      }
      break
    case '/user/record':
      if (config.name === 'fhcp' || config.name === '839qp' || config.name === 'xpj83') break // fhcp 839qp xpj83 只有在個人中心才有投注記錄
      $store.state.main.tabIndex = 3
      break
    case '/user':
      if (config.name === 'betnew') $store.state.main.tabIndex = 3 // betnew only 4 tabs
      else if (config.name === 'js85') $store.state.main.tabIndex = 5 // js85 has 6 tabs
      else $store.state.main.tabIndex = 4
      break
    case '/user/result':
      if(config.newQP) {
        $store.state.main.tabIndex = 1
      }
  }

  const toIndex = to.meta.index
  const fromIndex = from.meta.index
  if (toIndex !== fromIndex) {
    $store.commit('main/setAnimation', toIndex > fromIndex ? 'slide-left' : 'slide-right')
    pageList.push(from.fullPath)
  } else {
    let last = pageList.pop()
    if (!last) {
      $store.commit('main/setAnimation', '')
      pageList.push(from.fullPath)
    } else if (to.fullPath === last) {
      $store.commit('main/setAnimation', 'slide-right')
    } else {
      $store.commit('main/setAnimation', 'slide-left')
      pageList.push(last)
      pageList.push(from.fullPath)
    }
  }

  if (!isPush && (Date.now() - endTime) > 50) {
    $store.commit('main/setAnimation', '')
  }

  endTime = 0

  if (window.document.documentElement.scrollTo) window.document.documentElement.scrollTo(0, 0)
  else window.document.documentElement.scrollTop = 0

  if (window.document.body.scrollTo) window.document.body.scrollTo(0, 0)
  else window.document.body.scrollTop = 0

  const app = document.getElementById('app')
  if (app) {
    if (app.scrollTo) app.scrollTo(0, 0)
    else app.scrollTop = 0
  }
  if($store.state.main.showBindPhone) {
    $store.commit('main/setShowBindPhone', false)
  }
  let _configSite=['99qp','kkqp','vnso','amxpj','amhg','qmcp','ybcp','aqvns','hty','fhcp','wycp','dalao','amvns','dqr','839qp','tccp','tyc86','betnew','cpxpj','xpj83','js85']
  if(_configSite.includes(config.name)&& to.path==='/save') {
    if($store.state.main.config.depositPhoneValidate=='on'&& $store.state.user.userInfo.phone === ''){
      $store.commit('main/setShowBindPhone', true)
    }else if($store.state.main.config.depositBankValidate=='on'&& $store.state.user.userInfo.cardNum=='unset') {
      $store.commit("main/setBindBankMsg", "绑定银行卡");
      $store.commit("main/setBindBankId", 5012);
      $store.commit("main/setBindBank", true);
    }else {
      next()
    }
  }else {
    next()
  }
  // next()
})

router.afterEach(function (to) {
  $store.commit('updateLoadingStatus', { pageLoading: false })
  isPush = false
  onResize()
})

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g,"");
}


// rem相关
window.rem = 100
const onResize = function () {
  const width = document.documentElement.offsetWidth
  window.rem = 100 * (width / 750)
  window.document.documentElement.style.fontSize = window.rem + 'px'

  $store.state.main.windowHeight = window.innerHeight
  $store.state.main.windowWidth = window.innerWidth
}
window.onresize = onResize
window.baseHeight = window.innerHeight

onResize()

const viewPort = document.querySelector('meta[name=viewport]')
const userAgent = navigator.userAgent.toString()
let status = false
window.chromeVersion = NaN

if (/\sChrome\/[\d.]+\s/.test(userAgent)) {
  window.chromeVersion = parseInt(userAgent.replace(/.*\sChrome\/([\d]+)[\d.]+\s.*/, '$1'))
}

if (window.chromeVersion && window.chromeVersion < 51) {
  status = true
}

setInterval(function () {
  if (status) {
    viewPort.setAttribute('content', `width=750,user-scalable=no,initial-scale=${window.screen.width / 750},maximum-scale=2,minimum-scale=0,viewport-fit=cover`)
  }

  $store.state.main.windowHeight = window.innerHeight
  $store.state.main.windowWidth = window.innerWidth
}, 100)

Vue.prototype.domResize = domResize
Vue.prototype.dayJs = dayJs

window.tryOpen = function (link) {
  if (!window.open(link, '_blank')) {
    window.location.href = link
  }
}

new Vue({
  router,
  store: $store,
  render: h => h(App)
}).$mount('#app')

Vue.use(VNumberKeyboard)
