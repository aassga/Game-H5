<template>
  <view-page full-box>
    <title-header :title="$route.query.name" slot="header"></title-header>
    <div class="box" slot="content">
      <h3>长按保存图片至相册,打开{{$route.query.name}}钱包扫一扫</h3>
      <div class="qr-code ">
        <div id="save-qr-code" ref="save-qr-code"></div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import QRCode from 'qrcodejs2'

export default {
  name: 'QRCode',
  data () {
    return {
      qrCode: null
    }
  },
  updated () {
    this.checkQRCode()
  },
  methods: {
    checkQRCode () {
      if (!this.qrCode && this.$refs['save-qr-code']) {
        this.qrCode = new QRCode('save-qr-code', {
          width: 260,
          height: 260, // 高度
          text: this.$route.query.qrcode, // 二维码内容
          render: 'table' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f'
          // foreground: '#ff0'
        })
      }
    }
  },
  mounted () {
    this.checkQRCode()
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .box {
    text-align: center;
    position: relative;
    height: 100%;
    // background: #f1f1f1;
    background: #f6f6f8;

    h3 {
      font-size: 0.28rem;
      color: #333;
      margin-top: 0.3rem;
      margin-bottom: 0.45rem;
    }

    .qr-code {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      p {
        margin-top: 0.3rem;
        font-size: 0.26rem;
        color: #888;
      }

      /deep/ img {
        display: block;
        margin: 0 auto;
        user-select: all;
        -webkit-user-drag: none;
        -webkit-touch-callout: default;
      }
    }
  }
</style>
