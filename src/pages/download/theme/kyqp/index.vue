<template>
<view-page class="login-box" :style="{height: '100%'}" ref="view-page" :prevent-default="false">
  <div slot="content" class="kyqp-down">
    <div class="top">
      <img src="static/download/kyqp/top.jpg" alt />
    </div>
    <div class="down-btn">
      <a href="javascript:void (0);" onclick="DownSoft()">
        <img src="static/download/kyqp/downBtn.gif" />
      </a>
    </div>
    <div class="cesu">
      <div class="title ios_show" id="mxr">
        <a href="javascript:showXR()">
          <img src="static/download/kyqp/title_ios.jpg" alt />
        </a>
      </div>
      <div class="title hide and_show">
        <img src="static/download/kyqp/title_and.jpg" alt />
      </div>
      <div class="list">
        <dl>
          <dt>站点一</dt>
          <dd>
            <cite id="time1">-ms</cite>
            <span>
              https://
              <b>ky8.com</b>
            </span>
          </dd>
          <dd class="btns" data-url="https://ky8.com">
            <button>点击进入</button>
          </dd>
        </dl>
        <dl>
          <dt>站点二</dt>
          <dd>
            <cite id="time2">-ms</cite>
            <span>
              https://
              <b>ky8.com</b>
            </span>
          </dd>
          <dd class="btns" data-url="https://ky8.com">
            <button>点击进入</button>
          </dd>
        </dl>
        <dl>
          <dt>站点三</dt>
          <dd>
            <cite id="time3">-ms</cite>
            <span>
              https://
              <b>ky8.com</b>
            </span>
          </dd>
          <dd class="btns" data-url="https://ky8.com">
            <button>点击进入</button>
          </dd>
        </dl>
      </div>
    </div>
    <div class="slider">
      <img src="static/download/kyqp/slider.jpg" style="min-height: 300px;" alt />
      <!-- <div id="slider">
        <div id="certify">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider1.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider2.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider3.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider4.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider5.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider6.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider7.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider8.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider9.png" />
              </div>
              <div class="swiper-slide">
                <img src="static/download/kyqp/slider10.png" />
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <swiper id="slider" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <img src="static/download/kyqp/slider1.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider2.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider3.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>

          <swiper-slide>
            <img src="static/download/kyqp/slider4.png" class="swiper-slide" />
          </swiper-slide>
        </swiper>
    </div>
    <div class="content">
      <img src="static/download/kyqp/ct1.jpg" alt />
      <div class="ct2">
        <img src="static/download/kyqp/ct2.jpg" alt />
        <div class="slider contentBanner">
          <div id="slider2">
            <div id="certify2">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner1.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner2.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner3.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner4.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner5.png" />
                  </div>
                  <div class="swiper-slide">
                    <img src="static/download/kyqp/banner6.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img src="static/download/kyqp/ct3.jpg" alt />
    </div>
    <div class="hidden">
      <img src="static/download/kyqp/jc_close.jpg" alt />
      <img src="static/download/kyqp/jc.png" alt />
      <img src="static/download/kyqp/jc_xr.jpg" alt />
      <iframe src id="download_if" frameborder="0"></iframe>
    </div>
    <a href id="cs">
      <img src="static/download/kyqp/cs.png" alt usemap="#Map" />
      <map name="Map">
        <area
          shape="rect"
          coords="-17, -21, 129, 197"
          href="https://chat8585.chatkizla.com/chat/chatClient/chatbox.jsp?companyID=12225&configID=66995&jid=&s=1"
          target="_blank"
        />
      </map>
    </a>
    <div id="xrBox" style="background: #000000;">
      <div>
        <div onclick="hideXrBox()">
          <img src="static/download/kyqp/jc_close.jpg" alt />
        </div>
        <img src="static/download/kyqp/jc.png" alt />
        <a href="./kyqp.mobileprovision">
          <img src="static/download/kyqp/jc_xr.jpg" alt />
        </a>
      </div>
    </div>
    <div class="gx">
      <a href="./tool/index.html" target="_blank">
        <img src="static/download/kyqp/dibu.gif" />
      </a>
    </div>
  </div>
</view-page>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  components: {
    swiper,
    swiperSlide
  },
  beforeCreate(){
    console.log(process.env.NODE_ENV);
    console.log(window.location.host)
    console.log(window.location.origin)
    window.location.replace(window.location.origin+'/m/static/download/kyqp/m/index.html')
  },
  data() {
    return {
      install: false,
      isntallingtext: "APP下载安装,领取现金红包",
      iosafter: true,
      installstep: "",
      ios_mask: false,
      license_step_img1: false,
      license_step_img2: false,
      showstatus: true,

      // swiperOption: {
      //   loop: true,
      //   autoplay: {
      //     delay: 100000,
      //     stopOnLastSlide: false,
      //     disableOnInteraction: false
      //   },
      //   effect: "coverflow",
      //   slidesPerView: 5,
      //   centeredSlides: true
      // }
      swiperOption: {
          effect: 'coverflow',
          loop: true,
          slidesPerView: 5,
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
          },
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
        }
    };
  },
  mounted() {
    this.showInstallMask();
  },
  methods: {
    downApp() {
      let model = {
        siteCode: this.siteConfig.download.appStore
      };
      new OpenInstall(
        {
          appKey: "u4gzdw",
          onready: function() {
            this.schemeWakeup();
            this.wakeupOrInstall();
            return false;
          }
        },
        model
      );
    },
    goKf() {
      const win = window.open("", "_blank");
      if (win) win.location.href = this.getKF();
      else window.location.href = this.getKF();
    },
    online_service() {
      window.open(
        "https://gzzaxc219.learnsaas.com/chat/chatClient/chatbox.jsp?companyID=941920&configID=41453&jid=3522871775&s=1"
      );
    },
    // 判断是否是IOS121_4
    isAfterIos121_4() {
      let nu = navigator.userAgent.toLowerCase();
      let iosVersion = nu.match(/cpu iphone os (.*?) like mac os/);
      if (iosVersion && iosVersion.length > 1) {
        iosVersion = iosVersion[1].replace("_", "").replace("_", ".");
        return iosVersion && Number(iosVersion) > 121.4;
      }
      return false;
    },
    // 判断是否是安卓设备
    isAndroid() {
      let u = navigator.userAgent;
      return u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    },
    isSafari() {
      return (
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      );
    },
    // 判断是否是IOS设备
    isIos() {
      let u = navigator.userAgent;
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    // 安装中的文字进度
    loading(callback, timeout) {
      var index = 0;
      var loadingState = [".", "..", "..."];
      var intervalId = setInterval(() => {
        if (index > 2) {
          index = 0;
        }
        this.isntallingtext = "正在安装,请耐心等待" + loadingState[index];
        index++;
      }, 500);

      setTimeout(function() {
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (callback) callback(); // 回调
      }, timeout || 7000);
    },
    // ios12.1.4之前的下载按钮点击事件处理
    onBeforeIos1214DownloadBtnClick() {
      this.installstep = 1;
      if (!this.isAndroid() && !this.isSafari()) {
        alert("请使用苹果自带浏览器Safari打开本页");
        return false;
      }
      this.loading(() => {
        this.isntallingtext = "安装完成后,请返回桌面查看";
      }, 7000);
    },
    // ios12.1.4之后的下载按钮点击事件处理
    onAfterIos1214DownloadBtnClick() {
      this.installstep = 1;
      if (!this.isSafari()) {
        alert("请使用苹果自带浏览器Safari打开本页");
        return false;
      }

      this.loading(() => {
        this.isntallingtext = "安装完成后,请返回桌面查看";
      }, 1000);

      // 延迟2秒显示证书遮罩层
      setTimeout(() => {
        this.ios_mask = true;
      }, 2000);

      // 延迟3秒显示证书安装箭头指示
      setTimeout(() => {
        this.license_step_img1 = true;
      }, 3000);
    },
    showInstallMask() {
      if (this.isAfterIos121_4()) {
        this.showstatus = true;
      }
    },
    // 点击下一步隐藏IOS弹窗
    closeMask() {
      this.license_step_img1 = false;
      window.location.href =
        window.location.origin +
        window.location.pathname +
        "/static/file/setup.mobileprovision";
      setTimeout(() => {
        this.license_step_img2 = true;
      }, 3000);
    }
  }
};
</script>
<style lang="less" type='text/less' scoped>
.index-view{
  overflow: auto !important;
}
.down_content {
  // /deep/ .swiper-slide-prev {
  //   transform: scale(1.2, 0.75) !important;
  //   width: 1.5rem !important;
  // }
  // // /deep/ .swiper-slide-duplicate{
  // //   transform: translate3d(0px, 0px, -200px) rotateX(0deg) rotateY(100deg);
  // // }
  // /deep/ .swiper-slide-active {
  //   width: 4.5rem !important;
  //   z-index: 100000 !important;
  //   transform: unset !important;
  // }
  // /deep/ .swiper-slide-next {
  //   transform: scale(1.2, 0.75) !important;
  //   width: 1.5rem !important;
  // }
  .slider{position:relative}
   #slider{position:absolute;left:0;top:0;z-index:9999;width:100vw}
  #certify{position:relative;width:100%;margin:0 auto}
  #certify .swiper-slide{width:170px;text-align:center}
  #certify .swiper-slide img{display:block;margin:0 auto}
}
.hide{
  display: none;
}
.kyqp-down{
  width: 100%;
  .top,.down-btn{
    width: 100%;
    img{
      display: table-column;
      width: 100%;
    }
  }
  .down-btn{
    height: 2rem;
    a{
      img{
        height: 2rem;
      }
    }
  }
  .cesu{
    padding-top: 0.2rem;
    background: linear-gradient(to bottom,#2D1A0C,#1A100F);
    padding-bottom: 0.4rem;
    img{
      width: 100%;
    }
    .list{
      margin: 0 0.16rem;
      padding-top: 0.2rem;
      dl{
        display: flex;
        justify-content: space-between;
        padding: 0.12rem 0;
        dt{
          background: #a70503;
          color: #fff;
          font-size: 0.28rem;
          height: 0.6rem;
          line-height: 0.6rem;
          width: 1.36rem;
          text-align: center;
          flex-shrink: 0;
          border: red 0.02rem solid;
          border-right: none;
        }
        dt+dd{
          background: #e8e8e8;
          line-height: 0.6rem;
          position: relative;
          cite{
            position: absolute;
            left: 0;
            top: 0;
            font-size: 0.2rem;
            background: #d6d6d6;
            color: #666;
            height: 0.28rem;
            line-height: 0.28rem;
            font-style: normal;
            padding: 0 0.08rem;
          }
          span{
            display: block;
            padding-left: 0.8rem;
            font-size: 0.28rem;
          }
        }
        dd{
          flex-grow: 1;
        }
        dd.btns{
          flex-grow: 0;
          flex-shrink: 0;
          width: 1.64rem;
          padding-left: 0.28rem;
          button{
            height: 0.6rem;
            line-height: 0.6rem;
            display: block;
            width: 100%;
            background: red;
            border-radius: 0.12rem;
            color: #fff;
            border:none;
            border-bottom: #a70503 0.06rem solid;
          }
        }
      }
    }
  }
}
</style>
