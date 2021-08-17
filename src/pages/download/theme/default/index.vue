<template>
  <div class="box">
    <div v-if="isShow">
      <div class="title">
        <img :src="logoImg" alt="">
        <span>{{$config.setName}}</span>
      </div>
      <a :href="url">
        <div class="down">
          <img class="logoIos" src="../../../../assets/img/download/default/ios.svg">
          <img class="logoAnd" src="../../../../assets/img/download/default/and.svg">
          <span class="text">APP下载</span>
        </div>
      </a>
      <div class="down" style="background:#ee9137;" @click="isShow=false">
        <img class="logoIos" src="../../../../assets/img/download/default/ios.svg">
        <span>IPhone安装教程</span>
      </div>
      <div class="down" style="background:#3ed100;" @click="$router.push('/')">
        <img class="mob" src="../../../../assets/img/download/default/mob.svg">
        <span>点击H5网页版</span>
      </div>
      <p>下载APP畅快体验 防劫持 速度快 不掉线 操作流畅</p>
      <p style="font-size: 12px">
        {{$config.setName}}版权所有 18+ 创新博弈 成功从{{$config.setName}}开始
      </p>
    </div>

    <div class="teach" v-if="!isShow">
      <img :src="helpImg" alt>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      isShow: true
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
  created () {
    let ua = window.navigator.userAgent.toLowerCase()
    if (/iphone/.test(ua) || /ipad/.test(ua)) {
      this.url = this.$config.download.ios
    } else if (/android/.test(ua)) {
      this.url = this.$config.download.android
    } else {
      console.log('您的移动设备暂不支持此APP，请谅解')
    }
  }
}
</script>

<style lang="less" scoped>
  .box {
    width: 100%;
    height: 100%;
    overflow: scroll;

    .teach {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .title {
      margin: auto;
      width: 2rem;
      padding-top: 8%;

      img {
        display: block;
        width: 100%;
      }

      span {
        display: block;
        text-align: center;
        margin: auto;
        font-size: 0.4rem;
        font-weight: bolder;
        letter-spacing: 2px;
        margin-top: 6%;
      }
    }

    .down {
      background-color: #37d6ee;
      font-family: "Microsoft YaHei", Arial, serif;
      width: 4.5rem;
      height: 1.12rem;
      margin: auto;
      margin-top: 6%;
      border-radius: 10px;
      color: #fff;
      font-size: .366rem;
      display: flex;
      align-items: center;

      .logoIos {
        width: 0.98rem;
        margin-left: .3rem;
      }

      .logoAnd {
        width: 0.8rem;
        margin-left: .1rem;

      }

      .text {
        margin-left: .2rem;
      }

      .mob {
        width: 0.8rem;
        margin-left: .4rem;
      }
    }

    p {
      font-size: 13px;
      letter-spacing: 1px;
      font-family: "Microsoft YaHei", Arial, serif;
      margin-top: 6%;
      color: #000;
    }
  }
</style>
