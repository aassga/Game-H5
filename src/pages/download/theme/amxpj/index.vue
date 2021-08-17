<template>
  <div class="down_content" >
    <view-page>
      <div class="wrap" slot="content">
        <button class="download_btn">
          <a v-if="isAnd() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
            :href="androidDowUrl"></a>
          <a v-else-if="isIos() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
            :href="iosDowUrl"></a>
          <a v-else-if="['amxpj'].includes($config.name)"
            @click="downApp"></a>
          <a v-else-if="isIos() && this.$config.download.appStore && this.$config.download.appStore.length > 0"
            @click="downAPP" ></a>
          <a v-else-if="isAnd()" :href="androidDowUrl"></a>
          <a v-else :href="iosDowUrl"></a>
        </button>
        <swiper :options="gameOption" class="game">
          <swiper-slide v-for="i in 3" :key="i">
            <img :src="require(`@src/assets/img/download/amxpj/game${i}.png`)"
                 class="swiper-slide">
          </swiper-slide>
        </swiper>
        <swiper :options="swiperOption" class="banner">
          <swiper-slide v-for="i in 8" :key="i">
            <img :src="require(`@src/assets/img/download/amxpj/banner${i}.png`)"
                 class="swiper-slide">
          </swiper-slide>
        </swiper>
        <!-- <div class="text" @click="install=true">查看安装引导>></div> -->
        <div class="introduce">
          <img v-for="i in 3" :key="i" :src="require(`@src/assets/img/download/amxpj/introduce${i}.png`)" alt="">
          <a v-if="isAnd() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
            :href="androidDowUrl"></a>
          <a v-else-if="isIos() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
            :href="iosDowUrl"></a>
          <a v-else-if="['amxpj'].includes($config.name)"
            @click="downApp"></a>
          <a v-else-if="isIos() && this.$config.download.appStore && this.$config.download.appStore.length > 0"
            @click="downAPP" ></a>
          <a v-else-if="isAnd()" :href="androidDowUrl"></a>
          <a v-else :href="iosDowUrl"></a>
        </div>
      </div>
      <div slot="content-static" class="down-bottom" v-no-touch-move>
        <img :src="require('@src/assets/img/download/amxpj/bottom.gif')" alt=""/>
        <a v-if="isAnd() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
          :href="androidDowUrl"></a>
        <a v-else-if="isIos() && (!$store.state.main.downloadType || $store.state.main.downloadType === '')"
          :href="iosDowUrl"></a>
        <a v-else-if="['amxpj'].includes($config.name)"
          @click="downApp"></a>
        <a v-else-if="isIos() && this.$config.download.appStore && this.$config.download.appStore.length > 0"
          @click="downAPP" ></a>
        <a v-else-if="isAnd()" :href="androidDowUrl"></a>
        <a v-else :href="iosDowUrl"></a>
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
      iosafter: true,
      installstep: '',
      ios_mask: false,
      license_step_img1: false,
      license_step_img2: false,
      showstatus: true,
      iosDowUrl:null,
      androidDowUrl:null,
      swiperOption: {
        watchSlidesProgress: true,
        slidesPerView: 3,
        spaceBetween: 50,
        centeredSlides: true,
        loop: true,
        autoplay:{
          delay:3000,
          stopOnLastSlide: false,
          disableOnInteraction:false
        },
      },
      gameOption: {
        loop: true,
        autoplay:{
          delay:3000,
          disableOnInteraction:false
        },
      },
      appdata: null,
      appkey: '',
      tranceKey: '',
      theAppKey: ''
    }
  },
  mounted () {
    this.showInstallMask()
    var str = window.location.href;
    var index = str.lastIndexOf("#");
    var rl = str.substring(0, index-3);
    setTimeout(() => {
      // this.initDown();
      // if(this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '') {
      //   if (['amxpj'].includes(this.$config.name)) {
      //   let str = window.location.href;
      //   let agent = localStorage['agent'] || localStorage['channelCode'];
      //   let par1 = "channelCode=" + agent + "&channelDomain=" + str.substring(0, this.find(str, '/', 2));
      //   let par2 = "channelDomain=" + str.substring(0, this.find(str, '/', 2));
      //   if (this.$config.name === 'amxpj') {
      //     if (localStorage['signer'] || this.$store.state.main.downloadType === 'superSign') {
      //       this.theAppKey = "c336fd2ee19f948d"; // 超级签
      //     } else {
      //       this.theAppKey = '62392c363969406d'; // 企业签
      //     }
      //   } 
      //   ShareTrace.init({
      //     appkey: this.theAppKey, // 此值必填
      //     param: agent ? par1 : par2,
      //   });
      // }
      // }
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
      if (['amxpj'].includes(this.$config.name)) {
        let downApp= new this.$AppDown(this);
        downApp.downloadGame();
        // ShareTrace.download()

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
.wrap {
  width: 100%;
  height: 27rem;
  background-image: url('../../../../assets/img/download/amxpj/bg.png');
  background-size: 100% 100%;
  .download_btn {
    width: 3.4rem;
    height: 0.94rem;
    margin-top: 4.47rem;
    background-image: url('../../../../assets/img/download/amxpj/download_btn.png');
    background-size: 100% 100%;
    a {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

.banner {
  margin-top: 0.2rem;
  .swiper-container {
    width: 100%;
  }
  .swiper-slide {
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    transform: scale(0.9);
  }
  .swiper-slide-active,.swiper-slide-duplicate-active{
    transform: scale(1.1);
    z-index: 10;
  }

  .swiper-slide-next {
    z-index: 2;
  }
  .swiper-slide img{
    width: 4.2rem;
    transform:translate3d(0,0,0)
  }

  .swiper-slide-next img{
    transform: translate3d(-1rem, 0, 0);
  }

  .swiper-slide-prev img {
    transform: translate3d(1rem, 0, 0);
  }
}

.game {
  margin-top: 0.2rem;
  .swiper-slide {
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .swiper-slide img{
    width: 7.5rem;
    transform:translate3d(0,0,0)
  }
}

.text {
  margin-top: 0.15rem;
  color: #FBC681;
  text-align: center;
  font-size: 0.3rem;
}

.introduce {
  position: relative;
  img {
    width: 7rem;
    margin-top: 0.3rem;
  }
  a{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.down-bottom{
  position: relative;
  width: 100%;
  height: 1.32rem;
  position: fixed;
  bottom: 0;
  z-index: 502;
  background-color: rgba(35, 18, 1, 0.82);
  img{
    width:100%;
  }
  a{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.install {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
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
