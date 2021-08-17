<template>
  <div class="agency-container">
    <div class="invitaImgArea" ref="invitaImgArea">
      <img :src="imgUrl('memberImgBg')" class="bg" />
      <div class="qrcode-area">
        <div class="qrCode" ref="qrCode"></div>
        <span class="text theme-color-white">您的邀请码</span>
        <span class="code theme-color-yellow-2" v-if="$store.state.agency.intiviData && $store.state.agency.intiviData.code">{{$store.state.agency.intiviData.code}}</span>
      </div>
      <div class="titleArea theme-color-yellow-2">
        <img :src="imgUrl('agencyTitleIcon')" alt />
        简单三步&nbsp;&nbsp;立得奖励
        <img :src="imgUrl('agencyTitleIcon')" alt />
      </div>
      <img :src="imgUrl('member-img6')" class="img6" />
    </div>
    <img :src="imgUrl('member-img7')" class="img7" />
    <img v-if="copyImg" class="copyImg" :src="copyImg" />
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import Html2Canvas from "html2canvas";
export default {
  data() {
    return {
      copyImg: "",
      qr: null,
      isIos: false,
      version: 0,
    };
  },
  created() {
    this.$store.dispatch("agency/getInvitation", {
      activityType: "getInvitation"
    });
    this.phoneDetail()
  },
  mounted() {
    console.log(this.$config.blush)
    setTimeout(() => {
      this.$refs["qrCode"] ? this.$refs["qrCode"].innerHTML = "" : ''
      if (
        this.$store.state.agency.intiviData &&
        this.$store.state.agency.intiviData.domain
      ) {
        this.qr = new QRCode(this.$refs["qrCode"], {
          text: this.$store.state.agency.intiviData.domain,
          width: 2.8 * this.rem,
          height: 2.8 * this.rem
        });
      }
    }, 100);
    setTimeout(() => {
      if(this.version <= 10 && this.isIos) {
        this.toastText("手机版本过低 请自行截图", "middle");
      }else {
        this.setImgUrl();
      }
    }, 1000);
  },
  watch: {
    "$store.state.agency.intiviData"(nowVal) {
      if (nowVal && nowVal.domain) {
        this.$refs["qrCode"] ? this.$refs["qrCode"].innerHTML = "" : ''
        this.qr = new QRCode(this.$refs["qrCode"], {
          text: nowVal.domain,
          width: 2.8 * this.rem,
          height: 2.8 * this.rem
        });
      }
    }
  },
  methods: {
    imgUrl(imgName) {
      return require(`@src/assets/img/invite/${this.$config.blackTheme ? 'black-' + imgName : (this.$config.blush ? 'blush-'+imgName:imgName)}.png`)
    },
    setImgUrl() {
      if (!this.copyImg && this.qr) {
        Html2Canvas(this.$refs.invitaImgArea, {
          scale: 2,
          dpi: 192
        }).then(canvas => {
          const base64 = canvas.toDataURL("image/png");
          this.copyImg = base64;
        });
      }
    },
    // 手机信息
    phoneDetail () {
      this.isIos = this.$mobileDevice.isIOS;
      this.version = this.$mobileDevice.osVersion;
    },
  }
};
</script>

<style lang="scss" scoped>
.copyImg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-touch-callout: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.agency-container {
  position: relative;
  overflow: hidden;
  width: 7.5rem;
  height: 17.5rem;
  .invitaImgArea {
    height: 100%;
    width: 100%;
  }
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .img1 {
    position: absolute;
    top: .81rem;
    left: 50%;
    transform: translateX(-50%);
    width: 5.61rem;
    height: 0.84rem;
  }
  .img2 {
    position: absolute;
    top: 1.81rem;
    left: 50%;
    transform: translateX(-50%);
    width: 5.37rem;
    height: 0.65rem;
  }
  .qrcode-area {
    position: relative;
    top: 3.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.86rem;
    height: 4.66rem;
    .qrCode {
      position: absolute;
      top: 0.72rem;
      left: 2.03rem;
      width: 2.8rem;
      height: 2.8rem;
    }
    .text {
      position: absolute;
      bottom: 0.39rem;
      left: 1.48rem;
      color: #555555;
      font-size: 0.32rem;
    }
    .code {
      position: absolute;
      bottom: 0.3rem;
      left: 3.3rem;
      font-size: 0.56rem;
      font-weight: bold;
      color: #EA6834;
      letter-spacing: .02rem;
    }
  }
  .img5 {
    position: absolute;
    top: 10.06rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.02rem;
    height: 1.5rem;
  }
  .titleArea {
    position: absolute;
    top: 12rem;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    text-align: center;
    font-size: 0.36rem;
    img {
      width: 0.36rem;
      height: 0.27rem;
      vertical-align: middle;
    }
  }
  .img6 {
    width: 6.86rem;
    height: 2.08rem;
    position: absolute;
    top: 12.73rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .img7 {
    position: absolute;
    top: 15.44rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.88rem;
    height: 0.98rem;
    z-index: 999;
  }
}
</style>