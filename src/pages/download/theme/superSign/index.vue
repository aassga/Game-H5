<template>
  <div class="down_content" >
    <view-page class="theme-main-bg-5">
      <div class="wrap"
           slot="content">
        <div class="banner">
          <img id="app_banner"
               src="../../../../assets/img/download/xpjh5/banner.png">
        </div>
        <header class="theme-main-bg-5">
          <div class="header_info theme-main-bg-5">
            <div class="info_pic">
              <img id="app_logo"
                   :src="logoImg">
            </div>
            <div class="info_text">
              <h2 id="app_name" class="theme-color-white">{{$config.setName.split(/[\s-]/)[0]}}</h2>
              <ul>
                <li>
                  <img src="../../../../assets/img/download/xpjh5/2.png">
                  <span id="download_count">9752</span>
                </li>
                <li>
                  <img src="../../../../assets/img/download/xpjh5/3.png">
                  <span>IOS/Android</span>
                </li>
                <li>
                  <img src="../../../../assets/img/download/xpjh5/4.png">
                  <span id="app_version">v2.02</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="header_remarks theme-border-color">
            <div class="remarks_rating">
              <h3>
                <span id="grade">5.0</span>
                <img src="../../../../assets/img/download/xpjh5/start2.png">
              </h3>
              <p id="grade_person_count">1525人评分</p>
            </div>
            <div class="remarks_info">
              <div class="remarks_info_item">
                <h3>
                  <span>#</span>1
                </h3>
                <p>娱乐</p>
              </div>
              <div class="remarks_info_item">
                <h3>
                  18
                  <span>+</span>
                </h3>
                <p>年龄</p>
              </div>
            </div>
          </div>
        </header>
        <div id="app_information" class="introduce theme-main-bg-5 theme-color-white">尊敬的会员：APP会不定期更新，当您无法顺利打开APP遇到闪退/无法验证应用，请先卸载当前APP清除游览器缓存后，前往官网重新下载即可哟~下载APP领取更多优惠福利~</div>
        <div class="btn_group theme-main-bg-5">
          <div class="btn_item">
            <button id="download_btn"
                    class="iosMask theme-yellow-bg-2"
                    :class="installstep=='1'?'active':''">
              <a v-if="isAnd() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
                class="theme-color-black"
                 :href="androidDowUrl"
                 v-html="isntallingtext"></a>
              <a v-else-if="isIos() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
                class="theme-color-black"
                 :href="iosDowUrl"
                 v-html="isntallingtext"></a>
              <a v-else-if="['vnst','blr','99qp','kkqp','839qp','103qp','amxpj','935qp','632qp','kyqp','737qp','fhcp','aqvns','hty','dqr','vnso','tccp','tyc86','dalao','amhg','betnew','xpj83'].includes($config.name)"
                class="theme-color-black"
                 @click="downApp"
                 v-html="isntallingtext"></a>
              <a v-else-if="isIos() && this.$config.download.appStore && this.$config.download.appStore.length > 0"
                class="theme-color-black"
                 @click="downAPP"
                 v-html="isntallingtext"></a>
              <a v-else-if="isAnd()"
                class="theme-color-black"
                 :href="androidDowUrl"
                 v-html="isntallingtext"></a>
              <a v-else
                class="theme-color-black"
                 :href="iosDowUrl"
                 v-html="isntallingtext"></a>
            </button>
          </div>
          <!-- <div class="btn_item"
               v-show="$config.name==='jltx'">
            <a class="repair-btn"
               href="https://daohangxianlu.github.io/APP/gdhxiufu/index.html">修复工具 <span class="repair-new">new</span></a>
          </div> -->
          <div class="btn_item">
            <button @click="$router.push('/')"
                    :class="[$config.blush?'':'enter-web','theme-main-bg-5 theme-color-yellow theme-border-yellow']">进入官网</button>
          </div>
          <div class="btn_item">
            <a href="javascript:void(0)"
              class="theme-color-yellow"
               @click="goKf"
               target="_blank">在线客服</a>
            <a href="javascript:void(0)"
              class="theme-color-yellow"
               @click="install=true">查看安装引导</a>
          </div>
        </div>
        <swiper :options="swiperOption"
                ref="mySwiper" class="theme-main-bg-5">
          <swiper-slide>
            <img src="../../../../assets/img/download/xpjh5/lunbo1.png"
                 class="swiper-slide">
          </swiper-slide>
          <swiper-slide>
            <img src="../../../../assets/img/download/xpjh5/lunbo2.png"
                 class="swiper-slide">
          </swiper-slide>
          <swiper-slide v-if="personalMode !== 'mode_c' && !['935qp', '632qp','kyqp','839qp','k78qp','vnso'].includes($config.name)">
            <img src="../../../../assets/img/download/xpjh5/lunbo3.png"
                 class="swiper-slide">
          </swiper-slide>
          <swiper-slide v-if="$config.name == 'vnso'">
            <img src="../../../../assets/img/download/xpjh5/vnso-lunbo3.png"
                 class="swiper-slide">
          </swiper-slide>
          <swiper-slide>
            <img src="../../../../assets/img/download/xpjh5/lunbo4.png"
                 class="swiper-slide">
          </swiper-slide>
        </swiper>
        <!-- <div class="swiper-container" id="swiperImg">
                    <div class="swiper-wrapper">
                        <img src="../../../../assets/img/download/xpjh5/lunbo1.png" class="swiper-slide">
                        <img src="../../../../assets/img/download/xpjh5/lunbo2.png" class="swiper-slide">
                        <img src="../../../../assets/img/download/xpjh5/lunbo3.png" class="swiper-slide">
                        <img src="../../../../assets/img/download/xpjh5/lunbo4.png" class="swiper-slide">
                    </div>
        </div>-->
      </div>
    </view-page>
    <div class="install"
         v-show="install">
      <div class="install_title theme-main-bg-5 theme-color-white theme-border-color">
        <h4>安装教程</h4>
        <a href="javascript:void(0)"
           class="close theme-color-white"
           style="font-size: .5rem;"
           @click="install=false">×</a>
      </div>
      <div id="iosafter"
           class="wrapper theme-main-bg-5"
           v-if="showstatus=true">
        <ul class="content theme-color-white">
          <li>
            <img src="@src/assets/img/download/superSign/install_1.png"
                 class="img_01">
            <p>点击"APP下载安装" —>点击"安装"—>选择"允许"</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_2.png"
                 class="img_01">
            <p>选择"安装"</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_3.png"
                 class="img_01">
            <p>输入您的屏幕解锁密码</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_4.png"
                 class="img_01">
            <p>选择“安装”</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_5.png"
                 class="img_01">
            <p>滑动此按钮到最右侧</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_6.png"
                 class="img_01">
            <p>选择“打开”</p>
          </li>
          <li>
            <img src="@src/assets/img/download/superSign/install_7.png"
                 class="img_01">
            <p>选择“安装”，返回桌面等待下载完成即可遇到困难，请随时联系客服</p>
          </li>
        </ul>
      </div>

      <!--IOS12之前-->
      <div id="iosbefore"
           class="wrapper"
           v-else>
        <ul class="content">
          <li>
            <img src="../../../../assets/img/download/xpjh5/installationStep1.png"
                 class="img_01">
            <p>点击下载APP后选择“允许”</p>
          </li>
          <li>
            <img src="../../../../assets/img/download/xpjh5/installationStep2.png"
                 class="img_01">
            <p>描述文件下载完后点击“关闭”</p>
          </li>
          <li>
            <img src="../../../../assets/img/download/xpjh5/installationStep3.png"
                 class="img_01">
            <p>点击安装游戏，快捷跳转进入系统设置描述文件入口</p>
          </li>
          <li>
            <img src="../../../../assets/img/download/xpjh5/installationStep4.png"
                 class="img_01">
            <p>点击描述文件，开始安装</p>
          </li>
          <li>
            <img src="../../../../assets/img/download/xpjh5/installationStep5.png"
                 class="img_02">
            <p>安装描述文件</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="ios_mask"
         v-show="ios_mask">
      <img id="license_step_img1"
           src="../../../../assets/img/download/h5/mask.png"
           v-show="license_step_img1"
           alt />
      <img id="license_step_img2"
           src="../../../../assets/img/download/h5/mask2.png"
           v-show="license_step_img2"
           alt />
      <button class="closeMask"
              @click="closeMask">2:证书已安装·下一步</button>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      install: false,
      isntallingtext: 'APP下载安装,领取现金红包',
      iosafter: true,
      installstep: '',
      ios_mask: false,
      license_step_img1: false,
      license_step_img2: false,
      showstatus: true,
      iosDowUrl:null,
      androidDowUrl:null,
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        effect: 'coverflow',
        slidesPerView: 3,
        centeredSlides: true
      },
      appdata: null,
      appkey: '',
      tranceKey: '',
      theAppKey: ''
    }
  },
  computed: {
    logoImg () {
      return require('@site/assets/img/download/logo.png')
    },
    helpImg () {
      return require('@site/assets/img/download/help.jpg')
    }
  },
  mounted () {
    this.showInstallMask()
    var str = window.location.href;
    var index = str.lastIndexOf("#");
    var rl = str.substring(0, index-3);
    setTimeout(() => {
      this.initDown();
      if(this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '') {
        if (['amxpj', '103qp', 'fhcp','xpj83','99qp','kkqp','dqr','hty','839qp','aqvns','vnso','tccp','tyc86','dalao','amhg','betnew','cpxpj','xpj80','vns81','tyc82'].includes(this.$config.name)) {
        let str = window.location.href;
        let agent = localStorage['agent'] || localStorage['channelCode'];
        let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, this.find(str, '/', 2));
        let par2 = "channelDomain=" + str.substring(0, this.find(str, '/', 2));

        if (this.$config.name === '103qp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "0712ecd59efbe2be"; // 超级签
          } else {
            this.theAppKey = '6ba99b9b664d587e'; // 企业签
          }
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
        }else if(this.$config.name === 'js85'){
           this.theAppKey = '984da84b0d5c8e5b';
        }else if(this.$config.name === 'tyc86'){
           this.theAppKey = '67215a1bcd3263bd';
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
        }else if (this.$config.name === "dqr") {
          this.theAppKey = "30615fd30d7c4f0f";
        }else if (this.$config.name === '99qp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "bec5d1b55fae6bbd"; // 超级签
          } else {
            this.theAppKey = 'eec4bb1cb24b3e2b'; // 企业签
          }
        }else if (this.$config.name === 'kkqp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "85cf493a8c8a56ae"; // 超级签
          } else {
            this.theAppKey = 'f21275580a0be8ff'; // 企业签
          }
        }
        // else if(this.$config.name === 'dqr'){
        //   if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
        //     this.theAppKey = "f905805f1964bdcf"; // 超级签
        //   } else {
        //     this.theAppKey = '47c47b1129c51ada'; // 企业签
        //   }
        // }else if (this.$config.name === 'hty') {
        //   if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
        //     this.theAppKey = "23c6862050499aee"; // 超级签
        //   } else {
        //     this.theAppKey = 'd699bda53f0f80be'; // 企业签
        //   }
        // }
        else if (this.$config.name === '839qp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "2087e3165aeac6bd";
          } else {
            this.theAppKey = '60187f21a570393c'
          }
        } else if (this.$config.name === 'aqvns') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "0b250ea7735f3d7f"; // 超级签
          } else {
            this.theAppKey = 'a30941c0f0c61ced'; // 企业签
          }
        } else if (this.$config.name === 'vnso') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "0a90b4ac1dff118f"; // 超级签
          } else {
            this.theAppKey = '86d30dc0d6c57a7f'; // 企业签
          }
        }  else if (this.$config.name === 'tccp') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "aba048fb8735b6fa"; // 超级签
          } else {
            this.theAppKey = '6501f58c9cabd27a'; // 企业签
          }
        } 
        else if (this.$config.name === 'dalao') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "946cc75f43b96b2c"; // 超级签
          } else {
            this.theAppKey = 'f46a75883bd2517b'; // 企业签
          }
        } else if (this.$config.name === 'amhg') {
          this.theAppKey = "4c811010c940142d"; // 超级签
        } else if (this.$config.name === 'betnew') {
          if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
            this.theAppKey = "6c7f24cf619874ac"; // 超级签
          } else {
            this.theAppKey = 'e9c3e5521456f43f'; // 企业签
          }
        } else if(this.$config.name === 'cpxpj') {
           this.theAppKey = 'd388336587114a4e';
        } 
        ShareTrace.init({
          appkey: this.theAppKey, // 此值必填
          param: agent ? par1 : par2,
        });
      } else if (['blr', 'vnst', '935qp', '632qp', 'kyqp', '737qp'].includes(this.$config.name)) {
        let agent = localStorage['agent'] || localStorage['channelCode'];
        let codeMum = '';
        if (this.$config.name === 'blr') {
          this.tranceKey = "a4f74789e16ef84a";
          codeMum = 'channelCode=' + rl;
        } else if (this.$config.name === '935qp') {
          this.tranceKey = "3a2e4217ecf19d2c";
          codeMum = agent ? 'channelCode=' + agent : 'channelCode=790010';
        } else if (this.$config.name === '632qp') {
          this.tranceKey = "3bc5a33d6b2092cd";
          codeMum = agent ? 'channelCode=' + agent : 'channelCode=333572';
        } else if (this.$config.name === 'kyqp') {
          this.tranceKey = "badba71e26f2974c";
          codeMum = agent ? 'channelCode=' + agent : 'channelCode=267448';
        } else if (this.$config.name === '737qp') {
          this.tranceKey = '7a1d384fdb64ec0d';
          codeMum = 'channelCode=' + rl;
        }else if (this.$config.name === 'vnst'){
          this.tranceKey = "053ca21e689c4dcd";
          codeMum = 'channelCode=' + rl;
        }
        ShareTrace.init({
          appkey: this.tranceKey, // 此值必填
          param: codeMum,
        });
      } 
      }
    }, 300);
  },
  methods: {
    initDown() {
      this.iosDowUrl = window.localStorage.getItem('downloadIosLink');
      this.androidDowUrl = window.localStorage.getItem('downloadAndroidLink');
    },
    find (str, cha, num) {
			var x = str.indexOf(cha);
			for(var i = 0; i < num; i++) {
					x = str.indexOf(cha, x+1);
			}
			return x;
    },
    downApp () {
      let model = {
        siteCode: this.$config.download.appStore
      }
      if (['blr', 'vnst', '103qp', '839qp', '99qp', 'kkqp', 'amxpj', '935qp', '632qp', 'kyqp', '737qp', 'fhcp', 'aqvns', 'hty','dqr','vnso','tccp','tyc86','dalao','amhg','betnew','cpxpj','xpj83'].includes(this.$config.name)) {
        ShareTrace.download()
      } else {
        new OpenInstall({
          appKey: 'u4gzdw',
          onready: function () {
            this.schemeWakeup()
            this.wakeupOrInstall()
            return false
          }
        }, model)
      }
    },
    goKf () {
      this.inService();
    },
    online_service () {
      window.open(
        'https://gzzaxc219.learnsaas.com/chat/chatClient/chatbox.jsp?companyID=941920&configID=41453&jid=3522871775&s=1'
      )
    },
    // 判断是否是IOS121_4
    isAfterIos121_4 () {
      let nu = navigator.userAgent.toLowerCase()
      let iosVersion = nu.match(/cpu iphone os (.*?) like mac os/)
      if (iosVersion && iosVersion.length > 1) {
        iosVersion = iosVersion[1].replace('_', '').replace('_', '.')
        return iosVersion && Number(iosVersion) > 121.4
      }
      return false
    },
    // 判断是否是安卓设备
    // isAndroid () {
    //   let u = navigator.userAgent
    //   return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    // },
    isSafari () {
      return (
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      )
    },
    // 判断是否是IOS设备
    isIos () {
      let u = navigator.userAgent
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },
    //判断是否是android设备
    isAnd () {
      let u = navigator.userAgent
      return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    },
    // 安装中的文字进度
    loading (callback, timeout) {
      var index = 0
      var loadingState = ['.', '..', '...']
      var intervalId = setInterval(() => {
        if (index > 2) {
          index = 0
        }
        this.isntallingtext = '正在安装,请耐心等待' + loadingState[index]
        index++
      }, 500)

      setTimeout(function () {
        if (intervalId) {
          clearInterval(intervalId)
        }
        if (callback) callback() // 回调
      }, timeout || 7000)
    },
    // ios12.1.4之前的下载按钮点击事件处理
    // onBeforeIos1214DownloadBtnClick () {
    //   this.installstep = 1
    //   if (!this.isAndroid() && !this.isSafari()) {
    //     alert('请使用苹果自带浏览器Safari打开本页')
    //     return false
    //   }
    //   this.loading(() => {
    //     this.isntallingtext = '安装完成后,请返回桌面查看'
    //   }, 7000)
    // },
    // ios12.1.4之后的下载按钮点击事件处理
    onAfterIos1214DownloadBtnClick () {
      this.installstep = 1
      if (!this.isSafari()) {
        alert('请使用苹果自带浏览器Safari打开本页')
        return false
      }

      this.loading(() => {
        this.isntallingtext = '安装完成后,请返回桌面查看'
      }, 1000)

      // 延迟2秒显示证书遮罩层
      setTimeout(() => {
        this.ios_mask = true
      }, 2000)

      // 延迟3秒显示证书安装箭头指示
      setTimeout(() => {
        this.license_step_img1 = true
      }, 3000)
    },
    showInstallMask () {
      if (this.isAfterIos121_4()) {
        this.showstatus = true
      }
    },
    // 点击下一步隐藏IOS弹窗
    closeMask () {
      this.license_step_img1 = false
      window.location.href = window.location.origin + window.location.pathname + '/static/file/setup.mobileprovision'
      setTimeout(() => {
        this.license_step_img2 = true
      }, 3000)
    }
  }
}
</script>
<style lang="less" type='text/less' scoped>
.down_content {
  /deep/ .swiper-slide-prev {
    transform: scale(1.2, 0.75) !important;
    width: 1.5rem !important;
  }
  // /deep/ .swiper-slide-duplicate{
  //   transform: translate3d(0px, 0px, -200px) rotateX(0deg) rotateY(100deg);
  // }
  /deep/ .swiper-slide-active {
    width: 4.5rem !important;
    z-index: 100000 !important;
    transform: unset !important;
  }
  /deep/ .swiper-slide-next {
    transform: scale(1.2, 0.75) !important;
    width: 1.5rem !important;
  }
}
.swiper-container {
  width: 400px;
  height: 300px;
  margin: 20px auto;
}

header,
.btn_group,
#app_information {
  background: #fff;
}

.wrap {
  width: 100%;
  height: 100%;
}
a {
    color: #7e8c8d;
    text-decoration: none;
}
.banner {
  width: 100%;
  /*height: 3rem;*/
}

.banner img {
  width: 100%;
  /*height: 100%;*/
}

.header_info {
  width: 100%;
  height: 1.21rem;
  box-sizing: border-box;
  background: #fff;
  position: relative;
}

.info_pic {
  position: absolute;
  top: -0.4rem;
  left: 0.36rem;
  width: 1.6rem;
  height: 1.6rem;
}

.info_pic img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
}

.info_text {
  width: 5.17rem;
  height: 1.2rem;
  margin-left: 2.33rem;
}

.info_text h2 {
  height: 0.56rem;
  text-align: left;
  line-height: 0.56rem;
  font-size: 0.4rem;
  font-weight: 600;
  color: rgb(40, 40, 40);
  padding-top: 0.15rem;
}

.info_text ul {
  width: auto;
  height: 0.3rem;
  line-height: 0.3rem;
  display: flex;
  font-size: 0.22rem;
  color: rgb(154, 154, 154);
  margin-top: 0.1rem;
}

.info_text ul li {
  margin-right: 0.4rem;
}

.info_text ul li img {
  height: 0.19rem;
}

.header_remarks {
  width: 6.9rem;
  height: 1.34rem;
  box-sizing: border-box;
  margin: 0 0.3rem;
  border-bottom: 1px rgb(228, 228, 228) solid;
  display: flex;
  justify-content: space-between;
}

.remarks_rating {
  margin-top: 0.2rem;
  width: 2.52rem;
  height: 0.84rem;
  text-align: left;
  font-size: 0;
}

.remarks_rating h3 {
  width: 3rem;
  height: 0.56rem;
  line-height: 0.56rem;
}

.remarks_rating h3 span {
  font-size: 0.5rem;
  font-weight: bold;
  color: #989898;
}

.remarks_rating h3 img {
  height: 0.28rem;
  margin-bottom: 0.05rem;
  margin-left: 0.2rem;
}

.remarks_rating p,
.remarks_info p {
  width: 100%;
  height: 0.28rem;
  line-height: 0.28rem;
  font-size: 0.26rem;
  color: #bebebe;
}

.remarks_info {
  margin-top: 0.2rem;
  width: 1.88rem;
  height: 0.84rem;
  display: flex;
  justify-content: space-between;
}

.remarks_info h3 {
  height: 0.56rem;
  font-weight: bold;
  font-size: 0.4rem;
  line-height: 0.56rem;
  color: #989898;
}

.remarks_info h3 span {
  font-size: 0.27rem;
}

.introduce {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  font-weight: bold;
  padding: 0.2rem 0.3rem;
  font-size: 0.31rem;
  line-height: 0.45rem;
  color: #7a7a7a;
  text-align: left;
}

.btn_group {
  width: 100%;
  // height: 3.9rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 0.61rem;
}

.btn_item {
  width: 100%;
  height: 1rem;
  margin-top: 0.3rem;
  display: flex;
  justify-content: space-around;
}
.repair-btn {
  position: relative;
  width: 100%;
  display: inline-block;
  height: 1rem;
  border: 1px #d6d3d3 solid;
  border-radius: 1rem;
  outline: none;
  text-align: center;
  font-size: 0.32rem !important;
  box-sizing: border-box;
  line-height: 1rem;
}
.repair-new {
  position: absolute;
  color: red !important;
  padding-left: 0.3rem;
}
.btn_item button {
  width: 100%;
  height: 1rem;
  border-radius: 1rem;
  border: none;
  outline: none;
  text-align: center;
  font-size: 0.32rem;
  box-sizing: border-box;
  line-height: 1rem;
}
.enter-web {
  border: 1px #d6d3d3 solid !important;
  color: rgb(51, 135, 255);
}
.btn_item button a {
  color: #fff;
  font-size: 0.32rem;
}

.btn_item:nth-of-type(1) button {
  background: rgb(51, 135, 255);
  color: #fff;
}

.btn_item {
  .iosMask.active {
    background: linear-gradient(right, #f1402f, #fe953a);
  }
}

.btn_item:nth-of-type(2) button {
  background: #fff;
  border: 1px #e2e2e2 solid;
  line-height: 0.96rem;
}

.btn_item:nth-of-type(3) {
  line-height: 0.6rem;
}

.btn_item span,
.btn_item a {
  font-size: 0.28rem;
  color: rgb(51, 135, 255);
}

.swiper-container {
  box-sizing: border-box;
  padding: 0.2rem 0;
  width: 100%;
  height: 2.75rem;
  background: rgb(240, 240, 240);
  margin-bottom: 0.36rem;
}

img.swiper-slide {
  // width: 4.62rem;
  height: 2.36rem;
}

.install {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  /* visibility: hidden; */
  /* display: none; */
}

.install_title {
  width: 100%;
  height: 0.8rem;
  position: absolute;
  top: 25%;
  left: 0;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 1px #ddd solid;
  display: flex;
  justify-content: space-between;
  padding: 0 0.2rem;
  line-height: 0.8rem;
  z-index: 1000;
  h4{
    font-size: 14px;
  }
}

.wrapper {
  width: 100%;
  height: 70%;
  position: relative;
  top: 30%;
  left: 0;
  overflow-x: hidden !important;
  overflow-y: scroll !important;
  background: #fff;
  box-sizing: border-box;
  padding: 0 0.385rem;
  -webkit-overflow-scrolling: touch;
}

.content {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  p{
    font-size: 14px;
  }
}

.content li {
  margin-top: 0.4rem;
  height: auto;
}

.content li p {
  width: 100%;
  text-align: center;
}

.content li img.img_01 {
  width: 6.73rem;
  height: auto;
}

.content li img.img_02 {
  width: 6.73rem;
  height: auto;
}

.content li:nth-last-of-type(1) {
  margin-bottom: 10px;
}

.ios_mask {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  top: 0;
  left: 0;
  text-align: center;
  z-index: 1000;
}

.ios_mask img {
  position: absolute;
  top: 7.8rem;
  left: 1.1rem;
  width: 5.28rem;
  height: 1.31rem;
  transform-origin: center 0.9rem;
  animation: iosWobble 1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.ios_mask button {
  width: 4.4rem;
  height: 0.94rem;
  border: 1px #fff solid;
  border-radius: 0.94rem;
  text-align: center;
  background: #ffffff;
  line-height: 0.94rem;
  font-size: 0.32rem;
  color: #007aff;
  box-shadow: 0px 0px 7px 2px #007fff;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

@media screen and (device-height: 736px) {
  .ios_mask img {
    top: 7rem !important;
  }

  .ios_mask button {
    bottom: 0.6rem;
  }
}

@media screen and (device-height: 667px) {
  .ios_mask img {
    top: 7rem !important;
  }

  .ios_mask button {
    bottom: 0.6rem;
  }
}

@media screen and (device-height: 568px) {
  .ios_mask img {
    top: 7rem !important;
  }

  .ios_mask button {
    bottom: 0.6rem;
  }
}

@keyframes iosWobble {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(5deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(5deg);
  }
  40% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(0deg);
  }
  70% {
    transform: rotate(-5deg);
  }
  80% {
    transform: rotate(-10deg);
  }
  90% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
