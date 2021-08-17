<template>
  <view-page class="download-page" ref="view-page" :transfer-header="false" full-box>
    <div class="header" slot="header" style="background-color: #fff">
      <div class="download-header">
        <img class="logo" :src="logoImg" alt>
        <h4 class="title">{{$config.setName}}</h4>
        <p class="desc">与您共创未来</p>
        <div class="action">
          <a class="btn" v-if="!$store.state.main.downloadType || $store.state.main.downloadType === ''" id="downLoadApp" :href="link">点击下载</a>
          <a class="btn" v-else @click="downapp">点击下载</a>
          <a class="btn" href="javascript:void(0)" @click="$router.push('/')">H5移动端</a>
        </div>
      </div>
      <div style="width: 100%;padding-bottom: 0.1rem;border-bottom: 0.01rem solid #CACACA">
        <div class="clear-fix row">
          <span class="float-left label">平台</span>
          <span class="float-right value">iOS/Android</span>
        </div>
        <div class="clear-fix row">
          <span class="float-left label">兼容性</span>
          <span class="float-right value">iOS10.0以上/Android</span>
        </div>
      </div>
    </div>
    <img slot="content" class="help" :src="helpImg" alt/>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: 'DownloadXpj',
  data() {
    return {
      link: null,
      appdatas: "",
      installKey:""
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
  mounted() {
    setTimeout(() => {
      this.initDown();
    }, 300);
    if(this.$store.state.main.downloadType && this.$store.state.main.downloadType !== '') { 
      if ([ 'qxcp'].includes(this.$config.name)) {
        var str = window.location.href;
        var index = str.lastIndexOf("#");
        var rl = str.substring(0, index-3);
        this.appdatas = 'channelCode=' + rl;;
        if (this.$config.name === 'qxcp') {
          this.installKey = "6b20653cb665678d";
        }
        ShareTrace.init({
          appkey: this.installKey, // 此值必填
          param: this.appdatas,
        });
      }
    }
  },
  methods:{
    downapp(){
      ShareTrace.download()
    },
    initDown(){
      if (this.isAndroid) {
        this.link = window.localStorage.getItem('downloadAndroidLink');
      } else {
        this.link = window.localStorage.getItem('downloadIosLink');
      }
    }
  }
}
</script>

<style lang="less" type='text/less' scoped>
  .download-page {
    width: 100%;

    .clear-fix:after {
      content: '';
      display: table;
      clear: both;
    }

    .float-left {
      float: left;
    }

    .float-right {
      float: right;
    }

    .label {
      display: inline-block;
      font-size: 0.28rem;
      color: #444444;
    }

    .value {
      display: inline-block;
      font-size: 0.28rem;
      color: #999999;
    }

    .row {
      margin-top: 0.1rem;
      width: 100%;
      padding: 0.02rem 0.34rem;
      box-sizing: border-box;
    }

    .download-header {
      background: url("../../../../assets/img/download/xpj/bg.png") no-repeat;
      background-size: 100%;
      width: 100%;
      height: 4rem;
      padding-top: 0.4rem;
      border-bottom: 0.02rem solid #CACACA;
      box-sizing: border-box;

      .logo {
        margin: 0 auto;
        padding: 0;
        width: 1.46rem;
        height: 1.46rem;
        display: block;
        border-radius: 0.2rem;
      }

      .title {
        font-size: 0.38rem;
        margin-top: 0.24rem;
        line-height: 0.38rem;
        color: #666666;
        text-align: center;
      }

      .desc {
        color: #BEBEBE;
        font-size: 0.24rem;
        text-align: center;
        margin-top: 0.12rem;
        line-height: 0.24rem;
      }

      .action {
        margin: 0.22rem 0;
        text-align: center;
        height: 0.7rem;
        line-height: 0;

        .btn {
          text-decoration: none;
          display: inline-block;
          width: 2.9rem;
          height: 0.7rem;
          line-height: 0.7rem;
          color: white;
          text-align: center;
          border-radius: 0.1rem;
          font-size: 0.36rem;
          background: linear-gradient(120deg, #376dff, #55e8ff);

          &:first-child {
            margin-right: 0.5rem;
          }
        }
      }
    }

    .help {
      width: 100%;
      display: block;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
  }
</style>
