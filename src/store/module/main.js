import axios from 'axios'
const service = axios.create({
  headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
  timeout: 10000, // 请求超时时间
  withCredentials: false  //指示是否跨站点访问控制请求
});
export default function (Vue) {
  // 创建axios实例

  //axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  const $http = Vue.prototype.$http
  const $config = Vue.prototype.$config

  const MAIN_CONFIG = 'config'
  const MAIN_CONFIG_TIME = 'configTime'

  const theme = localStorage.theme && localStorage.theme !== 'undefined' ? localStorage.theme : ($config.theme || 'default')

  const mainStore = {
    namespaced: true,
    state: {
      config: JSON.getObjByLocalStorage(MAIN_CONFIG),
      showTab: true,
      animation: '',
      theme,
      keyBoardStatus: false,
      tabIndex: 0,
      loadingText: '',
      tabHeight: 0,
      showMask: {
        page: '',
        status: false
      },
      closeMask: {
        page: '',
        status: false
      },
      keepAliveComponents: [],
      windowHeight: 0,
      windowWidth: 0,
      showOverlay: false,
      iosAlert: {
        content: '',
        showTitle: false,
        title: '',
        show: false,
        className: '',
        okCallback: undefined,
        showNo: true,
        okText: '',
        width: 5.5,
        top: '46%',
        styleObj: {
          titleCss: { paddingTop: 0.48, color: '#333333' },
          ContentCss: { padding: 0.43, color: "#444444" }
        }
      },
      showDialog: {
        home: {
          login: true,
          noLogin: true
        },
        game: {
          login: true,
          noLogin: true
        },
      },
      marqueeDialog: false,
      stopDialog: false,
      stopDialogText: '',
      marqueeList: [],
      lotteryZJ: {
        uid: '',
        text: ''
      },
      siteId: null,
      isRedLop: false,
      redLopeMoney: null,
      redLopeType: 0,
      redLopeId: null,
      hongbaoyuMoney:null,
      isRedPack:false,
      closeRedPackRain:false,
      showRedPackRain:false,
      goBack:false,
      distanceLogin: false,
      VerificationCode: 'imgCode',
      showSaveFailure: false,
      saveFailureData: {},
      closedNoticeDialog :false,
      closedTypeNoticeDialog: false,
      closedPK10NoticeDialog: false,
      gameSortV4Note: {},
      ShareTrace : {},
      goGameNumber: 0,
      downloadType: '',
      personal_commission_mode : '',
      showBindPhone: false,
      bindBank:false,
      bindBankMsg: '',
      bindBankId:'',
      activeId:'',
      saveMoney:'',
      needUpdate: false,  // 當 config updated_at 與 本地儲存 updated_at 不同時為 true
    },
    getters: {},
    mutations: {
      setVerificationCode(state,data){
        state.VerificationCode = data
      },
      keepAlive(state, component) {
        !state.keepAliveComponents.includes(component) && state.keepAliveComponents.push(component)
      },
      noKeepAlive(state, component) {
        const index = state.keepAliveComponents.indexOf(component)
        index !== -1 && state.keepAliveComponents.splice(index, 1)
      },
      setTheme(state, theme) {
        theme = theme || 'default'
        state.theme = theme
        localStorage.theme = theme
      },
      isShowMask(state, datas) {
        state.showMask = datas
      },
      isCloseMask(state, datas) {
        state.closeMask = datas
      },
      keyBoardStatus(state, boolean) {
        state.keyBoardStatus = boolean
      },
      setAnimation(state, animation) {
        animation = animation || ''
        state.animation = animation
        localStorage.animation = animation
      },
      iosAlert(state, param) {
        state.iosAlert.styleObj = param.styleObj
        state.iosAlert.title = param.title || ''
        state.iosAlert.content = param.content || ''
        state.iosAlert.show = true
        state.className = param.className
        state.iosAlert.okCallback = param.okCallback
        state.iosAlert.okText = param.okText
        if (typeof param.showNo === 'undefined') {
          param.showNo = true
        } else {
          state.iosAlert.showNo = param.showNo
        }
      },
      marqueeDialog(state, boolean) {
        state.marqueeDialog = boolean
      },
      marqueeList(state, data) {
        state.marqueeList = data
      },
      stopDialog(state, boolean) {
        state.stopDialog = boolean
      },
      stopDialogText(state, data) {
        state.stopDialogText = data
      },
      getLottery(state, data) {
        state.lotteryZJ = data
      },
      getisRedLop(state, data) {
        state.isRedLop = data
      },
      getRedLopeMoney(state, data) {
        state.redLopeMoney = data
      },
      getRedLopeType(state, data) {
        state.redLopeType = data
      },
      getRedLopeId(state, data) {
        state.redLopeId = data
      },
      getHongbaoyuMoney(state, data){//首页红包雨
        state.hongbaoyuMoney = data
      },
      getIsRedPack(state, data){
        state.isRedPack=data
      },
      getShowRedPackRain(state,data){
        state.showRedPackRain=data
      },
      goBack(state,data){
        state.goBack=data
      },
      setCloseRedPackRain(state, data){
        state.closeRedPackRain=data;
      },
      setDistanceLogin(state,boolean) {
        state.distanceLogin = boolean
      },
      setShowSaveFailure(state,boolean) {
        state.showSaveFailure = boolean
      },
      setSaveFailureData(state,data) {
        state.saveFailureData = data
      },
      setClosedNoticeDialog(state,bool) {
        state.closedNoticeDialog = bool
      },
      setClosedTypeNoticeDialog(state,bool) {
        state.closedTypeNoticeDialog = bool
      },
      setClosedPK10NoticeDialog(state,bool) {
        state.closedPK10NoticeDialog = bool
      },
      setShareTrace (state,data) {
        state.ShareTrace = data
      },
      setGoGameNumber(state,num) {
        state.goGameNumber = num
      },
      setDownloadType(state,data) {
        state.downloadType = data
      },
      setShowBindPhone(state,bool) {
        state.showBindPhone = bool
      },
      setBindBank(state,bool) {
        state.bindBank = bool
      },
      setBindBankMsg(state,str) {
        state.bindBankMsg = str
      },
      setActiveId(state,str) {
        state.activeId = str
      },
      setBindBankId(state,id) {
        state.bindBankId = id
      },
    },
    actions: {
      // getWebSocket() {
      //   return new Promise((resolve, reject) => {
      //     try {
      //       resolve(JSON.parse(localStorage['main/getWebSocket']))
      //     } catch (e) {
      //       $http.get('/websocket').then(res => {
      //         res = res.data
      //         if (res.code === 200) resolve(res)
      //         else reject(res)
      //       }).catch(err => {
      //         reject(err)
      //       })
      //     }
      //   })
      // },
      getConfigVerify($store) {
        return new Promise((resolve, reject) => {
          $http.get('/config').then(res => {
            if (res.data['code'] === 200) {
              res = res.data.data
              const $siteConfig = res.siteConfig
              if(res.siteConfig.limit) {
                localStorage['configLimit'] = JSON.stringify(res.siteConfig.limit)
                $siteConfig.limit = JSON.parse(localStorage['configLimit'])
              }else {
                localStorage['configLimit'] = '{}'
              }
              $store.state.siteId = res.id
              $siteConfig['siteId'] = res.id
              $config.download.ios = $siteConfig.IOS.link
              localStorage.downloadIosLink = $siteConfig.IOS.link
              $config.download.android = $siteConfig.Android.link
              localStorage.downloadAndroidLink = $siteConfig.Android.link
              if($siteConfig.IOS.enterprisesignLink) localStorage.enterprisesignLink = $siteConfig.IOS.enterprisesignLink
              if($siteConfig.IOS.supersignLink) localStorage.supersignLink = $siteConfig.IOS.supersignLink
              localStorage.setItem("siteCode",res.siteCode)
              JSON.setObjByLocalStorage(MAIN_CONFIG, $siteConfig)
              $store.state.needUpdate = localStorage[MAIN_CONFIG_TIME] !== String(res['updated_at'])
              localStorage[MAIN_CONFIG_TIME] = res['updated_at' || '']
              $store.state.config = $siteConfig
              localStorage['rebateLotteryConfig'] = res['rebateLotteryConfig']
              localStorage['personal_commission_mode'] = res['personal_commission_mode']
              $store.state.personal_commission_mode = res['personal_commission_mode']
              localStorage.SiteStaticsUrl = $siteConfig.statics
              // if($config.name !== '839qp') {
              //   Object.keys(res.gameSortNew.h5).forEach(_id => {
              //     if ($config.imgStyle) {//风格替换设置
              //       let resStyle = $siteConfig.theme;
              //       localStorage['main/gameSort/' + _id] = JSON.stringify(
              //         res.gameSortNew.h5[_id].map((ff, i) => {
              //           ff.icon = ff.icon.replace(resStyle, $config.imgStyle)
              //           if ($config.imgGameList.includes(_id) && $config.imgLimit) {
              //             let iconSplit = ff.icon.split('/')
              //             let iconName = iconSplit[iconSplit.length - 1]
              //             let iconNameSplit = iconName.split('.')
              //             let newName = ''
              //             if (i === 0 || i % 5 === 0) {
              //               newName = iconNameSplit[0] + $config.imgLimit + 1 + '.' + iconNameSplit[1]
              //             } else {
              //               newName = iconNameSplit[0] + $config.imgLimit + 2 + '.' + iconNameSplit[1]
              //             }
              //             ff.icon = ff.icon.replace(iconName, newName)
              //           }
              //           return ff
              //         }))
              //     } else {
              //       localStorage['main/gameSort/' + _id] = JSON.stringify(res.gameSortNew.h5[_id])
              //     }

              //   })
              // }
              if(res.siteConfig.antiCheatSystem && res.siteConfig.antiCheatSystem === 'on') {
                initWatchman({
                  productNumber: 'YD00815584448686',
                  onload:  (instance) => {
                    $store.rootState.user.Watchman = instance
                  }
                });
              }
              let u = window.navigator.userAgent
              let isIOS =  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
              const find = function (str, cha, num) {
                var x = str.indexOf(cha);
                for (var i = 0; i < num; i++) {
                  x = str.indexOf(cha, x + 1);
                }
                return x;
              }
              let theAppKey = ''
              $store.commit("setDownloadType", res.siteConfig.downloadType);
              if($store.state.downloadType === 'testflight') {
                if(sessionStorage['down'] && sessionStorage['down'] === '1') {
                  if(isIOS && res.siteConfig.IOS && res.siteConfig.IOS.link) {
                    let query = ''
                    let goPath = ''
                    let agent = localStorage['agent'] || localStorage['channelCode'];
                    let downloadUrl = res.siteConfig.IOS.link
                    if(agent) {
                      query = '?agent=' + agent
                      downloadUrl ? query += ('&downloadUrl=' + downloadUrl) : ''
                    }else {
                      query = '?downloadUrl=' + downloadUrl
                    }
                    query += '&windowHref=' +  window.location.href
                    if($store.state.ShareTrace && $store.state.ShareTrace.downloadUrl) {
                      query += '&ShareTrace=1'
                      goPath = $store.state.ShareTrace.downloadUrl + query
                    }else {
                      goPath = window.location.origin + '/app-download/index.html' + query
                    }
                    window.history.pushState(window.location.href, null, window.location.href)
                    window.location.href = goPath
                  }
                }else {
                  // sharetrace集成初始化
                  let str = window.location.href;
                  let agent = localStorage["agent"] || localStorage["channelCode"];
                  let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, find(str, "/", 2));
                  let par2 = "channelDomain=" + str.substring(0, find(str, "/", 2));
                  if (Vue.prototype.$config.name === "99qp") {
                    theAppKey = "40510f4c2736443b";
                  } else if (Vue.prototype.$config.name === "kkqp") {
                    theAppKey = "fb90329e15f8d40f";
                  } else if (Vue.prototype.$config.name === "amxpj") {
                    theAppKey = 'cdd75b439307730b';
                  } else if (Vue.prototype.$config.name === "tyc82") {
                    theAppKey = '24347371257e5a7d';
                  } else if (Vue.prototype.$config.name === "xpj80") {
                    theAppKey = 'd445a197f1389dcf';
                  } else if (Vue.prototype.$config.name === "vns81") {
                    theAppKey = 'e6e705a36eadcdda';
                  } else if (Vue.prototype.$config.name === "vnst") {
                    par1 =  "channelCode=" + str.substring(0, find(str, "/", 2));
                    par2 =  "channelCode=" + str.substring(0, find(str, "/", 2));
                    theAppKey = "01ab6d0189d8460b";
                  } else if (Vue.prototype.$config.name === "103qp") {
                    theAppKey = '97a2fc807884dafc';
                  } else if (Vue.prototype.$config.name === "fhcp") {
                    theAppKey = '3837b72f4154df7b';
                  } else if (Vue.prototype.$config.name === "839qp") {
                    theAppKey = '557d0af46a3d28bb';
                  } else if (Vue.prototype.$config.name === "hty") {
                    theAppKey = "e721ac3f4610abfc";
                  } else if (Vue.prototype.$config.name === "dqr") {
                    theAppKey = "30615fd30d7c4f0f";
                  } else if (Vue.prototype.$config.name === "aqvns") {
                    theAppKey = "50bfce5829ee17fc";
                  } else if (Vue.prototype.$config.name === "vnso") {
                    theAppKey = "9e6bf73a4954f56c";
                  } else if (Vue.prototype.$config.name === "tccp") {
                    theAppKey = "ddd81012a6929fdd";
                  } else if (Vue.prototype.$config.name === "tyc86") {
                    theAppKey = "67215a1bcd3263bd";
                  } 
                  else if (Vue.prototype.$config.name === "dalao") {
                    theAppKey = "f159b054e8f8bbaa";
                  } else if (Vue.prototype.$config.name === "amhg") {
                    theAppKey = "4c811010c940142d";
                  } else if (Vue.prototype.$config.name === "betnew") {
                    theAppKey = "c89fa1dfcc64152b";
                  } else if (Vue.prototype.$config.name === "js85") {
                    theAppKey = "984da84b0d5c8e5b";
                  }
                  
                  ShareTrace.init({
                    appkey: theAppKey, // 此值必填
                    param: agent ? par1 : par2,
                    success: () => {
                      $store.commit("setShareTrace", ShareTrace);
                    },
                  });
                }
              }
              // if(localStorage['VerificationCode']){
              //   localStorage.removeItem('VerificationCode')
              // }
              // localStorage.setItem('VerificationCode', res.siteConfig.VerificationCode.h5[0] || 'imgCode')
              resolve(res)
            } else {
              console.error('get /config error')
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      getNotice(store, { data, callback }) {
        $http.post('/site/notice', data).then(res => {
          callback(res)
        })
      },
      getPosition(store, { data, callback }) {
        $http.post('/site/position', data).then(res => {
          if (res.status === 200) {
            if (typeof callback === 'function') callback(res)
          }
        })
      },
      /**
       * 获取游戏列表
       * @param store
       * @param callback
       */
      getGames(store, { callback }) {
        if (localStorage['main/getGames']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['main/getGames']))
        }
        $http.post('/games/facade').then(res => {
          if (res.status === 200) {
            localStorage['main/getGames'] = JSON.stringify(res)
            if (typeof callback === 'function') callback(res)
          }
        })
      },
      about({ state }, { callback }) {
        let res = localStorage['main/about']
        if (res && typeof callback === 'function') {
          try {
            res = JSON.parse(res)
          } catch (e) {
            console.warn(e)
          }
          if (typeof res === 'object') {
            callback(res.data)
          }
        }
        $http.get(
          '/notice/about',
          {
            params: {
              desc_client_type: 'html'
            },
            // headers: {
            //   Accept: 'application/x.tg.v2+json'
            // }
          }
        ).then(res => {
          localStorage['main/about'] = JSON.stringify(res)
          if (typeof callback === 'function') {
            callback(res.data)
          }
        })
      },
      payList({ commit }, { devices, callback }) {
        if (localStorage['main/paylist']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['main/paylist']))
        }
        $http.post('/deposit/payment/category', { devices }).then(res => {
          localStorage['main/paylist'] = JSON.stringify(res.data)
          if (typeof callback === 'function') callback(res.data)
        })
      },
      //获取新版游戏
      getNewGame({ store,state }, { idIndex,id, callback}) {
        const idConfig = {
          10000:4,
          10001:2,
          10002:6,
          10003:5,
          10004:1,
          10005:3,
          30003:4
        }
        const ids = id.toString().split('|')
        let catchStatus = ids.every(_id => localStorage['main/gameSort/' + _id])
        if (catchStatus && typeof callback === 'function' && !state.needUpdate) {
          const res = {}
          ids.forEach(_id => {
            const itemData = JSON.getObjByLocalStorage('main/gameSort/' + _id)
            if (Object.prototype.toString.call(itemData) === '[object Object]' || Object.prototype.toString.call(itemData) === '[object Array]') {
              res[_id] = itemData
            } else {
              catchStatus = false
              delete localStorage['main/gameSort/' + _id]
            }
          })
          if (catchStatus) {
            callback(res, id)
          }
        }
        if (!catchStatus || state.needUpdate) {
          let data = {}
          let postData = {
            device: 'h5',
          }
          if(idIndex) {
            postData['id'] = idIndex
          }
          if($config.name === 'qygj') {
            postData['style'] = 'style30'
          }else if($config.name === 'bet365') {
            postData['style'] = 'style31'
          }else if($config.name === 'vnst') {
            postData['style'] = 'style32'
          }else if($config.name === 'amvnsr') {
            postData['style'] = 'style33'
          }else if($config.name === 'amxpj') {
            postData['style'] = 'style34'
          }else if($config.name === '99qp') {
            postData['style'] = 'style36'
          }else if($config.name === 'kkqp') {
            postData['style'] = 'style38'
          }else if($config.name === 'klk') {
            postData['style'] = 'style40'
          }else if($config.name === '839qp') {
            postData['style'] = 'style41'
          }else if($config.name === 'qmcp') {
            postData['style'] = 'style43'
          }else if($config.name === 'hty') {
            postData['style'] = 'style45'
          }else if($config.name === 'dqr') {
            postData['style'] = 'style47'
          }else if($config.name === 'fhcp' || $config.name === 'xpj83') {
            postData['style'] = 'style49'
          }else if($config.name === 'js85') {
            postData['style'] = 'style80'
          }else if($config.name === 'dalao') {
            postData['style'] = 'style51'
          }else if($config.name === 'aqvns') {
            postData['style'] = 'style53'
          }else if($config.name === 'ybcp') {
            postData['style'] = 'style55'
          }else if($config.name === 'ecp') {
            postData['style'] = 'style57'
          }else if($config.name === 'amvns') {
            postData['style'] = 'style59'
          }else if($config.name === 'amhg') {
            postData['style'] = 'style61'
          }else if($config.name === 'cpxpj' ) {
            postData['style'] = 'style67'
          }else if($config.name === 'betnew') {
            postData['style'] = 'style63'
          }else if($config.name === 'tyc86') {
            postData['style'] = 'style28'
          }else if($config.name === 'tyc82') {
            postData['style'] = 'style69'
          }else if($config.name === 'xpj80') {
            postData['style'] = 'style71'
          }else if($config.name === 'vns81') {
            postData['style'] = 'style73'
          }else if($config.home === 'qp') {
            $config.newQP ? postData['style'] = 'style17' : postData['style'] = 'style13'
          }else if(['blr'].includes($config.name)) {
            postData['style'] = 'style24'
          }else if(['tycjt'].includes($config.name)) {
            postData['style'] = 'style26'
          }
          $http.post('/gameSortV4', postData).then(res => {
            if (res.data.code === 200) {
              ids.forEach(_id => {
                let _data = null
                switch (_id) {
                  // 彩票全部
                  case '10000':
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[idConfig[_id]]
                    }
                    if(_data){
                      _data['list'].forEach( item => {
                        if(item.id === 219&&item.games) {
                          JSON.setObjByLocalStorage(['main/gameSort/' + _id],item.games)
                          data[_id] = item.games
                        }
                      });
                    }else{
                      data[_id] = []
                    }
                    break;
                    //真人 体育
                  case '10002': case '10003':
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[idConfig[_id]]
                    }
                    if(_data){
                      JSON.setObjByLocalStorage(['main/gameSort/' + _id],_data['games'])
                      data[_id] = _data['games'] 
                    }else{
                      data[_id] = []
                    }
                    break;
                    case '10006': case '10007': case '10008': case '10009': case '10010': case '10011': case '10012': case '10013':
                      let setId = {
                        10006: 222,
                        10007: 223,
                        10008: 224,
                        10009: 225,
                        10010: 226,
                        10011: 227,
                        10012: 228,
                        10013: 229,
                      }
                      res.data.data['list'].forEach( item => {
                        if(item.id === setId[_id] && item.games) {
                          localStorage['main/gameSort/' + _id] = JSON.stringify(item.games)
                          data[_id] = item.games
                        }
                      });
                      break;
                  //快捷入口
                  case '20001':
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[7]
                    }
                    if(_data){
                      if(_data['list'].filter(item => item.id === 214)[0]) {
                        JSON.setObjByLocalStorage(['main/gameSort/' + _id],_data['list'].filter(item => item.id === 214)[0]['games'])
                        data[_id] = _data['list'].filter(item => item.id === 214)[0]['games']
                      }
                    }else{
                      data[_id] = []
                    }
                    break;
                  //首页推荐
                  case '20002':
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[7]
                    }
                    if(_data){
                      if(_data['list'].filter(item => item.id === 215)[0]) {
                        JSON.setObjByLocalStorage(['main/gameSort/' + _id],_data['list'].filter(item => item.id === 215)[0]['games'])
                        data[_id] = _data['list'].filter(item => item.id === 215)[0]['games']
                      }
                    }else{
                      data[_id] = []
                    }
                    break;
                  // 彩票侧边栏
                  case '30001':
                    let menuList = []
                    let menyType = []
                    let newList = []
                    if(res.data.data[7] && res.data.data[7]['list']) {
                      if(res.data.data[7]['list'].filter(item => item.id === 216)[0] && res.data.data[7]['list'].filter(item => item.id === 216)[0]['list']) {
                        menuList = res.data.data[7]['list'].filter(item => item.id === 216)[0]['list']
                      }
                      if(res.data.data[7]['list'].filter(item => item.id === 217)[0] && res.data.data[7]['list'].filter(item => item.id === 217)[0]['layout']) {
                        menyType = res.data.data[7]['list'].filter(item => item.id === 217)[0]['layout']
                      }
                    }
                    if(res.data.data[4] && res.data.data[4]['list'].filter(item => item.id !== 219)) {
                      newList = res.data.data[4]['list'].filter(item => item.id !== 219)
                    }
                    if(menuList && menuList.length) {
                      if(menyType === 'A' && menuList.filter(item => item.name === '热门')) {
                        menuList = menuList.filter(item => item.name !== '热门')
                      }else {
                        menuList = menuList.filter(item => item.name === '热门').concat(newList)
                      }
                      localStorage['main/gameSort/' + _id] = JSON.stringify(menuList)
                      data[_id] = menuList
                    }
                    break;
                  //彩票除开全部
                  case '30003':
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[4]
                    }
                    if(_data){
                      localStorage['main/gameSort/' + _id] = JSON.stringify(_data['list'].filter(item => item.id !== 219))
                      data[_id] = _data['list'].filter(item => item.id !== 219)
                    }else{
                      data[_id] = []
                    }
                    break;
                  default:
                    if(idIndex) {
                      _data = res.data.data
                    }else {
                      _data = res.data.data[idConfig[_id]]
                    }
                    if(_data){
                      try {
                        JSON.setObjByLocalStorage(['main/gameSort/' + _id],_data)
                      }catch (err){
                        console.log(err)
                      }
                      data[_id] = _data
                    }else{
                      data[_id] = {}
                    }
                    break;
                }
              })
              this._vm.$nextTick(() =>{
                if (typeof callback === 'function') callback(data, id)
              })
            }
          })
        }
      },
      //新版游戏排序 彩票数据
      gameSortV4Note({state,dispatch}){
        if(localStorage.gameSortV4Note && localStorage.gameSortV4Note !== '{}') {
          state.gameSortV4Note = JSON.parse(localStorage.gameSortV4Note)
        }
        return new Promise((resolve, reject) => {
          $http.post('gameSortV4Note',{
            device: 'h5'
          })
            .then(res => {
              if(res.data.code === 200) {
                state.gameSortV4Note = res.data.data
                localStorage.gameSortV4Note = JSON.stringify(res.data.data)
                resolve(res.data)
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      gameSort({ store, state }, { id, callback, local }) {
        if (id.toString().includes('|')) {
          delete localStorage['main/gameSort/' + id]
        }
        const ids = id.toString().split('|')
        let catchStatus = ids.every(_id => localStorage['main/gameSort/' + _id])
        if (catchStatus && typeof callback === 'function') {
          const res = {}
          ids.forEach(_id => {
            const itemData = JSON.parse(localStorage['main/gameSort/' + _id])
            if (itemData.length > 50) {
              catchStatus = false
              delete localStorage['main/gameSort/' + _id]
            }

            if (Object.prototype.toString.call(itemData) === '[object Array]') {
              res[_id] = itemData
            } else {
              catchStatus = false
              delete localStorage['main/gameSort/' + _id]
            }
          })

          if (catchStatus) {
            callback(res, id)
          }
        }

        if (!local || !catchStatus) {
          let postData = {
            device: 'h5',
            id,
          }
          if($config.home === 'qp') {
            $config.newQP ? postData['rep_theme'] = 'style17' : postData['rep_theme'] = 'style13'
          }else if(['blr'].includes($config.name)) {
            postData['rep_theme'] = 'style24'
          }else if(['tycjt'].includes($config.name)) {
            postData['rep_theme'] = 'style26'
          }
          $http.post('/gameSortNew', postData).then(res => {
            if (res.data.code === 200) {
              ids.forEach(_id => {
                if (res.data.data[_id].length > 50) {
                  delete localStorage['main/gameSort/' + _id]
                } else {
                  if ($config.imgStyle) {//风格替换设置
                    let resStyle = state.config.theme;
                    localStorage['main/gameSort/' + _id] = JSON.stringify(
                      res.data.data[_id].map(
                        (ff, i) => {
                          ff.icon = ff.icon.replace(resStyle, $config.imgStyle)
                          if ($config.imgGameList.includes(_id) && $config.imgLimit) {
                            let iconSplit = ff.icon.split('/')
                            let iconName = iconSplit[iconSplit.length - 1]
                            let iconNameSplit = iconName.split('.')
                            let newName = ''
                            if (i === 0 || i % 5 === 0) {
                              newName = iconNameSplit[0] + $config.imgLimit + 1 + '.' + iconNameSplit[1]
                            } else {
                              newName = iconNameSplit[0] + $config.imgLimit + 2 + '.' + iconNameSplit[1]
                            }
                            ff.icon = ff.icon.replace(iconName, newName)
                          }
                          return ff
                        }))
                  } else {
                    localStorage['main/gameSort/' + _id] = JSON.stringify(res.data.data[_id])
                  }
                }
              })

              if (typeof callback === 'function') callback(res.data.data, id)
            }
          })
        }
      },
      getPopups({ state }, { position, status,uid }) {
        return new Promise(function (resolve, reject) {
            $http.post(
              '/site/newNotice',
              {
                type: 'popups',
                client_type: 'H5',
                appears_location: position,
                bounce_location: status,
                limit: 99,
                uid:uid
              },
              {
                // headers: {
                //   Accept: 'application/x.tg.v2+json'
                // }
              }
            ).then(res => {
              resolve(res.data)
            }).catch(err => {
              reject(null, err)
            })
          // else {
          //   try {
          //     resolve(JSON.parse(localStorage['main/getPopups']))
          //   } catch (e) {
          //     reject()
          //   }
          // }
        })
      },
      getQpNotices({ state }, { status }) {
        return new Promise(function (resolve, reject) {
          $http.post('/site/newNotice', {
            type: 'lantern',
            client_type: 'H5',
            appears_location: 1,
            bounce_location: status,
            limit: '1000',
          }).then(res => {
            res = res.data
            if (res['code'] === 200) {
              resolve(res)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      getActivityCateList({ commit }, { data, callback }) {
        if (localStorage['main/getActivityCateList']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['main/getActivityCateList']))
        }
        $http.get('/site/getActivityCateList').then(res => {
          localStorage['main/getActivityCateList'] = JSON.stringify(res.data)
          if (typeof callback === 'function') callback(res.data)
        })
      },
      activityList({ commit }, { data, callback }) {
        if (localStorage['main/activityList']) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['main/activityList']))
        }
        $http.post('/site/getActivityList', data).then(res => {
          try {
            localStorage['main/activityList'] = JSON.stringify(res.data)
          } catch (error) {
          }
          if (typeof callback === 'function') callback(res.data)
        })
      },
      activityContent({ commit }, { id, callback }) {
        if (localStorage['main/activityContent/' + id]) {
          if (typeof callback === 'function') callback(JSON.parse(localStorage['main/activityContent/' + id]))
        }
        $http.get('/site/activityDetail',
          {
            params: {
              activity_id: id
            }
          }
        ).then(res => {
          localStorage['main/activityContent/' + id] = JSON.stringify(res.data)
          if (typeof callback === 'function') callback(res.data)
        })
      },
      // 获取客服链接
      getJavaKf() {
        return new Promise((resolve, reject) => {
          $http
            .post('/paymentServiceLink', {
              port: 2,
              siteId: JSON.parse(localStorage.config).siteId // 正式上线替换
            })
            .then(res => {

              localStorage['member/paymentServiceLink'] = decodeURIComponent(res.data.data['link'])
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      getUseKey() {
        return new Promise((resolve, reject) => {
          $http.post('/paymentServiceCustomer')
            .then(res => {
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      // 获取客服列表数据
      getCustomerLists({ commit, state }, { token, hierarchyId ,url}) {
        return new Promise((resolve, reject) => {
          service
            // .post('http://43.225.38.59:80/web/service/payServiceList', `token=${token}&hierarchyId=${hierarchyId}`
            .post(''+url+'/web/service/payServiceListNew', `token=${token}&hierarchyId=${hierarchyId}`
            ).then(res => {
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      /**
       * 获取长龙初始化数据
       * @param store
       */
      getOddsAll(store) {
        return new Promise((resolve, reject) => {
          $http.get('/api/v1/lottery/getOddsAll', {

          }).then(res => {
            if (res.status === 200) {
              resolve(res.data)
            }
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 特殊时刻 休市
      getStopLotteryCheck({ dispatch }, lid) {
        return new Promise((resolve, reject) => {
          $http.get('/stopLotteryCheck?lid=' + lid).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      //报名活动
      applyActivity({state},id) {
        return new Promise((resolve, reject) => {
          $http.get('activityApply', { params: { class: id }})
            .then(res => {
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },

      //查看活动进度
      activityApplyListShow({state},id) {
        return new Promise((resolve, reject) => {
          $http.get('activityApplyListShow', { params: { page: 1, class: id }})
            .then(res => {
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      getQipaiShouyeHongbao(){
        return new Promise((resolve, reject) => {
          $http.post('qipaiShouyeHongbao')
            .then(res => {
              if(res.data.code === 200){
                resolve(res.data)
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      getQipaiShouyeHongbaoLingqu({state},id){
        return new Promise((resolve, reject) => {
          $http.post('qipaiShouyeHongbaoLingqu?id='+ id)
            .then(res => {
              if(res.data.code === 200){
                resolve(res.data)
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      //红包雨领取
      getHongboayuLinqu({state},id){
        return new Promise((resolve, reject) => {
          $http.post('activityApply', { params: { class: id }})
           .then(res => {
             if(res.code==200){
               res = res.data
               resolve(res)
             }else{
              res = res;
              resolve(res)
             }
           })
           .catch(err => {
             reject(err)
           })
       })
      },
        getHongboayuDraw({state},id){
        return new Promise((resolve, reject) => {
          $http.post('activityApplyList', { params: { class: id }})
           .then(res => {
             if(res.code==200){
               res = res.data
               resolve(res)
             }else{
              res = res;
              resolve(res)
             }
           })
           .catch(err => {
             reject(err)
           })
       })
      },
      // 验证资金密码
      validatePayPassword({state},data){
        return new Promise((resolve, reject) => {
          $http.post('validatePayPassword',data)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      // 充值失败弹窗
      getPaymentMsgImg({state}){
        return new Promise((resolve, reject) => {
          $http.post('getPaymentMsgImg')
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      // 公告已读
      newNoticeMember({state},{uid,nid}){
        return new Promise((resolve, reject) => {
          $http.post('/site/newNoticeMember',{
            uid:uid,
            nid:nid,
          })
            .then(res => {
              if(res.data.code === 200){
                resolve(res.data)
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      },
       // ios 指纹采集
       saveAgentSign({ dispatch }, data) {
        return new Promise((resolve, reject) => {
          $http.post('/saveAgentSign',data).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      socketHandle({ dispatch }) {
        if(Vue.prototype.$sendFixHeartTimer)  clearInterval(Vue.prototype.$sendFixHeartTimer);
        return new Promise((resolve, reject) => {
          $http.post('/getWebsocketUrl',{device: 'h5'}).then(res => {
            let wsUrl = res.data.data+"&prod=1";
              let pingIntervalSeconds=3000;//心跳连接时间
              let lockReconnect=false;//是否真正建立连接
              let heartTimer=null;//心跳定时器
              let serverTimer= null;//服务器超时 定时器
              let reconnectTimer= null;//断开 重连倒计时
              Vue.prototype.$sendFixHeartTimer=null;//30s固定发送心跳定时器
              let sendFixHeartTime = 30000;
              let ws;
              function createWebSocket() {
                  try {
                    ws = new WebSocket(wsUrl);
                    init();
                  } catch(e) {
                    reconnect();
                  }
              }
              function init(){
                   // 监听连接开启,
                   ws.onopen = function () {
                       start();
                       sendFixHeart();
                  }
                  ws.onmessage = function (message) {
                      reset();
                      if(message){
                         let data = JSON.parse(message.data)
                         if(data.action=='connect') sendFixHeartTime=data.data.pingInterval
                      } 
                  }
                 
                  ws.onerror = function() {
                      //重连
                      reconnect();
                  };
  
                  ws.onclose= function(){
                      //重连
                      reconnect();
                  };
              }
              function start(){
                  heartTimer && clearTimeout(heartTimer);
                  serverTimer && clearTimeout(serverTimer);
                  heartTimer = setTimeout(()=>{
                      ws.send('2');
                      //超时关闭，超时时间为5s
                      serverTimer = setTimeout(()=>{
                          ws.close();
                      }, 5000);
                  }, pingIntervalSeconds)
              }
              function reconnect(){
                  //设置lockReconnect变量避免重复连接
                  if(lockReconnect) return;
                  lockReconnect = true;
                  reconnectTimer && clearTimeout(reconnectTimer);
                  reconnectTimer = setTimeout(()=> {
                      // createWebSocket();
                      dispatch('socketHandle')
                      lockReconnect = false;
                  }, parseInt(Math.random()*2000 + 3000));
              }
                //重置心跳
              function reset(){
                  // clearTimeout(heartTimer);
                  clearTimeout(serverTimer);
                  // start();
              }
               // 固定发送心跳
               function sendFixHeart(){
                  clearInterval(Vue.prototype.$sendFixHeartTimer);
                  Vue.prototype.$sendFixHeartTimer = setInterval(()=>{
                      ws.send('2');
                  }, sendFixHeartTime);
              }
              createWebSocket();
          }).catch(err => {
            reject(err)
          })
        })
      }
    }
  }
  return mainStore
}
