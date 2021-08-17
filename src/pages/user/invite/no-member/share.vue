<template>
<view-page class="view-page" full-box>
    <title-header slot="header" title="分享邀请" class="header">
    </title-header>
    <div class="content" slot="content">
      <div class="invitaImgArea" ref="invitaImgArea">
      <img src="@src/assets/img/invite/no-member/share-bg.jpg" class="bg" />
      <p class="p1">超过1,000,00+人赚到奖励</p>
      <p class="p2">邀请码：{{code.code}}</p>
      <div class="qrCode" ref="qrCode"></div>
      <div class="titleArea titleArea1">
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
        向钱冲
        <img src="@src/assets/img/invite/agencyTitleIcon.png" alt />
      </div>
      <div class="go-money">
        <div>
          <p>1.发送微信群聊、朋友圈、QQ群、QQ空间、微博、社交软件等</p>
          <p>2.社交软件看到图片注册生成属于自己的分享二维码并相互转发</p>
          <p>3.分享无限级，注册分享好友越多、等级越高、你赚越多</p>
        </div>
        <div style="margin-top:.15rem;">
          <p>李嘉诚说他这辈子都在做的三件事：</p>
          <p class="step">
            <span>
              <i>1</i>赶趋势
            </span>
            <span>
              <i>2</i>抓机会
            </span>
            <span>
              <i>3</i>找平台
            </span>
          </p>
        </div>
        <div style="margin-top:.15rem">
          <p>这个时代不是苦干蛮干可以赚钱，还是要懂得发现新的机会，与时俱进把握趋势！</p>
        </div>
        <div style="margin-top:.15rem">
          <p>不上台演出，永远只是观众，伴随看着您身边的资源去别的网站娱乐，不如分享他来{{$config.setName}}注册,弹指分享,终生有效,革新钜惠,礼金无上限,开启璀璨人生。</p>
        </div>
      </div>
    </div>
    <img src="@src/assets/img/invite/agency-img3.png" class="img3" />
    <img v-if="copyImg" class="copyImg" :src="copyImg" />
    </div>
  </view-page>
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
      code:{},
    };
  },
  created() {
    let noInviteCode = JSON.parse(sessionStorage.getItem('noInviteCode'))
    if(noInviteCode) this.code = noInviteCode
    this.$store
      .dispatch("agency/getInvitation", {
        activityType: "getInvitation"
      })
      .then(res => {
        if (res.code === 200) {
          this.code = res.data
          sessionStorage.setItem('noInviteCode',JSON.stringify(res.data))
        }
      });
  },
  mounted() {
    this.phoneDetail();
    setTimeout(() => {
      this.$refs["qrCode"] ? (this.$refs["qrCode"].innerHTML = "") : "";
      if (
        this.code &&
        this.code.domain
      ) {
        this.qr = new QRCode(this.$refs["qrCode"], {
          text: this.code.domain,
          width: 2.08 * this.rem,
          height: 2.08 * this.rem
        });
      }
    }, 100);
    setTimeout(() => {
      if (this.version <= 10 && this.isIos) {
        this.toastText("手机版本过低 请自行截图", "middle");
      } else {
        this.setImgUrl();
      }
    }, 1000);
  },
  watch: {
    "$store.state.agency.intiviData"(nowVal) {
      if (nowVal && nowVal.domain) {
        this.$refs["qrCode"] ? (this.$refs["qrCode"].innerHTML = "") : "";
        this.qr = new QRCode(this.$refs["qrCode"], {
          text: nowVal.domain,
          width: 2.09 * this.rem,
          height: 2.09 * this.rem
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
    phoneDetail() {
      this.isIos = this.$mobileDevice.isIOS;
      this.version = this.$mobileDevice.osVersion;
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  background: #FB552D !important;
}
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
.content {
  position: relative;
  overflow: hidden;
  width: 7.5rem;
  height: 16.62rem;
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
  .p1 {
    color: #FFFFFF;
    font-size: 0.28rem;
    position: absolute;
    top: 0.04rem;
    width: 100%;
  }
  .p2 {
    position: absolute;
    top: 2.17rem;
    left: 3.24rem;
    color: #fff;
    font-size: 0.26rem;
  }
  .qrCode {
    position: absolute;
    top: 2.6rem;
    left: 3.08rem;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.08rem;
    background-color: #fff;
  }
  .titleArea {
    position: absolute;
    top: 6.9rem;
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
  .go-money {
    position: absolute;
    background-color: #fff;
    top: 7.6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.18rem;
    height: 6.9rem;
    border-radius: 0.15rem;
    font-size: .28rem;
    color: #333;
    text-align: left;
    padding: 0.26rem 0.23rem 0 .23rem;
    line-height: .44rem;
    .step {
      position: relative;
      margin-top: .1rem;
      overflow:hidden;
      height:.45rem;
      span{
        position: absolute;
        top: 0;
        &:nth-child(1) {
          left: 0;
        }
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
        &:nth-child(3) {
          right: 0;
        }
        i{
          display: inline-block;
          width: .28rem;
          height: .28rem;
          line-height: .28rem;
          text-align: center;
          border-radius: 50%;
          background-color: #FEB239;
          color: #fff;
          margin-right: .07rem;
        }
      }
    }
  }
  .img3 {
    position: absolute;
    top: 15rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.88rem;
    height: 1.02rem;
    z-index: 999;
  }
}
</style>