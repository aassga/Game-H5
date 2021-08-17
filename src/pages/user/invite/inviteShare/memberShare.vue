<template>
  <div class="agency-container">
    <div class="invitaImgArea" ref="invitaImgArea">
      <img src="@src/assets/img/invite/oldMemberShare.jpg" class="bg">
      <div class="qrcode-area">
        <div class="qrCode" ref="qrCode"></div>
        <div class="text">您的邀请码</div>
        <div class="code" v-if="$store.state.agency.intiviData && $store.state.agency.intiviData.code">{{$store.state.agency.intiviData.code}}</div>
      </div>
      <div class="titleArea">
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
        活动内容
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
      </div>
      <img src="@src/assets/img/invite/old-agency-img1.png" class="img1">
      <div class="titleArea titleArea1">
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
        简单三步&nbsp;&nbsp;立得奖励
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
      </div>
      <img src="@src/assets/img/invite/agency-img2.png" class="img2">
    </div>
    <img src="@src/assets/img/invite/agency-img3.png" class="img3" />
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
    })
    this.phoneDetail()
  },
  mounted() {
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
  height: 25.5rem;
  .invitaImgArea {
    // background: url('../../../../assets/img/invite/agencyImgBg.jpg');
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
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
  .qrcode-area {
    position: relative;
    top: 3.89rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.18rem;
    height: 4.5rem;
    border-radius: 0.15rem;
    .qrCode {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 3.2rem;
      height: 3.2rem;
      padding: .2rem;
      background-color: #fff;
    }
    .text {
      position: absolute;
      bottom: 0.28rem;
      left: 1.75rem;
      color: #555555;
      font-size: 0.32rem;
    }
    .code {
      position: absolute;
      bottom: 0.19rem;
      left: 3.55rem;
      font-size: 0.56rem;
      font-weight: bold;
      color: #EA6834;
    }
  }
  .titleArea {
    position: absolute;
    top: 12.35rem;
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
  .img1 {
    position: absolute;
    top: 13.15rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.18rem;
    height: 6.5rem;
  }
  .titleArea1 {
    top: 20.3rem;
  }
  .img2 {
    position: absolute;
    top: 21.1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.18rem;
    height: 2.08rem;
  }
  .img3 {
    position: absolute;
    top: 23.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.98rem;
    height: 1.02rem;
    z-index: 999;
  }
}
</style>