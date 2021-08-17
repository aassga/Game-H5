<template>
  <view-page class="download-h5">
    <div slot="content">
      <div class="row clear-fix" style="display:none;">
        <img class="icon" :src="logoImg" alt/>
        <div class="content">
          <p class="title">
          <span class="title">
            {{$config.setName.split(/[\s-]/)[0]}}
            <img class="hot" src="../../../../assets/img/download/h5/hot.gif" alt/>
          </span>
          </p>
          <p class="actions">
            <a href="javascript:void(0)" class="btn-sm">稳定版</a>
            <a href="javascript:void(0)" class="btn-bg">安装</a>
          </p>
        </div>
      </div>
      <div class="row">
        <img class="icon" :src="logoImg" alt/>
        <div class="content">
          <p class="title">
          <span class="title">
            {{$config.setName.split(/[\s-]/)[0]}}
          </span>
          </p>
          <p class="actions">
            <a href="javascript:void(0)" class="btn-sm">H5版</a>
            <a href="#/download/theme/h5/website-information" class="btn-bg">安装</a>
          </p>
        </div>
      </div>
      <div class="info">
        <div class="info-row clear-fix">
          <div class="info-label">平台</div>
          <div class="info-value">iOS/Android</div>
        </div>
        <div class="info-row clear-fix">
          <div class="info-label">兼容性</div>
          <div class="info-value">iOS10.0以上/Android</div>
        </div>
      </div>
      <div class="qr-code-box">
        <div class="qr-code" ref="qr-code"></div>
        <p class="share-info">分享二维码领神秘彩金</p>
      </div>
      <div class="kf-footer">
        <a class="kf-btn" :href="getKF() || 'javascript:void(0)'" target="_blank">点击咨询在线客服</a>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import QRCode from 'qrcodejs2'

export default {
  name: 'index',
  computed: {
    link () {
      if (this.isAndroid) return this.$config.download.android
      else return this.$config.download.ios
    },
    logoImg () {
      return require('@site/assets/img/download/logo.png')
    },
    helpImg () {
      return require('@site/assets/img/download/help.jpg')
    }
  },
  data () {
    return {
      QRCode: null
    }
  },
  mounted () {
    const size = window.innerWidth / 7.5 * 3.6

    this.QRCode = new QRCode(this.$refs['qr-code'], {
      text: window.location.origin,
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .download-h5 {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    background: url("../../../../assets/img/download/h5/bg2.png") no-repeat bottom #FFFFFF;
    background-size: 100% auto;

    .row {
      width: 100%;
      height: 2.2rem;
      box-sizing: border-box;
      padding: 0.24rem 0.4rem;
      border-bottom: 0.02rem solid hsla(0, 0%, 95%, 1);

      .icon {
        width: 1.5rem;
        height: 1.5rem;
        display: block;
        box-sizing: border-box;
        margin-right: 0.6rem;
        float: left;
        border-radius: 0.2rem;
      }

      .content {
        float: left;
        display: block;
        box-sizing: border-box;
        width: 4.6rem;
        height: 1.72rem;
        padding: 0.24rem 0;
        text-align: left;

        .title {
          color: #8A8A8A;
          font-weight: bold;
          font-size: 0.3rem;

          .hot {
            width: 0.5rem;
            position: relative;
            top: -0.2rem;
          }
        }

        .actions {
          margin-top: 0.12rem;
          vertical-align: bottom;
        }

        .btn-sm {
          display: inline-block;
          margin-right: 0.3rem;
          width: 1.2rem;
          height: 0.52rem;
          border-radius: 0.1rem;
          border: 1px solid hsla(0, 0%, 95%, 1);
          font-size: 0.24rem;
          color: #6f6f6f;
          text-align: center;
          line-height: 0.5rem;
          vertical-align: bottom;
        }

        .btn-bg {
          display: inline-block;
          width: 2rem;
          height: 0.64rem;
          font-size: 0.28rem;
          border-radius: 0.1rem;
          background: linear-gradient(#00d661, #03c55b, #00d661);
          color: #fff;
          text-align: center;
          line-height: 0.64rem;
          vertical-align: bottom;
        }
      }
    }

    .info {
      padding: 0 0.4rem;
      width: 100%;
      box-sizing: border-box;
      margin-top: 0.1rem;

      .info-row {
        font-size: 0.24rem;
        color: #8A8A8A;
        line-height: 0.48rem;

        .info-label {
          float: left;
          width: 36%;
          text-align: left;
        }

        .info-value {
          float: left;
          width: 64%;
          text-align: right;
        }
      }
    }

    .qr-code-box {
      margin-top: 0.24rem;
      text-align: center;
      width: 100%;

      .qr-code {
        width: 3.6rem;
        height: 3.6rem;
        display: block;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0;
      }

      .share-info {
        font-size: 0.24rem;
        text-align: center;
        line-height: 0.6rem;
      }
    }

    .kf-footer {
      width: 100%;
      height: 1.4rem;
      background-color: rgba(51, 51, 51, 0.8);
      position: absolute;
      top: 100%;
      left: 0;
      transform: translateY(-100%);
      padding: 0.3rem 0;
      box-sizing: border-box;

      .kf-btn {
        display: inline-block;
        width: 6rem;
        height: 0.8rem;
        line-height: 0.8rem;
        border-radius: 0.16rem;
        background-color: #00d661;
        color: #fff;
        font-size: 0.32rem;
      }
    }
  }
</style>
