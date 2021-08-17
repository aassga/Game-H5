import { String } from "core-js";

export default {
  data () {
    return {
      AppDown:"",
      intervalShare:null,
      andAppdata:null,
      andAppkey: '',
      listTop: [],
      listContent: [],
      moveLen: 0,
      swiperList: [],
      showAlert:false,
      notice: [],
      games: [],
      hots: [],
      gameMap: {},
      noticeTimer: null,
      swiperOption: {
        autoplay: true,
        autoHeight: true,
        loop: true
      },
      andtranceKey: "",
      appdatas: "",
      timer:0,
    }
  },
  mounted () {
    this.intervalShare = window.setInterval(() => {
        this.initShare();
    }, 100);
    //this.inintDown();
  },
  created () {
    this.init()
  },
  
  beforeDestroy () {
    window.clearInterval(this.noticeTimer)
    window.clearInterval(this.timer)
    window.clearInterval(this.intervalShare)
  },
  watch: {
    '$store.state.main.config': 'init',
    '$store.state.main.siteId': 'init',
  },
  methods: {
    inintDown(){
        if(['amxpj'].includes(this.$config.name)){
          this.AppDown = new this.$AppDown(this);
          this.AppDown.initDown()
        }
    },
    initShare(){
      if(this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '') {
        window.clearInterval(this.intervalShare);
        if (['103qp', '99qp', 'jsqp', 'kkqp', 'fhcp','hty','aqvns','vnso','tccp','tyc86','dalao','amxpj','amhg','xpj83','xpj80','vns81','tyc82','js85'].includes(this.$config.name) && this.isAndroid) {
          let str = window.location.href;
          let agent = localStorage['agent'] || localStorage['channelCode'];
          let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, this.find(str, '/', 2));
          let par2 = "channelDomain=" + str.substring(0, this.find(str, '/', 2));
          if (this.$config.name === '99qp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "bec5d1b55fae6bbd";
            } else {
              this.theAppKey = 'eec4bb1cb24b3e2b'
            }
          } else if(this.$config.name === '103qp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "0712ecd59efbe2be"; // 超级签
            } else {
              this.theAppKey = '6ba99b9b664d587e'; // 企业签
            }
          } else if (this.$config.name === 'jsqp') {
            this.theAppKey = "b0c2f09efa10f831";
          } else if (this.$config.name === 'amxpj') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "c336fd2ee19f948d"; // 超级签
            } else {
              this.theAppKey = '62392c363969406d'; // 企业签
            }
          } else if (this.$config.name === 'fhcp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "7bb20fdcf47399ad"; // 超级签
            } else {
              this.theAppKey = 'd0648a661f3e137d'; // 企业签
            }
          }else if (this.$config.name === "xpj80") {
            this.theAppKey = "d445a197f1389dcf";
          }else if (this.$config.name === "vns81") {
            this.theAppKey = "e6e705a36eadcdda";
          }else if (this.$config.name === "tyc82") {
            this.theAppKey = "24347371257e5a7d";
          }else if (this.$config.name === "xpj83") {
            this.theAppKey = "18932ec4bbc49b6d";
          }else if (this.$config.name === "hty") {
            this.theAppKey = "e721ac3f4610abfc";
          } else if(this.$config.name === 'kkqp'){
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "85cf493a8c8a56ae"; // 超级签
            } else {
              this.theAppKey = 'f21275580a0be8ff'; // 企业签
            }
          }else if (this.$config.name === 'hty') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "23c6862050499aee"; // 超级签
            } else {
              this.theAppKey = 'd699bda53f0f80be'; // 企业签
            }
          }else if (this.$config.name === 'aqvns') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "0b250ea7735f3d7f"; // 超级签
            } else {
              this.theAppKey = 'a30941c0f0c61ced'; // 企业签
            }
          }else if (this.$config.name === 'vnso') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "0a90b4ac1dff118f"; // 超级签
            } else {
              this.theAppKey = '86d30dc0d6c57a7f'; // 企业签
            }
          }else if (this.$config.name === 'tccp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "aba048fb8735b6fa"; // 超级签
            } else {
              this.theAppKey = '6501f58c9cabd27a'; // 企业签
            }
          }else if (this.$config.name === 'dalao') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "946cc75f43b96b2c"; // 超级签
            } else {
              this.theAppKey = 'f46a75883bd2517b'; // 企业签
            }
          } else if (this.$config.name === 'amhg') {
            this.theAppKey = "4c811010c940142d";
          } else if (this.$config.name === 'js85') {
            this.theAppKey = "984da84b0d5c8e5b";
          }else if (this.$config.name === 'tyc86') {
            this.theAppKey = "67215a1bcd3263bd";
          }
          ShareTrace.init({
            appkey: this.theAppKey, // 此值必填
            param: agent ? par1 : par2,
            
          });
        } else if ((['blr', 'vnst', '737qp','qxcp'].includes(this.$config.name)) && this.isAndroid) {
          let str = window.location.href;
          let index = str.lastIndexOf("#");
          let rl = str.substring(0, index-3);
          let that = this;
          this.andAppdata = 'channelCode=' + rl;
          if (this.$config.name === 'blr') {
            this.andAppkey = 'a4f74789e16ef84a';
          } else if (this.$config.name === 'vnst') {
            this.andAppkey = '053ca21e689c4dcd';
          } else if (this.$config.name === '737qp') {
            this.andAppkey = '7a1d384fdb64ec0d';
          }else if (this.$config.name === 'qxcp') {
            this.andAppkey = '6b20653cb665678d';
          }
          ShareTrace.init({
            appkey: this.andAppkey, // 此值必填
            param: this.andAppdata,
          });
        } else if (['k78qp', '935qp', '632qp', 'kyqp'].includes(this.$config.name) && this.isAndroid) {
          let agent = localStorage['agent'] || localStorage['channelCode'];
          let parmas = "";
          if (this.$config.name == 'k78qp') {
            this.andAppkey = "7a7ae1a024eb887a";
            parmas = agent ? 'channelCode=' + agent : 'channelCode=215963';
          } else if (this.$config.name == '935qp') {
            this.andAppkey = "3a2e4217ecf19d2c";
            parmas = agent ? 'channelCode=' + agent : 'channelCode=790010';
          } else if (this.$config.name == 'kyqp') {
            this.andAppkey = "badba71e26f2974c";
            parmas = agent ? 'channelCode=' + agent : 'channelCode=267448';
          } else {
            this.andAppkey = "3bc5a33d6b2092cd";
            parmas = agent ? 'channelCode=' + agent : 'channelCode=333572';
          } 
          ShareTrace.init({
            appkey: this.andAppkey, // 此值必填
            param: parmas,
          });
        } else if (['betnew','cpxpj','tccp','tyc86','fhcp','dqr','839qp','xpj83','xpj80','vns81','tyc82','js85'].includes(this.$config.name)){
          let str = window.location.href;
          let agent = localStorage['agent'] || localStorage['channelCode'];
          let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, this.find(str, '/', 2));
          let par2 = "channelDomain=" + str.substring(0, this.find(str, '/', 2));
          if (this.$config.name === 'betnew') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "6c7f24cf619874ac"; // 超级签
            } else {
              this.theAppKey = 'e9c3e5521456f43f'; // 企业签
            }
          } else if (this.$config.name === 'cpxpj') {
            this.theAppKey = "d388336587114a4e";
          } else if(this.$config.name === 'tccp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "aba048fb8735b6fa"; // 超级签
            } else {
              this.theAppKey = '6501f58c9cabd27a'; // 企业签
            }
          }else if(this.$config.name === 'fhcp') {
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "7bb20fdcf47399ad"; // 超级签
            } else {
              this.theAppKey = 'd0648a661f3e137d'; // 企业签
            }
          } else if(this.$config.name === 'js85') {
            this.theAppKey = '984da84b0d5c8e5b';
          } else if(this.$config.name === 'tyc86') {
            this.theAppKey = '67215a1bcd3263bd';
          }else if (this.$config.name === "xpj80") {
            this.theAppKey = "d445a197f1389dcf";
          }else if (this.$config.name === "vns81") {
            this.theAppKey = "e6e705a36eadcdda";
          }else if (this.$config.name === "tyc82") {
            this.theAppKey = "24347371257e5a7d";
          }else if (this.$config.name === "xpj83") {
            this.theAppKey = "18932ec4bbc49b6d";
          }else if (this.$config.name === "dqr") {
            this.theAppKey = "30615fd30d7c4f0f";
          }else if (this.$config.name === '839qp'){
            if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
              this.theAppKey = "748cd8c8d744fbcf";
            } else {
              this.theAppKey = '60187f21a570393c'
            }
          }
          ShareTrace.init({
            appkey: this.theAppKey, // 此值必填
            param: agent ? par1 : par2,
          });

        }
      }
    },
    find (str, cha, num) {
			var x = str.indexOf(cha);
			for(var i = 0; i < num; i++) {
					x = str.indexOf(cha, x+1);
			}
			return x;
    },
    init () {
      let swiperTouchEvt = false
      let swiperX, swiperY, lastX, lastY
      const swiperTask = () => {
        if (!swiperTouchEvt) {
          if (this.$refs['swiper']) {
            this.$refs['swiper'].$el.addEventListener('touchstart', ev => {
              lastX = swiperX = ev.touches[0].pageX
              lastY = swiperY = ev.touches[0].pageY
              this.moveLen = 0
            })
            this.$refs['swiper'].$el.addEventListener('touchmove', ev => {
              let x = Math.abs(ev.touches[0].pageX - swiperX)
              let y = Math.abs(ev.touches[0].pageY - swiperY)
              if (x >= y) {
                ev.stopPropagation()
              }

              x = Math.abs(ev.touches[0].pageX - lastX)
              y = Math.abs(ev.touches[0].pageY - lastY)
              this.moveLen += Math.sqrt(x * x + y * y)
              lastX = ev.touches[0].pageX
              lastY = ev.touches[0].pageY
            }, false)
          } else {
            setTimeout(swiperTask, 500)
          }
        }
      }
      swiperTask()
    },
    onDownload (type) {
      if (this.isAndroid) {
        var downUrl = window.localStorage.getItem('downloadAndroidLink');
        if (downUrl) {
          // if (this.$config.autoDownload.android) {
          //   if (downUrl && downUrl.length > 0  && !downUrl.includes('http')) {
          //     console.log(downUrl);
          //     downUrl = location.origin + "" + this.$config.download.android;
          //   }
          //   window.location.href = downUrl;
          // }
          // if(['amxpj'].includes(this.$config.name)){
          //   // this.AppDown.downloadGame();
          //   this.$router.push('/download')
          //   return;
          // }
          if (['blr', 'vnst', '103qp', '839qp', '99qp', 'jsqp', 'kkqp', 'k78qp', '935qp', '632qp','kyqp', 'fhcp', '737qp', 'aqvns','dqr', 'hty','qxcp','vnso','tccp','tyc86','dalao','amxpj','amhg','vnso','betnew','cpxpj','xpj83','xpj80','vns81','tyc82','js85'].includes(this.$config.name) && (this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '')) {
            ShareTrace.download();
          } else {
            if (this.$config.autoDownload.android) {
              if (downUrl && downUrl.length > 0  && !downUrl.includes('http')) {
                downUrl = location.origin + "" + this.$config.download.android;
              }
              window.location.href = downUrl;
            } else {
              this.$router.push('/download')
            }
          }
        } else {
          this.$store.state.main.iosAlert.content = '<span style="font-weight:700;">暂不支持安卓APP下载</span>'
          this.$store.state.main.iosAlert.show = true
          this.$store.state.main.iosAlert.okText = '确定'
        }
      } else { 
        if (this.$config.download.appStore) {
          let model = {
            siteCode: this.$config.download.appStore
          }
          new OpenInstall({
              appKey : "u4gzdw",
              onready : function() {
                  this.schemeWakeup();
                  this.wakeupOrInstall();
                  return false;
              }
          }, model);
          setTimeout (() => {
            this.$router.push('/')
          })
          return;
        }
        // if(['amxpj'].includes(this.$config.name)){
        //   this.AppDown.downloadGame();
        //   return;
        // }
        // if(['betnew','cpxpj'].includes(this.$config.name)){
        //   ShareTrace.download();
        //   return;
        // }
        if(['99qp','kkqp','vnst','vnso','amxpj','amhg','103qp','839qp','jsyl','fhcp','vnst','aqvns','dqr','tyc','tccp','cpxpj','bet365','betnew','935qp','amvnsr','vns81','pjdc','tycjt','xpj','qygj','hty','tyc82','xpj80','xpj83','dalao','js85','betnew','cpxpj'].includes(this.$config.name)) {
          let _url = ''
          if(type === 'enterprisesignLink') {
            _url = window.localStorage.getItem('enterprisesignLink')
          }else {
            _url = window.localStorage.getItem('supersignLink')
          }
          window.history.pushState(window.location.href, null, window.location.href);
          window.location.replace(_url)

            // window.location.href = _url
        }else if (window.localStorage.getItem('downloadIosLink')) {
          if (this.$config.autoDownload.ios) {
            window.location.href = this.$config.download.ios
          } else {
            // if(type=== 'goVnstLoginDownload' && this.$config.name === 'vnst' && !this.$store.state.user.userInfo) {
            //   sessionStorage['showBlackAdvert'] = '2'
            //   this.$router.push('/admin/login')
            // }else 
            if (this.$store.state.main.downloadType === 'testflight') {
              let query = ''
              let goPath = ''
              let agent = localStorage['agent'] || localStorage['channelCode'];
              let downloadUrl = this.$config.download.ios
              if(agent) {
                query = '?agent=' + agent
                downloadUrl ? query += ('&downloadUrl=' + downloadUrl) : ''
              }else {
                query = '?downloadUrl=' + downloadUrl
              }
              query += '&windowHref=' +  window.location.href
              if(this.$store.state.main.ShareTrace && this.$store.state.main.ShareTrace.downloadUrl) {
                query += '&ShareTrace=1'
                goPath = this.$store.state.main.ShareTrace.downloadUrl + query
              }else {
                goPath = window.location.origin + '/app-download/index.html' + query
              }
              window.history.pushState(window.location.href, null, window.location.href)
              window.location.href = goPath
            }else{
              
              this.$router.push('/download')
            }
          }
        } else {
          this.showAlert = true
          this.$store.state.main.iosAlert.content = '<span style="font-weight:400;">暂不支持苹果APP下载</span>'
          this.$store.state.main.iosAlert.show = true
          this.$store.state.main.iosAlert.okText = '确定'
        }
      }
    },
    getBanner () {
      this.$store.dispatch('main/getPosition', {
        data: {
          position: 'banner',
          clientType: 'h5'
        },
        callback: res => {
          if (res.data['code'] === 200) {
            const data = res.data.data[0]
            if (data) {
              this.downloadAppTarget = data.downloadAppTarget
              this.swiperList = data.body.filter(item => {
                let show = true
                if (item.status !== 'yes') {
                  show = false
                }
                if (item['online_type'] && item['online_type'].toString() === '1' && item['offline_at'] && item['publish_at']) {
                  const now = this.dayJs()
                  const start = this.dayJs(item['publish_at'])
                  const end = this.dayJs(item['offline_at'])
                  if (now.isAfter(end) || now.isBefore(start)) {
                    show = false
                  }
                }
                return show
              }).map(item => {
                return {
                  link: item.targets,
                  img: item.img,
                  data: item
                }
              })
            }
          }
        }
      })
    },
    onTest () {
      this.$store.dispatch('user/testLogin', {
        callback: (res) => {
          if (res.code === 200) {
            this.toastText('登录试玩成功', 'middle')
          } else {
            this.toastText('登录试玩失败', 'middle')
          }
        }
      })
    },
    onReg () {
      this.$router.push('/admin/register')
    },
    onLogin () {
      if(this.$config.homeLogin && !this.isApp) {
        this.$config.home === 'vns' ? this.$router.push('/home-login-b') 
        : this.$config.home === 'qp' ? this.$router.push('/home-login-c') 
        :this.$router.push('/home-login-a')
      }else {
        this.$router.push('/admin/login')
      }
    },
    swiperItemClick (item) {
      if (this.$config.preview) {
        return
      }
      if (this.moveLen <= 20 && item.link) {
        // 跳转地址：1=自定义；2=真人；3=彩票；4=棋牌；5=电子；6=体育；7=捕鱼；8=优惠；
        switch (item.data['foward_type']) {
          case '1':
            // window.tryOpen(item.data.targets)
            window.location.href = item.data.targets
            break
          case '2':
            this.$router.push('/home/type/10003')
            break
          case '3':
            this.$router.push('/home/type/10000')
            break
          case '4':
            this.$router.push('/home/type/10004')
            break
          case '5':
            this.$router.push('/home/type/10001')
            break
          case '6':
            this.$router.push('/home/type/10002')
            break
          case '7':
            this.$router.push('/home/type/10005')
            break
          case '8':
            this.$router.push('/activity')
            break
          case '9':
            this.$router.push('/save')
            break
          case '10':
            if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
              this.toastText('您尚未登录', 'middle')
            } else {
              this.$router.push('/user/JieBeiCenter')
            }
            break
          case '11':
            if (!this.$store.state.user.userInfo || !this.$store.state.user.token) {
              this.toastText('您尚未登录', 'middle')
            } else {
              this.$router.push('/user/YuEBaoCenter')
            }
            break
          default:
            // window.tryOpen(item.data.targets)
            window.location.href = item.data.targets
            break
        }
      }
    },
    getHomeData(idIndex,id) {
      this.$store.dispatch('main/getNewGame', {
        idIndex: idIndex,
        id: id,
        callback: res => {
          if (res) {
            this.hots = res['10000'] || []
            this.listTop = res['20001'];
            if(this.$config.home === 'vns'){
              let num = Math.ceil(res['20002'].length / 8);
              this.listContent = []
              for (let i = 0; i < num; i++) {
                let arr = res['20002'].slice(0, 8);
                res['20002'].splice(0, 8);
                this.listContent.push(arr);
              }
            }else if(this.$config.home === 'xpj') {
              this.listContent = res['20002'].splice(0, 12);
            }else{
              this.listContent = res['20002'] || [];
            }
            this.gameMap = res || {}
          }
        },
      })
    },
  }
}
