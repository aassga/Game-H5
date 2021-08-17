<template>
  <view-page full-box static-z-index="1000">
    <div class="wrap" slot="content">
      <div class="banner">
        <img alt id="app_banner" src="../../../../assets/img/download/h5/banner.png">
      </div>
      <header>
        <div class="header_info">
          <div class="info_pic">
            <img alt id="app_logo" :src="logoImg">
          </div>
          <div class="info_text">
            <h2 id="app_name">{{$config.setName.split(/[\s-]/)[0]}}</h2>
            <ul>
              <li>
                <img alt src="../../../../assets/img/download/h5/2.png">
                <span id="download_count">9752</span>
              </li>
              <li>
                <img alt src="../../../../assets/img/download/h5/3.png">
                <span>IOS/Android</span>
              </li>
              <li>
                <img alt src="../../../../assets/img/download/h5/4.png">
                <span id="app_version">v2.02</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="header_remarks">
          <div class="remarks_rating">
            <h3>
              <span id="grade">5.0</span>
              <img alt src="../../../../assets/img/download/h5/start.png">
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
      <div id="app_information" class="introduce">{{$config.setName.split(/[\s-]/)[0]}}是国内一家综合性游戏平台，提供百家乐，千炮捕鱼，炸金花，牛牛等数百款视讯及电子游戏。</div>
      <div class="btn_group">
        <div class="btn_item">
          <button id="download_btn" class="iosMask" :class="installstep=='1'?'active':''">
            <a style="color: #fff !important;"
               :href="$config.download.bookmark"
               v-html="isntallingtext"
               @click="isAfterIos121_4() ? onAfterIos1214DownloadBtnClick() : onBeforeIos1214DownloadBtnClick()"
            ></a>
          </button>
        </div>
        <div class="btn_item">
          <button @click="$router.push('/')">进入官网</button>
        </div>
        <div class="btn_item">
          <a href="javascript:void(0)" @click="goKf" target="_blank">在线客服</a>
          <a href="javascript:void(0)" @click="install=true">查看安装引导</a>
        </div>
      </div>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
          <img alt src="../../../../assets/img/download/h5/lunbo1.png" class="swiper-slide">
        </swiper-slide>
        <swiper-slide>
          <img alt src="../../../../assets/img/download/h5/lunbo2.png" class="swiper-slide">
        </swiper-slide>
        <swiper-slide>
          <img alt src="../../../../assets/img/download/h5/lunbo3.png" class="swiper-slide">
        </swiper-slide>
        <swiper-slide>
          <img alt src="../../../../assets/img/download/h5/lunbo4.png" class="swiper-slide">
        </swiper-slide>
      </swiper>
    </div>

    <div class="installing-box" slot="static" v-show="install||ios_mask">
      <div class="install" v-show="install">
        <div class="install_title">
          <h4>安装教程</h4>
          <a
            href="javascript:void(0)"
            class="close"
            style="font-size: .5rem;"
            @click="install=false"
          >×</a>
        </div>
        <div id="iosafter" class="wrapper" v-if="showstatus=true">
          <ul class="content">
            <li>
              <img alt src="../../../../assets/img/download/h5/install_1.png" class="img_01">
              <p>点击下载APP后选择“允许”</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_2.png" class="img_01">
              <p>描述文件下载完后点击“关闭”</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_3.png" class="img_01">
              <p>点击安装游戏，快捷跳转进入系统设置描述文件入口</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_4.png" class="img_01">
              <p>点击描述文件，开始安装</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_5.png" class="img_02">
              <p>安装描述文件</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_6.png" class="img_01">
              <p>安装开始前需要输入解锁密码（无密码忽略此步）</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/install_7.png" class="img_01">
              <p>最后再次点击“安装”后即可</p>
            </li>
          </ul>
        </div>

        <!--IOS12之前-->
        <div id="iosbefore" class="wrapper" v-else>
          <ul class="content">
            <li>
              <img alt src="../../../../assets/img/download/h5/installationStep1.png" class="img_01">
              <p>点击下载APP后选择“允许”</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/installationStep2.png" class="img_01">
              <p>描述文件下载完后点击“关闭”</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/installationStep3.png" class="img_01">
              <p>点击安装游戏，快捷跳转进入系统设置描述文件入口</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/installationStep4.png" class="img_01">
              <p>点击描述文件，开始安装</p>
            </li>
            <li>
              <img alt src="../../../../assets/img/download/h5/installationStep5.png" class="img_02">
              <p>安装描述文件</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="ios_mask" v-show="ios_mask">
        <img alt id="license_step_img1" src="../../../../assets/img/download/h5/mask.png" v-show="license_step_img1"/>
        <img alt id="license_step_img2" src="../../../../assets/img/download/h5/mask2.png" v-show="license_step_img2"/>
        <button class="closeMask" @click="closeMask">2:证书已安装·下一步</button>
      </div>
    </div>
  </view-page>
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
      isntallingtext: '免费下载安装,领取现金红包',
      iosafter: true,
      installstep: '',
      ios_mask: false,
      license_step_img1: false,
      license_step_img2: false,
      showstatus: true,

      swiperOption: {
        loop: true,
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      }
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
  },
  methods: {
    goKf () {
      const win = window.open('', '_blank')
      if (win) win.location.href = this.getKF()
      else window.location.href = this.getKF()
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
    // 安装中的文字进度
    loading (callback, timeout) {
      let index = 0
      let loadingState = ['.', '..', '...']
      let intervalId = setInterval(() => {
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
    onBeforeIos1214DownloadBtnClick () {
      this.installstep = 1
      if (!this.isAndroid && !this.isSafari()) {
        alert('请使用苹果自带浏览器Safari打开本页')
        return false
      }
      this.loading(() => {
        this.isntallingtext = '安装完成后,请返回桌面查看'
      }, 7000)
    },
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
  .swiper-container {
    width: 400px;
    height: 300px;
    margin: 20px auto;
  }

  .installing-box {
    pointer-events: all;
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
  }

  .btn_group {
    width: 100%;
    height: 3.9rem;
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
    height: 3rem;
    background: rgb(240, 240, 240);
    margin-bottom: 0.36rem;
  }

  img.swiper-slide {
    width: 4.62rem;
    height: 2.61rem;
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
      font-size:14px;
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
      font-size:14px;
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
    height: 2.41rem;
  }

  .content li img.img_02 {
    width: 6.73rem;
    height: 2.8rem;
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
