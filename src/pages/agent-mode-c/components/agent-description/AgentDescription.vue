<template>
  <van-popup v-model="show" :style="positionStyle" position="bottom"  get-container="body" :overlay="true" :lazy-render="false">
    <div class="container">
      <div class="tit">
        推广方式
        <span class="close" @click="show = false">
          <img src="@src/assets/img/agent-center-modec/index/close-agent-des.png" />
        </span>
      </div>
      <div class="cont">
        <div class="text">邀请好友提高自得洗码比例还能拿下级洗码金额</div>
        <div class="manner-group">
          <div class="manner-item">
            <div class="qr-code img" ref="qr-code"></div>
            <div class="name">保存二维码(长按保存)</div>
            <img :src="QRcodeImg" alt="" v-if="QRcodeImg" class="QRcodeImg">
          </div>
          <div class="manner-item" @click="onCopy">
            <img src="@src/assets/img/agent-center-modec/index/manner-item2.png" class="img" />
            <div class="name">复制链接</div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script type="text/javascript">
import QRCode from 'qrcodejs2'
import Html2Canvas from "html2canvas";
export default {
  name: "AgentDescription",
  props: {
    agencyCode: {
      type: String
    }
  },
  computed: {
    positionStyle(){
      //解决安卓小米position：fixed问题导致按钮错位问题
      if(this.$mobileDevice.isAndroid 
        && this.$mobileDevice.browserName === 'MIUI Browser'){
        return {
          position:'absolute'
        }
      }else{
        return {
          position:'fixed'
        }
      }
    },
  },
  data() {
    return {
      show: false,
      QRCode: null,
      QRcodeImg: '',
    };
  },
  watch: {
    'show' (isShow) {
      if(isShow && this.$refs['qr-code']) {
        this.qrCodeHandle()
      }
    }
  },
  methods: {
    onCopy() {
      if (this.agencyCode) {
        this.$copyText(`${window.location.origin}?agent=${this.agencyCode}`).then(
          e => {
            this.toastText("复制成功", "top");
          },
          e => {
            this.toastText("请手动复制或使用其他浏览器尝试", "top");
          }
        );
      } else {
        this.toastText("复制失败，没有邀请码", "top");
      }
    },
    qrCodeHandle() {
      this.$refs["qr-code"].innerHTML = ''
      this.QRCode = new QRCode(this.$refs['qr-code'], {
        text: `${window.location.origin}?agent=${this.agencyCode}`,
        width: 1.17 * this.rem,
        height: 1.17 * this.rem,
        colorDark: '#000000',
        colorLight: '#ffffff',
      })
      setTimeout(() => {
        if (this.version <= 10 && this.isIos) {} 
        else {
          if (!this.QRcodeImg && this.QRCode) {
            Html2Canvas(this.$refs['qr-code'], {
              scale: 5,
              dpi: 500
            }).then(canvas => {
              const base64 = canvas.toDataURL("image/png");
              this.QRcodeImg = base64;
            });
          }
        }
      }, 800);
    }
  },
};
</script>

<style lang="less" type='text/less' scoped>
.container {
  width: 7.18rem;
  height: 5.11rem;
  margin: 0 auto;
  background-color: #fff;
  font-family: PingFang-SC-Medium, PingFang-SC;
  border-radius: 0.1rem 0.1rem 0 0;
  .tit {
    position: relative;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    border-bottom: 0.01rem solid #e7e7e7;
    color: #444444;
    font-size: 0.32rem;
    font-weight: bold;
    img {
      position: absolute;
      top: 50%;
      margin-top: -0.2rem;
      right: 0.16rem;
      width: 0.41rem;
      height: 0.41rem;
    }
  }
  .cont {
    .text {
      margin: 0.24rem;
      color: #888;
      font-size: 0.3rem;
      font-weight: 500;
    }
    .manner-group {
      display: flex;
      flex-direction: row;
      margin-top: 0.56rem;
      font-size: 0;
      .manner-item {
        position: relative;
        flex: 1;
        -webkit-touch-callout: default;
        -webkit-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;
        .img {
          width: 1.9835rem;
          height: 1.9835rem;
          &.qr-code {
            padding: .41rem;
            margin: 0 auto;
          }
        }
        .name {
          font-size: 0.28rem;
          color: #444444;
          font-weight: 500;
        }
        .des {
          font-size: 0.24rem;
          color: #888;
        }
        .QRcodeImg {
          position: absolute;
          top: .002rem;
          left: .812rem;
          width: 1.9835rem;
          height: 1.9835rem;
        }
      }
    }
  }
}
</style>