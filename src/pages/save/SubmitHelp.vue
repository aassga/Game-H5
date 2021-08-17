<template>
 <div class="content" v-if="$config.home==='amhg'">
    <van-tabs line-width="30%" v-if="id==='jc'">
      <van-tab title="微信转账教程">
        <img src="../../assets/img/save/amhg/wy_wx.png" alt="" />
      </van-tab>
      <van-tab title="支付宝转账教程">
        <img src="../../assets/img/save/amhg/wy_zfb.png" alt="" />
      </van-tab>
    </van-tabs>
    <div class="img-box">
      <img src="../../assets/img/save/amhg/wx_ka.png" v-if="id==='微信转卡'" alt />
      <img src="../../assets/img/save/amhg/zfb_ka.png" v-if="id==='支付宝转卡'" alt />
      <img src="../../assets/img/save/amhg/wx_z_wx.png" v-if="id==='微信转微信'" alt />
      <img src="../../assets/img/save/amhg/zfb_z_zfb.png" v-if="id==='支付宝转支付宝'" alt />
    </div>
 </div>
  <img class="help" :src="src" v-else alt/>
</template>

<script type="text/javascript">
export default {
  name: 'SubmitHelp',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    src () {
      if(this.$config.newQP || this.$config.blackTheme) {
        if (this.id === 'wx') {
          return require('../../assets/img/save/qp-wxzyhk.png')
        } else {
          return require('../../assets/img/save/qp-zfbzyhk.png')
        }
      }if(this.$config.blush){
        if (this.id === 'wx') {
          return require('../../assets/img/save/blush-wx.png')
        } else {
          return require('../../assets/img/save/blush-zfbzyhk.png')
        }
      }else {
        if (this.id === 'wx') {
          return require('../../assets/img/save/wxzyhk.png')
        } else {
          return require('../../assets/img/save/zfbzyhk.png')
        }
      }
    },

  }
}
</script>

<style lang="less" type='text/less' scoped>
  .help {
    width: 100%;
    display: block;
    margin: 0;
    padding: 0;
  }
  .content {
    /deep/.van-tabs__content {
      margin-top:0.2rem;
      .van-tab__pane {
        img {
          width:100%;
        }
      }
    }
    .img-box {
      img {
        width:100%;
      }
    }
  }
</style>

